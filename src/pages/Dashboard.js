import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:5000/api/analysis/overview', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Failed to fetch statistics');
      }
    } catch (err) {
      setError('Connection error');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="page-title">Dashboard Overview</h1>

        {error && <div className="error-box">{error}</div>}

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-label">Total Violations</div>
                <div className="stat-value">{stats.total_violations}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏍️</div>
              <div className="stat-content">
                <div className="stat-label">No Helmet</div>
                <div className="stat-value">{stats.total_no_helmet}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🚗</div>
              <div className="stat-content">
                <div className="stat-label">Triple Riding</div>
                <div className="stat-value">{stats.total_triple_riding}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔴</div>
              <div className="stat-content">
                <div className="stat-label">No Number Plate</div>
                <div className="stat-value">{stats.total_no_number_plate}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-label">Total Fines</div>
                <div className="stat-value">₹{stats.total_fines || 0}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-label">Paid Fines</div>
                <div className="stat-value">₹{stats.paid_fines || 0}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <div className="stat-label">Pending Fines</div>
                <div className="stat-value">₹{stats.pending_fines || 0}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🚙</div>
              <div className="stat-content">
                <div className="stat-label">Total Vehicles</div>
                <div className="stat-value">{stats.total_vehicles}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-label">Total Persons</div>
                <div className="stat-value">{stats.total_persons}</div>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-sections">
          <div className="info-card">
            <h2>Quick Info</h2>
            <ul>
              <li>✅ Real-time traffic violation detection system</li>
              <li>🎯 Detects multiple violation types simultaneously</li>
              <li>📈 Comprehensive analytics and reporting</li>
              <li>💾 Data export functionality</li>
              <li>🔐 Secure authentication system</li>
            </ul>
          </div>

          <div className="info-card">
            <h2>Navigation Guide</h2>
            <ul>
              <li><strong>Violations:</strong> View all detected violations with details</li>
              <li><strong>Analysis:</strong> In-depth analytics and trends</li>
              <li><strong>Export:</strong> Download data in CSV/JSON format</li>
              <li><strong>Dashboard:</strong> Quick overview of statistics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
