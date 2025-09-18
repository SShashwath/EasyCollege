# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS

# Import your scraper functions from the 'scrapers' directory
from scrapers.name import return_data as name_return_data
from scrapers.bunkr import return_data as bunkr_return_data
# ... import other scraper functions as you build them

app = Flask(__name__)

# Configure CORS to allow requests from your Vercel frontend
# In production, replace "*" with your actual frontend URL for better security
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route("/api/health", methods=["GET"])
def health_check():
    """A simple endpoint to confirm the API is running."""
    return jsonify({"status": "healthy"}), 200

@app.route("/api/login", methods=["POST"])
def login():
    """Handles user login and authentication."""
    try:
        data = request.get_json()
        roll_number = data.get("roll_number")
        password = data.get("password")

        if not roll_number or not password:
            return jsonify({"success": False, "error": "Missing credentials"}), 400

        # Use your scraper to authenticate
        authenticated_user = name_return_data(roll_number, password)
        
        if authenticated_user:
            # For a real app, generate and return a JWT (JSON Web Token) here
            return jsonify({
                "success": True, 
                "message": "Login successful",
                "user": authenticated_user
            })
        else:
            return jsonify({"success": False, "error": "Invalid credentials"}), 401

    except Exception as e:
        # Log the error in a real application
        print(f"Login error: {e}")
        return jsonify({"success": False, "error": "An internal server error occurred"}), 500

# --- Add other endpoints for attendance, CGPA, etc. here ---
# Example:
# @app.route("/api/attendance", methods=["POST"])
# def get_attendance():
#     # ... your logic here ...
#     pass

if __name__ == '__main__':
    # Runs the app in debug mode for local development
    app.run(debug=True, port=5001)