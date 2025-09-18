// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <div>
            <div className="welcome-section"><h1>Welcome, {user}!</h1></div>
            <div className="options">
                <Link to="/attendance" className="option-card">
                    <div className="option-icon">📊</div>
                    <div className="option-title">Attendance</div>
                    <div className="option-description">Track your class attendance.</div>
                </Link>
                <Link to="/gpa" className="option-card">
                    <div className="option-icon">📈</div>
                    <div className="option-title">GPA Calculator</div>
                    <div className="option-description">Calculate your semester GPA.</div>
                </Link>
                <Link to="/cgpa" className="option-card">
                    <div className="option-icon">🎯</div>
                    <div className="option-title">CGPA Calculator</div>
                    <div className="option-description">Monitor your cumulative GPA.</div>
                </Link>
                <Link to="/feedback" className="option-card">
                    <div className="option-icon">💬</div>
                    <div className="option-title">Feedback</div>
                    <div className="option-description">Automate the feedback process.</div>
                </Link>
            </div>
        </div>
    );
}
export default Dashboard;