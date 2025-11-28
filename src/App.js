import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Violations from './pages/Violations';
import Analysis from './pages/Analysis';
import Fines from './pages/Fines';
import Export from './pages/Export';
import Sidebar from './components/Sidebar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (token, username) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', username);
    setIsAuthenticated(true);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className={`App ${isAuthenticated ? '' : 'no-sidebar'}`}>
        {isAuthenticated && <Sidebar username={user} onLogout={handleLogout} />}
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route 
            path="/violations" 
            element={isAuthenticated ? <Violations /> : <Navigate to="/login" />}
          />
          <Route 
            path="/analysis" 
            element={isAuthenticated ? <Analysis /> : <Navigate to="/login" />}
          />
          <Route 
            path="/fines" 
            element={isAuthenticated ? <Fines /> : <Navigate to="/login" />}
          />
          <Route 
            path="/export" 
            element={isAuthenticated ? <Export /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
