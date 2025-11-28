import React, { useState, useEffect } from 'react';
import './Violations.css';

function Violations() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedViolation, setSelectedViolation] = useState(null);

  useEffect(() => {
    fetchViolations();
  }, [page]);

  const fetchViolations = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `http://localhost:5000/api/violations?page=${page}&per_page=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setViolations(data.data);
        setTotalPages(data.pagination.pages);
      } else {
        setError('Failed to fetch violations');
      }
    } catch (err) {
      setError('Connection error');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getViolationTypeColor = (count) => {
    if (count === 0) return '#4caf50';
    if (count === 1) return '#ff9800';
    return '#f44336';
  };

  const getViolationBadges = (violation) => {
    const badges = [];
    const violations_obj = violation.violations || {};

    Object.entries(violations_obj).forEach(([type, items]) => {
      if (Array.isArray(items) && items.length > 0) {
        let label = type.replace(/_/g, ' ').toUpperCase();
        badges.push({
          label,
          count: items.length,
          type
        });
      }
    });

    return badges;
  };

  return (
    <div className="violations-page">
      <div className="container">
        <h1 className="page-title">Violations Report</h1>

        {error && <div className="error-box">{error}</div>}

        {loading ? (
          <div className="loading">Loading violations...</div>
        ) : (
          <>
            <div className="violations-list">
              {violations.length === 0 ? (
                <div className="no-data">No violations found</div>
              ) : (
                violations.map((violation, idx) => {
                  const badges = getViolationBadges(violation);
                  return (
                    <div 
                      key={idx}
                      className="violation-card"
                      onClick={() => setSelectedViolation(selectedViolation === idx ? null : idx)}
                    >
                      <div className="violation-header">
                        <div className="violation-info">
                          <h3>Violation #{(page - 1) * 10 + idx + 1}</h3>
                          <p className="timestamp">📅 {violation.timestamp}</p>
                        </div>
                        <div className="violation-stats">
                          <span className="total-violations">
                            Total: <strong>{violation.total_violations}</strong>
                          </span>
                          <span className="vehicle-count">
                            🚙 {violation.vehicle_count}
                          </span>
                          <span className="person-count">
                            👥 {violation.person_count}
                          </span>
                        </div>
                      </div>

                      {badges.length > 0 && (
                        <div className="violation-badges">
                          {badges.map((badge, bidx) => (
                            <span 
                              key={bidx}
                              className="badge"
                              style={{ background: getViolationTypeColor(badge.count) }}
                            >
                              {badge.label} ({badge.count})
                            </span>
                          ))}
                        </div>
                      )}

                      {selectedViolation === idx && (
                        <div className="violation-details">
                          <h4>Detailed Information</h4>
                          <div className="details-content">
                            {violation.image && (
                              <div className="image-preview">
                                <img 
                                  src={`http://localhost:5000/api/images/${violation.image}`}
                                  alt="Violation"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `
                                      <div class="image-placeholder">
                                        📷 Image Preview<br/>
                                        <small style="font-size: 12px; color: rgba(255,255,255,0.8); margin-top: 8px;">
                                          ${violation.image}
                                        </small>
                                        <div class="no-image-msg">
                                          Image file location not found
                                        </div>
                                      </div>
                                    `;
                                  }}
                                />
                              </div>
                            )}
                            <p><strong>Image Path:</strong> {violation.image}</p>
                            <p><strong>Output Path:</strong> {violation.output || 'N/A'}</p>
                            
                            {violation.fines && (
                              <div className="fines-info">
                                <strong>💰 Fine Information:</strong>
                                <div className="fines-detail">
                                  <p>Total Fines: <span className="fine-amount">₹{violation.fines.total_fines}</span></p>
                                  <p>Pending: <span className="pending-amount">₹{violation.fines.pending_fines}</span></p>
                                  <p>Paid: <span className="paid-amount">₹{violation.fines.paid_fines}</span></p>
                                  <p>Total Violations: {violation.fines.fines_list.length}</p>
                                </div>
                              </div>
                            )}
                            
                            {Object.entries(violation.violations || {}).map(([type, items]) => (
                              items.length > 0 && (
                                <div key={type} className="detail-section">
                                  <strong>{type.replace(/_/g, ' ').toUpperCase()}:</strong>
                                  <pre>{JSON.stringify(items, null, 2)}</pre>
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="pagination">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="page-btn"
              >
                ← Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="page-btn"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Violations;
