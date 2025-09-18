import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div>
            <div className="welcome-section">
                <h1>Welcome, {user}!</h1>
            </div>
            <div className="options">
                <Link to="/attendance" className="option-card">
                    <div className="option-icon">📊</div>
                    <div className="option-title">Attendance</div>
                    <div className="option-description">Track your class attendance.</div>
                </Link>
                <Link to="/cgpa" className="option-card">
                    <div className="option-icon">📈</div>
                    <div className="option-title">CGPA Calculator</div>
                    <div className="option-description">Monitor your academic performance.</div>
                </Link>
            </div>
        </div>
    );
}

export default Dashboard;