// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute';
import GoogleAnalyticsTracker from './components/GoogleAnalyticsTracker';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Gpa from './pages/Gpa';
import Cgpa from './pages/Cgpa';
import Feedback from './pages/Feedback';

function App() {
    return (
        <Router>
            <Navbar />
            <GoogleAnalyticsTracker />
            <main className="container">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
                    <Route path="/gpa" element={<PrivateRoute><Gpa /></PrivateRoute>} />
                    <Route path="/cgpa" element={<PrivateRoute><Cgpa /></PrivateRoute>} />
                    <Route path="/feedback" element={<PrivateRoute><Feedback /></PrivateRoute>} />
                </Routes>
            </main>
        </Router>
    );
}
export default App;