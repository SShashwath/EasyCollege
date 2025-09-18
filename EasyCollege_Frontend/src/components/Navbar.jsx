import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('user');

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('credentials');
        navigate('/');
    };

    return (
        <nav className="navbar">
            <Link to={isLoggedIn ? "/dashboard" : "/"} className="logo">Easy College</Link>
            <div className="navbar-links">
                {isLoggedIn ? (
                    <>
                        <a href="mailto:campuslyapi@gmail.com">Contact</a>
                        <a href="/about">About</a>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                       <a href="mailto:campuslyapi@gmail.com">Contact</a>
                       <a href="/about">About</a>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;