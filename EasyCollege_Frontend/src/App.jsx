import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout and Authentication
import Navbar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute';
import GoogleAnalyticsTracker from './components/GoogleAnalyticsTracker';

// Page Components
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Cgpa from './pages/Cgpa';

function App() {
    return (
        <Router>
            <Navbar />
            <GoogleAnalyticsTracker />
            <main className="container">
                <Routes>
                    {/* Public Route */}
                    <Route path="/" element={<Login />} />

                    {/* Private Routes */}
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
                    <Route path="/cgpa" element={<PrivateRoute><Cgpa /></PrivateRoute>} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;