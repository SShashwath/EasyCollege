// src/pages/Cgpa.jsx
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Cgpa() {
    const [cgpaData, setCgpaData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCgpa = async () => {
            const credentials = JSON.parse(localStorage.getItem('credentials'));
            const apiUrl = import.meta.env.VITE_API_BASE_URL;
            try {
                const response = await fetch(`${apiUrl}/api/cgpa`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials)
                });
                const data = await response.json();
                if (response.ok) {
                    setCgpaData(data);
                } else {
                    setError(data.error || 'Failed to fetch CGPA data.');
                }
            } catch (err) {
                console.error("CGPA API call failed:", err);
                setError('An error occurred while fetching CGPA data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCgpa();
    }, []);

    if (isLoading) return <div className="loading-text">Loading CGPA...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!cgpaData || !cgpaData.semwise_data) return <p>No CGPA data found.</p>;

    const chartData = {
        labels: cgpaData.semwise_data.map(d => `Sem ${d.sem}`),
        datasets: [
            {
                label: 'SGPA',
                data: cgpaData.semwise_data.map(d => d.sgpa),
                borderColor: '#ff69b4',
                backgroundColor: 'rgba(255, 105, 180, 0.2)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'CGPA',
                data: cgpaData.semwise_data.map(d => d.cgpa),
                borderColor: '#00bfff',
                backgroundColor: 'rgba(0, 191, 255, 0.2)',
                fill: true,
                tension: 0.4,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { labels: { color: 'white' } },
            title: { display: true, text: 'Academic Performance', color: 'white' },
        },
        scales: {
            x: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            y: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } }
        }
    };

    return (
        <div className="login-container">
            <h2>Overall CGPA: {cgpaData.cgpa}</h2>
            <div className="chart-container" style={{ marginTop: '20px' }}>
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}

export default Cgpa;