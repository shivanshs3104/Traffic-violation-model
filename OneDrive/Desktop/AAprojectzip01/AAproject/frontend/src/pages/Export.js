import React, { useState } from 'react';
import './Export.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Export() {
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');

  const handleExport = async (format) => {
    setExporting(true);
    setMessage('');

    try {
      const token = localStorage.getItem('access_token');
      const endpoint = format === 'csv' 
        ? 'http://localhost:5000/api/export/csv'
        : 'http://localhost:5000/api/export/json';

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        if (format === 'json') {
          // For JSON, download directly
          const jsonData = JSON.stringify(data.data, null, 2);
          downloadFile(jsonData, `violations_${new Date().getTime()}.json`, 'application/json');
          setMessage('✅ JSON file downloaded successfully!');
        } else {
          setMessage('✅ CSV export prepared! Check your downloads folder.');
        }
      } else {
        setMessage('❌ Export failed. Please try again.');
      }
    } catch (err) {
      setMessage('❌ Connection error. Make sure backend is running.');
      console.error('Error:', err);
    } finally {
      setExporting(false);
    }
  };

  const downloadFile = (content, filename, type) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="export-page">
      <div className="container">
        <h1 className="page-title">Export Data</h1>

        <div className="export-container">
          <div className="export-card">
            <h2>📥 Download Violations Data</h2>
            <p>Export all violation records in your preferred format</p>

            <div className="export-options">
              <div className="option">
                <div className="option-icon">📊</div>
                <h3>CSV Format</h3>
                <p>Perfect for Excel and data analysis tools</p>
                <button
                  className="export-btn csv-btn"
                  onClick={() => handleExport('csv')}
                  disabled={exporting}
                >
                  {exporting && exportFormat === 'csv' ? '⏳ Exporting...' : '📥 Export as CSV'}
                </button>
              </div>

              <div className="option">
                <div className="option-icon">🔗</div>
                <h3>JSON Format</h3>
                <p>Complete data structure for integration</p>
                <button
                  className="export-btn json-btn"
                  onClick={() => handleExport('json')}
                  disabled={exporting}
                >
                  {exporting && exportFormat === 'json' ? '⏳ Exporting...' : '📥 Export as JSON'}
                </button>
              </div>
            </div>

            {message && (
              <div className={`export-message ${message.includes('✅') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </div>

          <div className="info-cards">
            <div className="info-card">
              <h3>📋 CSV Benefits</h3>
              <ul>
                <li>Open in Excel or Google Sheets</li>
                <li>Easy to filter and sort</li>
                <li>Compatible with most tools</li>
                <li>Lightweight file size</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>🔗 JSON Benefits</h3>
              <ul>
                <li>Complete data structure</li>
                <li>Easy API integration</li>
                <li>Hierarchical data preservation</li>
                <li>Standard format</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>📊 Data Includes</h3>
              <ul>
                <li>Violation timestamps</li>
                <li>Violation types & counts</li>
                <li>Vehicle & person count</li>
                <li>Image references</li>
                <li>Detailed violation info</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Export;
