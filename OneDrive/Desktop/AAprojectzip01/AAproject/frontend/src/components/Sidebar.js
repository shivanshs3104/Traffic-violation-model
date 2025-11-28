import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ username, onLogout }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">🚨 Traffic</h2>
          <button 
            className="toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
            title={isOpen ? 'Close' : 'Open'}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <button 
            className="sidebar-link"
            onClick={() => handleNavigate('/dashboard')}
          >
            <span className="icon">📊</span>
            <span className="label">Dashboard</span>
          </button>

          <button 
            className="sidebar-link"
            onClick={() => handleNavigate('/violations')}
          >
            <span className="icon">⚠️</span>
            <span className="label">Violations</span>
          </button>

          <button 
            className="sidebar-link"
            onClick={() => handleNavigate('/analysis')}
          >
            <span className="icon">📈</span>
            <span className="label">Analysis</span>
          </button>

          <button 
            className="sidebar-link"
            onClick={() => handleNavigate('/fines')}
          >
            <span className="icon">💰</span>
            <span className="label">Fines</span>
          </button>

          <button 
            className="sidebar-link"
            onClick={() => handleNavigate('/export')}
          >
            <span className="icon">📥</span>
            <span className="label">Export</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-icon">👤</div>
            <div className="user-details">
              <div className="user-name">{username}</div>
              <div className="user-status">Active</div>
            </div>
          </div>
          <button 
            className="logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            🚪
          </button>
        </div>
      </aside>

      {/* Toggle button for mobile */}
      <button 
        className="sidebar-toggle-mobile"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>
    </>
  );
}

export default Sidebar;
