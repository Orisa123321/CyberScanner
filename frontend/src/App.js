import React, { useState } from 'react';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!code.trim()) {
      setError('Please paste some code first!');
      return;
    }

    setIsLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError('Failed to connect to the scanner. Is the Python server running?');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return '#ff4d4d';
      case 'medium': return '#ffa64d';
      case 'low': return '#4da6ff';
      default: return '#cccccc';
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>🛡️ AI Cyber Security Scanner</h1>
        <p>Paste your code below to detect vulnerabilities</p>
      </header>

      <main className="main-content">
        <div className="input-section">
          <div className="controls">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="lang-select"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="c">C / C++</option>
              <option value="java">Java</option>
            </select>
            <button onClick={handleScan} disabled={isLoading} className="scan-btn">
              {isLoading ? 'Scanning...' : 'Scan Code'}
            </button>
          </div>
          
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your source code here..."
            className="code-editor"
          />
        </div>

        <div className="results-section">
          {error && <div className="error-message">{error}</div>}
          
          {isLoading && <div className="loading">Analyzing code with AI...</div>}

          {results && results.length === 0 && (
            <div className="success-message">✅ No apparent vulnerabilities found!</div>
          )}

          {results && results.length > 0 && (
            <div className="vulnerabilities-list">
              <h2>Identified Vulnerabilities ({results.length})</h2>
              {results.map((vuln, index) => (
                <div 
                  key={index} 
                  className="vuln-card" 
                  style={{ borderLeft: `5px solid ${getSeverityColor(vuln.severity)}` }}
                >
                  <div className="vuln-header">
                    <h3>{vuln.vulnerability}</h3>
                    <span className="severity-badge" style={{ backgroundColor: getSeverityColor(vuln.severity) }}>
                      {vuln.severity}
                    </span>
                  </div>
                  <div className="vuln-body">
                    <p><strong>Description:</strong> {vuln.description}</p>
                    <div className="code-snippet">
                      <code>{vuln.line_snippet}</code>
                    </div>
                    <p><strong>Remediation:</strong> {vuln.remediation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;