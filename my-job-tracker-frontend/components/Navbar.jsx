// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/auth'; // Assuming you have this function

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login'); // Redirect to login page after logout
  };

  // Simple authentication check for showing/hiding logout
  const isAuthenticated = () => !!localStorage.getItem('token');

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#333', color: 'white', position: 'fixed', width: '100%', top: 0, left: 0, zIndex: 1000 }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/customers" style={{ color: 'white', textDecoration: 'none' }}>Customers</Link>
        <Link to="/jobs" style={{ color: 'white', textDecoration: 'none' }}>Jobs</Link>
        <Link to="/pipelines" style={{ color: 'white', textDecoration: 'none' }}>Pipelines</Link>
        <Link to="/users" style={{ color: 'white', textDecoration: 'none' }}>Users</Link>
        <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
      </div>
      <div>
        {isAuthenticated() && (
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid white', color: 'white', padding: '5px 10px', cursor: 'pointer' }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;