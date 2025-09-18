// src/pages/Attendance.jsx
import React, { useState, useEffect } from 'react';

function Attendance() {
    const [attendanceData, setAttendanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAttendance = async () => {
            const credentials = JSON.parse(localStorage.getItem('credentials'));
            const apiUrl = import.meta.env.VITE_API_BASE_URL;
            try {
                const response = await fetch(`${apiUrl}/api/attendance`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials)
                });
                const data = await response.json();
                if (response.ok) {
                    setAttendanceData(data);
                } else {
                    setError(data.error || 'Failed to fetch data.');
                }
            } catch (err) {
                console.error("Attendance API call failed:", err);
                setError('An error occurred. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    if (isLoading) return <div className="loading-text">Loading Attendance...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="content">
            <div className="page-header">
                <h1>Attendance Tracker</h1>
                <p>Monitor your class attendance and stay on top of your academic requirements.</p>
            </div>
            {attendanceData.length > 0 ? (
                attendanceData.map((course, index) => (
                    <div className="attendance-card" key={index}>
                        <div className="course-header">
                            <div className="course-name">{course.course_name}</div>
                            <div className="course-code">{course.course_code}</div>
                        </div>
                        <div className="attendance-stats">
                            <div className="stat-item">
                                <div className="stat-label">Physical Attendance</div>
                                <div className="stat-value">{course.physical_attendance}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-label">With Exemption</div>
                                <div className="stat-value">{course.with_exemption}</div>
                            </div>
                        </div>
                        <div className="status-section">
                            <div className="status-item">
                                <div className="status-label">{course.status}</div>
                                <div className="status-value">{course.count}</div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No attendance data available.</p>
            )}
        </div>
    );
}

export default Attendance;