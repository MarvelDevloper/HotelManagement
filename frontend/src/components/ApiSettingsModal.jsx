import React, { useState } from "react";
import { IconClose, IconSettings, IconCheckCircle, IconAlertCircle } from "./Icons";

export const ApiSettingsModal = ({ currentEndpoint, onSaveEndpoint, onClose, _isOnline }) => {
  const [url, setUrl] = useState(currentEndpoint);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const presets = [
    { label: "Localhost (Port 5000)", url: "http://localhost:5000/api" },
    { label: "AWS EC2 Cloud IP", url: "http://35.173.182.73:5000/api" }
  ];

  const handleTestConnection = async (targetUrl = url) => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(`${targetUrl}/rooms`, { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        const data = await res.json();
        setTestResult({
          success: true,
          message: `Connected successfully! Found ${Array.isArray(data) ? data.length : 0} rooms in database.`
        });
      } else {
        setTestResult({
          success: false,
          message: `Backend responded with HTTP status ${res.status}.`
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: `Connection failed (${err.message}). If backend is offline, frontend will display fallback demo data.`
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveEndpoint(url.trim());
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card api-settings-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <IconClose size={20} />
        </button>

        <div className="modal-header">
          <div className="settings-badge">
            <IconSettings size={16} /> Backend Architecture
          </div>
          <h2>Cloud API Configuration</h2>
          <p className="modal-subtitle">Configure backend REST API endpoint connection</p>
        </div>

        <form onSubmit={handleSave} className="api-settings-form">
          <div className="form-group">
            <label>API Base URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://localhost:5000/api"
              required
            />
          </div>

          <div className="preset-selector">
            <span className="preset-label">Quick Switch Presets:</span>
            <div className="preset-buttons">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`preset-btn ${url === p.url ? "active" : ""}`}
                  onClick={() => {
                    setUrl(p.url);
                    handleTestConnection(p.url);
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Test connection status box */}
          {testResult && (
            <div className={`test-result-box ${testResult.success ? "success" : "error"}`}>
              {testResult.success ? <IconCheckCircle size={18} /> : <IconAlertCircle size={18} />}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleTestConnection(url)}
              disabled={testing}
            >
              {testing ? "Testing..." : "Test Connection"}
            </button>
            <button type="submit" className="btn-primary">
              Save & Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
