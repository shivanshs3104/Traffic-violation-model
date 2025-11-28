import React, { useState, useEffect } from 'react';
import './Fines.css';

function Fines() {
  const [finesSummary, setFinesSummary] = useState(null);
  const [finesList, setFinesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentModal, setPaymentModal] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  useEffect(() => {
    fetchFinesSummary();
    fetchFinesList();
  }, [page, statusFilter]);

  const fetchFinesSummary = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:5000/api/fines/summary', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFinesSummary(data);
      } else {
        setError('Failed to fetch fines summary');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchFinesList = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const url = statusFilter
        ? `http://localhost:5000/api/fines/all?page=${page}&per_page=10&status=${statusFilter}`
        : `http://localhost:5000/api/fines/all?page=${page}&per_page=10`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFinesList(data.data);
        setTotalPages(data.pagination.pages);
      } else {
        setError('Failed to fetch fines list');
      }
    } catch (err) {
      setError('Connection error');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (fine) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:5000/api/fines/mark-paid', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          violation_idx: fine.violation_index,
          fine_id: fine.fine_id,
          payment_method: paymentMethod,
        }),
      });

      if (response.ok) {
        setError('');
        setPaymentModal(null);
        setPaymentMethod('cash');
        fetchFinesSummary();
        fetchFinesList();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to mark fine as paid');
      }
    } catch (err) {
      setError('Connection error');
      console.error('Error:', err);
    }
  };

  const getViolationColor = (type) => {
    const colors = {
      'no_helmet': '#ff6b6b',
      'triple_riding': '#ff9f43',
      'no_number_plate': '#ffa502'
    };
    return colors[type] || '#667eea';
  };

  if (loading) {
    return <div className="fines-page"><div className="loading">Loading fines...</div></div>;
  }

  return (
    <div className="fines-page">
      <div className="container">
        <h1 className="page-title">Fines Management</h1>

        {error && <div className="error-box">{error}</div>}

        {/* Summary Cards */}
        {finesSummary && (
          <div className="fines-summary">
            <div className="summary-card">
              <div className="summary-icon">💰</div>
              <div className="summary-content">
                <div className="summary-label">Total Fines</div>
                <div className="summary-value">₹{finesSummary.total_fines_amount}</div>
                <div className="summary-count">({finesSummary.total_fines_count} fines)</div>
              </div>
            </div>

            <div className="summary-card paid">
              <div className="summary-icon">✅</div>
              <div className="summary-content">
                <div className="summary-label">Paid Fines</div>
                <div className="summary-value">₹{finesSummary.paid_fines_amount}</div>
                <div className="summary-count">({finesSummary.paid_fines_count} fines)</div>
              </div>
            </div>

            <div className="summary-card pending">
              <div className="summary-icon">⏳</div>
              <div className="summary-content">
                <div className="summary-label">Pending Fines</div>
                <div className="summary-value">₹{finesSummary.pending_fines_amount}</div>
                <div className="summary-count">({finesSummary.pending_fines_count} fines)</div>
              </div>
            </div>

            <div className="summary-card rate">
              <div className="summary-icon">📊</div>
              <div className="summary-content">
                <div className="summary-label">Collection Rate</div>
                <div className="summary-value">{finesSummary.collection_rate}%</div>
                <div className="summary-count">of total fines collected</div>
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="fines-filter">
          <button
            className={`filter-btn ${statusFilter === '' ? 'active' : ''}`}
            onClick={() => {
              setStatusFilter('');
              setPage(1);
            }}
          >
            All Fines
          </button>
          <button
            className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => {
              setStatusFilter('pending');
              setPage(1);
            }}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${statusFilter === 'paid' ? 'active' : ''}`}
            onClick={() => {
              setStatusFilter('paid');
              setPage(1);
            }}
          >
            Paid
          </button>
        </div>

        {/* Fines List */}
        <div className="fines-list">
          {finesList.length === 0 ? (
            <div className="no-data">No fines found</div>
          ) : (
            finesList.map((fine, idx) => (
              <div key={idx} className={`fine-card ${fine.status}`}>
                <div className="fine-header">
                  <div className="fine-id">Fine ID: {fine.fine_id}</div>
                  <div className={`fine-status ${fine.status}`}>
                    {fine.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                  </div>
                </div>

                <div className="fine-details">
                  <div className="fine-type">
                    <span
                      className="violation-type-badge"
                      style={{ background: getViolationColor(fine.violation_type) }}
                    >
                      {fine.violation_type.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="fine-amount">
                    <div className="label">Fine Amount</div>
                    <div className="value">₹{fine.amount}</div>
                  </div>

                  <div className="fine-date">
                    <div className="label">Issued Date</div>
                    <div className="value">📅 {fine.issued_date}</div>
                  </div>

                  {fine.paid_date && (
                    <div className="fine-paid-date">
                      <div className="label">Paid Date</div>
                      <div className="value">✓ {fine.paid_date}</div>
                    </div>
                  )}

                  {fine.payment_method && (
                    <div className="payment-method">
                      <div className="label">Payment Method</div>
                      <div className="value">{fine.payment_method.toUpperCase()}</div>
                    </div>
                  )}
                </div>

                {fine.status === 'pending' && (
                  <div className="fine-actions">
                    <button
                      className="pay-btn"
                      onClick={() => setPaymentModal(fine)}
                    >
                      Mark as Paid
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="page-btn"
            >
              Previous
            </button>
            <span className="page-info">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="page-btn"
            >
              Next
            </button>
          </div>
        )}

        {/* Payment Modal */}
        {paymentModal && (
          <div className="modal-overlay" onClick={() => setPaymentModal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Record Payment</h2>
                <button
                  className="close-btn"
                  onClick={() => setPaymentModal(null)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="payment-info">
                  <p><strong>Fine ID:</strong> {paymentModal.fine_id}</p>
                  <p>
                    <strong>Violation Type:</strong>{' '}
                    {paymentModal.violation_type.replace(/_/g, ' ').toUpperCase()}
                  </p>
                  <p><strong>Amount:</strong> ₹{paymentModal.amount}</p>
                  <p><strong>Issued Date:</strong> {paymentModal.issued_date}</p>
                </div>

                <div className="payment-form">
                  <label>Payment Method:</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="upi">UPI</option>
                    <option value="net_banking">Net Banking</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="cancel-btn"
                  onClick={() => setPaymentModal(null)}
                >
                  Cancel
                </button>
                <button
                  className="confirm-btn"
                  onClick={() => handleMarkPaid(paymentModal)}
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Fines;
