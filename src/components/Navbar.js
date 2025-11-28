import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ username, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>🚨 Traffic Violation Detection</h1>
        </div>
        
        <div className="navbar-menu">
          <button 
            className="nav-link"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
          <button 
            className="nav-link"
            onClick={() => navigate('/violations')}
          >
            Violations
          </button>
          <button 
            className="nav-link"
            onClick={() => navigate('/analysis')}
          >
            Analysis
          </button>
          <button 
            className="nav-link"
            onClick={() => navigate('/export')}
          >
            Export
          </button>
        </div>

        <div className="navbar-user">
          <span className="username">👤 {username}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
