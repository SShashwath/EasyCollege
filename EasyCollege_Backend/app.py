# EasyCollege_Backend/app.py

import os
import math
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import requests

# Load environment variables from .env file
load_dotenv()

# Import your scraper functions
from scrapers.name import return_data as name_return_data
from scrapers.bunkr import return_data as bunkr_return_data
from scrapers.calc import return_data as calc_return_data
from scrapers.cgpa_calculator import return_data as cgpa_calculator_return_data
from scrapers.Timetable import get_timetable

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY')

# In production, you should restrict this to your actual Vercel frontend URL
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route("/api/health", methods=["GET"])
def health_check():
    """A simple endpoint to confirm the API is running."""
    return jsonify({"status": "healthy"}), 200

@app.route("/api/login", methods=["POST"])
def login():
    """Handles user login."""
    try:
        data = request.get_json()
        roll_number = data.get("roll_number")
        password = data.get("password")

        if not roll_number or not password:
            return jsonify({"success": False, "error": "Missing credentials"}), 400

        authenticated_user = name_return_data(roll_number, password)
        
        if authenticated_user:
            return jsonify({
                "success": True, 
                "message": "Login successful",
                "user": authenticated_user
            })
        else:
            return jsonify({"success": False, "error": "Invalid credentials"}), 401
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"success": False, "error": "An internal server error occurred"}), 500

@app.route('/api/attendance', methods=['POST'])
def get_attendance():
    """Fetches and processes attendance data."""
    try:
        credentials = request.get_json()
        name = credentials.get("name")
        password = credentials.get("password")

        rows = bunkr_return_data(name, password)
        timetable = get_timetable(name, password)

        if rows is None:
            return jsonify({"error": "Attendance data is currently unavailable."}), 404

        results = []
        for row in rows[1:]: # Skip header row
            columns = row.find_all('td')
            row_data = [column.get_text(strip=True) for column in columns]
            if not row_data or len(row_data) < 8: continue

            percentage = int(row_data[5])
            present_hours = int(row_data[4])
            total_hours = int(row_data[1])
            threshold = 0.75
            
            status_text = ""
            bunk_or_attend_count = 0

            if percentage >= 75:
                status_text = "Remaining bunks"
                bunk_or_attend_count = math.floor((present_hours - (threshold * total_hours)) / threshold)
            else:
                status_text = "Classes to attend"
                bunk_or_attend_count = math.ceil(((threshold * total_hours) - present_hours) / (1 - threshold))
            
            results.append({
                "course_code": row_data[0],
                "course_name": timetable.get(row_data[0], "Unknown Course"),
                "physical_attendance": f"{percentage}%",
                "with_exemption": row_data[6] + "%",
                "status": status_text,
                "count": bunk_or_attend_count,
            })
        
        return jsonify(results)
    except Exception as e:
        print(f"Attendance error: {e}")
        return jsonify({"error": "Failed to process attendance data"}), 500

@app.route('/api/gpa', methods=['POST'])
def get_gpa():
    """Fetches and calculates semester GPA."""
    try:
        credentials = request.get_json()
        rows = calc_return_data(credentials.get("name"), credentials.get("password"))
        if rows is None:
            return jsonify({"error": "GPA data is currently unavailable."}), 404

        table_data = []
        total_credits = 0
        summation = 0
        gpa_result = None
        
        # Find the most recent semester
        semesters = [int(r.find_all('td')[0].get_text(strip=True)) for r in rows[1:] if r.find_all('td') and r.find_all('td')[0].get_text(strip=True).isdigit()]
        latest_sem = max(semesters) if semesters else 0

        for row in rows[1:]: # Skip header
            columns = row.find_all('td')
            data = [col.get_text(strip=True) for col in columns]
            
            if not data or len(data) < 5: continue
            
            sem_str = data[0]
            current_sem = int(sem_str) if sem_str.isdigit() else latest_sem

            if current_sem == latest_sem:
                credits = int(data[3])
                grade = data[4]
                
                table_data.append({"course": data[1], "title": data[2], "grade": grade, "credits": credits})
                total_credits += credits

                if grade.upper().startswith("RA"):
                    gpa_result = 0
                elif grade.isdigit() and gpa_result != 0:
                    summation += credits * int(grade)

        gpa = 0
        if gpa_result != 0 and total_credits > 0:
            gpa = round(summation / total_credits, 2)
        
        return jsonify({"table": table_data, "gpa": gpa, "total_credits": total_credits})

    except Exception as e:
        print(f"GPA error: {e}")
        return jsonify({"error": "Failed to process GPA data"}), 500

@app.route('/api/cgpa', methods=['POST'])
def get_cgpa():
    """Fetches and calculates overall CGPA and SGPA per semester."""
    try:
        credentials = request.get_json()
        rows = cgpa_calculator_return_data(credentials.get("name"), credentials.get("password"))
        if rows is None: return jsonify({"error": "CGPA data not available."}), 404

        grades = {'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5}
        sem_data = {}
        
        for row in rows[2:-2]: # Logic from old index.py
            columns = row.find_all('td')
            data = [col.get_text(strip=True) for col in columns]
            if len(data) > 7 and data[7].isdigit() and int(data[7]) > 0 and data[3] != "OEL":
                grade_points = grades.get(data[6], 0)
                credits = int(data[7])
                sem = int(data[4])
                sem_data.setdefault(sem, []).append((grade_points, credits))

        semwise_data, cumulative_cp, cumulative_credits = [], 0, 0
        for sem, grades_list in sorted(sem_data.items()):
            sem_cp = sum(gp * cr for gp, cr in grades_list)
            sem_credits = sum(cr for _, cr in grades_list)
            cumulative_cp += sem_cp
            cumulative_credits += sem_credits
            semwise_data.append({
                'sem': sem,
                'sgpa': round(sem_cp / sem_credits, 2) if sem_credits else 0,
                'cgpa': round(cumulative_cp / cumulative_credits, 2) if cumulative_credits else 0
            })

        final_cgpa = semwise_data[-1]['cgpa'] if semwise_data else 0
        return jsonify({'cgpa': final_cgpa, 'semwise_data': semwise_data})
        
    except Exception as e:
        print(f"CGPA error: {e}")
        return jsonify({"error": "Failed to process CGPA data"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)