import React, { useState, useEffect, useMemo } from 'react';
import './Analysis.css';

function Analysis() {
  const [analysisData, setAnalysisData] = useState(null);
  const [violationTypes, setViolationTypes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const fetchAnalysisData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      const [overviewRes, typesRes] = await Promise.all([
        fetch('http://localhost:5000/api/analysis/overview', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/analysis/violation-types', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (overviewRes.ok) {
        setAnalysisData(await overviewRes.json());
      }
      if (typesRes.ok) {
        setViolationTypes(await typesRes.json());
      }

      if (!overviewRes.ok || !typesRes.ok) {
        setError('Failed to fetch analysis data');
      }
    } catch (err) {
      setError('Connection error');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMaxValue = (data) => {
    if (!data || data.length === 0) return 1;
    return Math.max(...data.map(d => d[1]));
  };

  // Simple SVG Bar Chart (horizontal)
  const BarChart = ({ data }) => {
    const max = getMaxValue(data);
    const height = 28 * data.length + 20;
    const width = 680;
    return (
      <svg className="svg-chart" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {data.map((d, i) => {
          const barWidth = Math.max(4, (d[1] / max) * (width - 180));
          const y = 20 + i * 28;
          return (
            <g key={i} transform={`translate(0, ${y})`}>
              <text x={12} y={12} className="svg-label">{d[0]}</text>
              <rect x={160} y={0} width={barWidth} height={16} rx={8} className="svg-bar" />
              <text x={160 + barWidth + 8} y={12} className="svg-value">{d[1]}</text>
            </g>
          );
        })}
      </svg>
    );
  };

  // Simple SVG Line Chart for timeline
  // Timeline chart removed per request

  return (
    <div className="analysis-page">
      <div className="container">
        <h1 className="page-title">Analytics & Analysis</h1>

        {error && <div className="error-box">{error}</div>}

        {loading ? (
          <div className="loading">Loading analysis data...</div>
        ) : (
          <>
            <div className="tab-buttons">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                📊 Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'types' ? 'active' : ''}`}
                onClick={() => setActiveTab('types')}
              >
                🏷️ Violation Types
              </button>
            </div>

            {activeTab === 'overview' && analysisData && (
              <div className="analysis-section">
                <div className="analysis-grid">
                  <div className="analysis-card">
                    <h3>Overall Statistics</h3>
                    <div className="stat-list">
                      <div className="stat-row">
                        <span>Total Violations:</span>
                        <strong className="value">{analysisData.total_violations}</strong>
                      </div>
                      <div className="stat-row">
                        <span>Total Vehicles:</span>
                        <strong className="value">{analysisData.total_vehicles}</strong>
                      </div>
                      <div className="stat-row">
                        <span>Total Persons:</span>
                        <strong className="value">{analysisData.total_persons}</strong>
                      </div>
                      <div className="stat-row">
                        <span>Total Fines:</span>
                        <strong className="value green">₹{analysisData.total_fines || 0}</strong>
                      </div>
                      <div className="stat-row">
                        <span>Paid Fines:</span>
                        <strong className="value green">₹{analysisData.paid_fines || 0}</strong>
                      </div>
                      <div className="stat-row">
                        <span>Pending Fines:</span>
                        <strong className="value orange">₹{analysisData.pending_fines || 0}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="analysis-card">
                    <h3>Violation Breakdown</h3>
                    <div className="stat-list">
                      <div className="stat-row">
                        <span>🏍️ No Helmet:</span>
                        <strong className="value orange">{analysisData.total_no_helmet}</strong>
                      </div>
                      <div className="stat-row">
                        <span>🚗 Triple Riding:</span>
                        <strong className="value red">{analysisData.total_triple_riding}</strong>
                      </div>
                      <div className="stat-row">
                        <span>🔴 No Number Plate:</span>
                        <strong className="value">{analysisData.total_no_number_plate}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="analysis-card full-width">
                    <h3>Violation Type Distribution</h3>
                    <BarChart 
                      data={Object.entries(analysisData.violation_types)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Timeline removed */}

            {activeTab === 'types' && violationTypes && (
              <div className="analysis-section">
                <div className="violation-types-grid">
                  {Object.entries(violationTypes).map(([type, data]) => (
                    <div key={type} className="type-card">
                      <h3>{type.replace(/_/g, ' ').toUpperCase()}</h3>
                      <div className="type-count">{data.count}</div>
                      <p className="type-instances">Instances detected</p>
                      {data.details.length > 0 && (
                        <div className="type-details">
                          <p>Latest incidents:</p>
                          <ul>
                            {data.details.slice(0, 3).map((detail, idx) => (
                              <li key={idx}>
                                Image: {detail.image.split('/').pop()}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Analysis;
