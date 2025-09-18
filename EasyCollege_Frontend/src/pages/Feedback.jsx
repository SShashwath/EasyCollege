// src/pages/Feedback.jsx
import React, { useState } from 'react';

function Feedback() {
    const [feedbackType, setFeedbackType] = useState('0');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);
        
        const credentials = JSON.parse(localStorage.getItem('credentials'));
        const apiUrl = import.meta.env.VITE_API_BASE_URL;

        try {
            const response = await fetch(`${apiUrl}/api/run-feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rollno: credentials.name,
                    password: credentials.password,
                    feedback_type: feedbackType
                })
            });
            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error("Feedback API call failed:", err);
            setResult({ error: 'Failed to connect to the feedback service.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="feedback-container">
            <h1>Feedback Automation</h1>
            <p>Select the type of feedback you want to automate.</p>
            
            <form onSubmit={handleSubmit}>
                <div className="feedback-options">
                    <label>
                        <input type="radio" name="feedback_type" value="0" checked={feedbackType === '0'} onChange={e => setFeedbackType(e.target.value)} />
                        End-Sem
                    </label>
                    <label>
                        <input type="radio" name="feedback_type" value="1" checked={feedbackType === '1'} onChange={e => setFeedbackType(e.target.value)} />
                        Intermediate
                    </label>
                </div>
                <button type="submit" className="start-btn" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Start Automation'}
                </button>
            </form>

            {result && (
                <div className={`result-message ${result.error ? 'error' : 'success'}`}>
                    {result.message || result.error}
                </div>
            )}
        </div>
    );
}

export default Feedback;