import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [rollNumber, setRollNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roll_number: rollNumber, password: password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('credentials', JSON.stringify({ name: rollNumber, password }));
                navigate('/dashboard');
            } else {
                setError(data.error || 'Login failed!');
            }
        } catch (err) {
            // **FIX: Use the 'err' variable by logging it to the console**
            console.error("Login API call failed:", err);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="login-container">
            <h1 className="welcome-text">Welcome</h1>
            <p className="subtitle">Sign in to your account</p>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={rollNumber} 
                    onChange={e => setRollNumber(e.target.value)} 
                    placeholder="Roll Number" 
                    className="input-field"
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Password" 
                    className="input-field"
                    required 
                />
                <button type="submit" className="login-btn" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}

export default Login;