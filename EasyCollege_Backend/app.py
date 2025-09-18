# EasyCollege_Backend/app.py

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

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

# Configure CORS
CORS(app, resources={r"/api/*": {"origins": "*"}}) # Allow all origins for now

@app.route("/api/health", methods=["GET"])
def health_check():
    """Confirms the API is running."""
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

if __name__ == '__main__':
    app.run(debug=True, port=5001)