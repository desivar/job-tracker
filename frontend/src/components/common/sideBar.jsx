import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const SideBar = () => {
  return (
    <aside className="sidebar">
        <Link to="/" className="sidebar-logo">
        P
        </Link>
      <nav className="sidebar-nav">
        {/* Use Link to navigate to the Jobs route */}
        <Link to="/jobs" className="nav-item">Jobs</Link>

        <Link to="/" className="nav-item">📋️</Link>   

        <Link to="/" className="nav-item">️️️️️✉️</Link>
      </nav>
    </aside>
  );
};

export default SideBar;