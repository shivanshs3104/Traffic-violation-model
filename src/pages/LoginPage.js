import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.access_token, data.username);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Make sure backend is running on localhost:5000');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-split">
        {/* Left: Branding & Info */}
        <div className="login-info">
          <div className="brand">
            <div className="brand-icon">🚨</div>
            <h1 className="brand-title">Traffic Violation Detection</h1>
            <p className="brand-subtitle">Smart AI-powered monitoring</p>
          </div>
          <ul className="brand-points">
            <li>Real-time detection of helmet and number plate violations</li>
            <li>Dashboard analytics and violation breakdown</li>
            <li>Fines management with payment tracking</li>
            <li>Secure access with JWT authentication</li>
          </ul>
        </div>

        {/* Right: Login Box */}
        <div className="login-box">
          <div className="login-header">
            <h2>Welcome back</h2>
            <p>Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
