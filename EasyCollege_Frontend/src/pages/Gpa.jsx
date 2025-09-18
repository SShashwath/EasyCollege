// src/pages/Gpa.jsx
import React, { useState, useEffect } from 'react';

function Gpa() {
    const [gpaData, setGpaData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGpa = async () => {
            const credentials = JSON.parse(localStorage.getItem('credentials'));
            const apiUrl = import.meta.env.VITE_API_BASE_URL;
            try {
                const response = await fetch(`${apiUrl}/api/gpa`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials)
                });
                const data = await response.json();
                if (response.ok) {
                    setGpaData(data);
                } else {
                    setError(data.error || 'Failed to fetch GPA data.');
                }
            } catch (err) {
                console.error("GPA API call failed:", err);
                setError('An error occurred while fetching GPA data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchGpa();
    }, []);
    
    if (isLoading) return <div className="loading-text">Loading GPA...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!gpaData) return <p>No GPA data found.</p>;

    return (
        <div className="gpa-container">
            <div className="page-header">
                <h1>GPA Calculator</h1>
                <p>Your grade point average for the most recent semester.</p>
            </div>
            <div className="summary-cards">
                <div className="summary-card">
                    <div className="summary-label">Total Credits</div>
                    <div className="summary-value">{gpaData.total_credits}</div>
                </div>
                <div className="summary-card">
                    <div className="summary-label">Current GPA</div>
                    <div className="summary-value gpa-value">{gpaData.gpa}</div>
                </div>
            </div>
            <div className="table-container">
                <table className="gpa-table">
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Credits</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gpaData.table.map((course, index) => (
                        <tr key={index}>
                            <td>{course.title}</td>
                            <td><span className="credits-badge">{course.credits}</span></td>
                            <td><span className={`grade-badge grade-${course.grade.replace('+', '')}`}>{course.grade}</span></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Gpa;