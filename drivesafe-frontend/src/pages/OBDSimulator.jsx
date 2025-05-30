import React, { useState, useEffect } from 'react';

const JsonMonitor = () => {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [fetchCount, setFetchCount] = useState(0);
  const [jsonUrl, setJsonUrl] = useState('http://192.0.0.2:9999/20250530_070001.json');

  const JSON_URL = jsonUrl;

  const fetchJsonData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try multiple approaches to handle CORS issues
      const response = await fetch(JSON_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Try CORS first
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setJsonData(data);
      setLastUpdated(new Date().toLocaleTimeString());
      setFetchCount(prev => prev + 1);
    } catch (err) {
      // If CORS fails, try with no-cors mode (limited functionality)
      try {
        setError('CORS issue detected, trying alternative method...');
        const response = await fetch(JSON_URL, {
          method: 'GET',
          mode: 'no-cors',
          cache: 'no-cache'
        });

        // no-cors mode doesn't allow reading response, so we can't get the JSON
        setError('CORS blocking detected. Please see solutions below.');
      } catch (secondErr) {
        let errorMsg = err.message;
        if (errorMsg.includes('Failed to fetch')) {
          errorMsg = 'Network error: Cannot connect to the Android device. Check if device is on same network and sharing is active.';
        }
        setError(errorMsg);
        console.error('Error fetching JSON:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchJsonData();

    // Set up interval for periodic fetching every 5 seconds
    const interval = setInterval(fetchJsonData, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const renderJsonContent = (data) => {
    if (typeof data === 'object' && data !== null) {
      return (
          <pre className="bg-light p-3 rounded border" style={{
            maxHeight: '400px',
            overflow: 'auto',
            fontSize: '0.9rem',
            whiteSpace: 'pre-wrap'
          }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      );
    }
    return <p className="text-muted">No valid JSON data</p>;
  };

  return (
      <div className="container-fluid py-4">
        {/* Bootstrap CSS CDN */}
        <link
            href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
            rel="stylesheet"
        />

        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            {/* URL Input Section */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-secondary text-white">
                <h6 className="card-title mb-0">🔗 URL Configuration</h6>
              </div>
              <div className="card-body">
                <div className="row align-items-end">
                  <div className="col-md-8">
                    <label className="form-label small text-muted">JSON URL:</label>
                    <input
                        type="url"
                        className="form-control form-control-sm"
                        value={JSON_URL}
                        onChange={(e) => setJsonUrl(e.target.value)}
                        placeholder="http://192.0.0.2:9999/file.json"
                    />
                  </div>
                  <div className="col-md-4">
                    <button
                        className="btn btn-primary btn-sm w-100"
                        onClick={fetchJsonData}
                        disabled={loading}
                    >
                      Test Connection
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-muted">
                    💡 Try: <button className="btn btn-link btn-sm p-0" onClick={() => setJsonUrl('http://192.0.0.2:9999/20250530_070001.json')}>Reset to original</button>
                  </small>
                </div>
              </div>
            </div>
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-primary text-white">
                <h1 className="card-title mb-0 h4">
                  <i className="me-2">📊</i>
                  JSON File Monitor
                </h1>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <small className="text-muted d-block">Source URL:</small>
                    <code className="text-break">{JSON_URL}</code>
                  </div>
                  <div className="col-md-3">
                    <small className="text-muted d-block">Fetch Count:</small>
                    <span className="badge bg-info">{fetchCount}</span>
                  </div>
                  <div className="col-md-3">
                    <small className="text-muted d-block">Last Updated:</small>
                    <span className="text-success">{lastUpdated || 'Never'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="card text-center h-100">
                  <div className="card-body">
                    <div className={`h2 mb-2 ${loading ? 'text-warning' : 'text-success'}`}>
                      {loading ? '⏳' : '✅'}
                    </div>
                    <h6 className="card-title">Status</h6>
                    <p className="card-text text-muted">
                      {loading ? 'Loading...' : 'Ready'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-center h-100">
                  <div className="card-body">
                    <div className="h2 mb-2 text-info">🔄</div>
                    <h6 className="card-title">Auto Refresh</h6>
                    <p className="card-text text-muted">Every 5 seconds</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-center h-100">
                  <div className="card-body">
                    <div className="h2 mb-2 text-primary">📱</div>
                    <h6 className="card-title">Android Share</h6>
                    <p className="card-text text-muted">HTTP Server</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="alert alert-warning alert-dismissible mb-4" role="alert">
                  <strong>Connection Issue:</strong> {error}
                  <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError(null)}
                      aria-label="Close"
                  ></button>

                  {error.includes('CORS') && (
                      <div className="mt-3">
                        <h6>🔧 Solutions:</h6>
                        <ul className="mb-0 small">
                          <li><strong>Method 1:</strong> Access this page directly at <code>http://192.0.0.2:9999</code> (same origin)</li>
                          <li><strong>Method 2:</strong> Use Chrome with <code>--disable-web-security --user-data-dir=/tmp/chrome_dev</code></li>
                          <li><strong>Method 3:</strong> Install a CORS browser extension (CORS Unblock)</li>
                          <li><strong>Method 4:</strong> Access via mobile browser on same WiFi network</li>
                        </ul>
                      </div>
                  )}

                  {error.includes('Network error') && (
                      <div className="mt-3">
                        <h6>📱 Network Troubleshooting:</h6>
                        <ul className="mb-0 small">
                          <li>Ensure both devices are on the same WiFi network</li>
                          <li>Check if the Android share app is still running</li>
                          <li>Try accessing <a href={JSON_URL} target="_blank" rel="noopener noreferrer">{JSON_URL}</a> directly</li>
                          <li>Verify the IP address hasn't changed</li>
                        </ul>
                      </div>
                  )}
                </div>
            )}

            {/* Manual Refresh Button */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">JSON Content</h5>
              <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={fetchJsonData}
                  disabled={loading}
              >
                {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Refreshing...
                    </>
                ) : (
                    <>
                      🔄 Manual Refresh
                    </>
                )}
              </button>
            </div>

            {/* JSON Content Display */}
            <div className="card shadow-sm">
              <div className="card-body">
                {jsonData ? (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge bg-success">Valid JSON</span>
                        <small className="text-muted">
                          Size: {JSON.stringify(jsonData).length} characters
                        </small>
                      </div>
                      {renderJsonContent(jsonData)}
                    </div>
                ) : loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="text-muted">Fetching JSON data...</p>
                    </div>
                ) : (
                    <div className="text-center py-5">
                      <div className="text-muted mb-3" style={{ fontSize: '3rem' }}>📄</div>
                      <p className="text-muted">No data available</p>
                    </div>
                )}
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-4 text-center">
              <small className="text-muted">
                Auto-refreshing every 5 seconds • Built with React & Bootstrap
              </small>
            </div>
          </div>
        </div>
      </div>
  );
};

export default JsonMonitor;