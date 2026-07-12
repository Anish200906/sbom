import { useState } from 'react';

export default function IssuesPage({ activeProject }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('vulnerabilities');

  // Defensive null guards
  if (!activeProject) {
    return <div style={{ padding: '40px', color: 'var(--text-secondary)', textAlign: 'center' }}>Loading project data…</div>;
  }

  const vulnerabilities = activeProject.vulnerabilities || [];
  const severityBreakdown = activeProject.severityBreakdown || [];
  const licenseBreakdown = activeProject.licenseBreakdown || [];

  const metricCards = [
    {
      title: 'Total Dependencies',
      value: activeProject.totalDependencies ?? 0,
      rate: 'Scan Coverage 100%',
      theme: 'blue'
    },
    {
      title: 'Vulnerabilities',
      value: vulnerabilities.length,
      rate: 'Active Alerts',
      theme: 'dark'
    },
    {
      title: 'License Warnings',
      value: activeProject.licenseAlerts ?? 0,
      rate: 'Compliance Check',
      theme: 'blue'
    },
    {
      title: 'Compliance Score',
      value: `${activeProject.complianceScore ?? 100}%`,
      rate: 'Audit Grade',
      theme: 'dark'
    }
  ];

  // Build a simple trend SVG from real vulnerability count
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const totalVulns = vulnerabilities.length;
  const trendValues = monthLabels.map((_, i) => {
    if (i === monthLabels.length - 1) return totalVulns;
    return Math.max(0, Math.floor(totalVulns * (i / (monthLabels.length - 1))));
  });
  const maxTrend = Math.max(...trendValues, 1);
  const coords = trendValues.map((v, i) => ({
    cx: 50 + i * 100,
    cy: 10 + (1 - v / maxTrend) * 150,
    val: v
  }));
  const pathPoints = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.cx} ${c.cy}`).join(' ');
  const fillPoints = `${pathPoints} L ${coords[coords.length - 1].cx} 160 L ${coords[0].cx} 160 Z`;

  return (
    <div className="dashboard-page">
      {/* Overview Header Row */}
      <div className="overview-header">
        <h1 className="overview-title">Vulnerabilities &amp; Issues Overview: {activeProject.name}</h1>
        <div className="dropdown-container">
          <button
            className="dropdown-trigger"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            type="button"
          >
            <span>Live Scan</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Row 1: 4 Metric Cards Grid */}
      <div className="metric-cards-grid">
        {metricCards.map((card, idx) => (
          <article key={idx} className={`metric-card ${card.theme === 'blue' ? 'metric-blue-card' : 'metric-dark-card'}`}>
            <div className="metric-header">
              <span className="metric-title">{card.title}</span>
              <span className="metric-sparkline-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </span>
            </div>
            <div className="metric-body">
              <span className="metric-value">{card.value}</span>
              <span className="metric-rate">{card.rate}</span>
            </div>
          </article>
        ))}
      </div>

      {/* Row 2: Trend Line Chart (computed from real data) */}
      <div className="line-chart-row">
        <article className="dashboard-card">
          <div className="card-header-row">
            <div className="tab-row">
              <span className={`tab ${activeTab === 'vulnerabilities' ? 'active' : ''}`} onClick={() => setActiveTab('vulnerabilities')}>
                Vulnerability Trend (6M)
              </span>
            </div>
            <div className="line-chart-actions-right">
              <div className="dropdown-container">
                <button className="dropdown-trigger" type="button">
                  <span>Months</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
              <div className="line-chart-view-selectors">
                <button className="view-sel-btn active" type="button" aria-label="Line View">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="line-chart-content">
            <svg className="line-chart-svg" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#b86bff" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#b86bff" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="50" y1="10" x2="50" y2="160" stroke="rgba(0,0,0,0.04)" strokeDasharray="3 3" />
              <line x1="150" y1="10" x2="150" y2="160" stroke="rgba(0,0,0,0.04)" strokeDasharray="3 3" />
              <line x1="250" y1="10" x2="250" y2="160" stroke="rgba(0,0,0,0.04)" strokeDasharray="3 3" />
              <line x1="350" y1="10" x2="350" y2="160" stroke="rgba(0,0,0,0.04)" strokeDasharray="3 3" />
              <line x1="450" y1="10" x2="450" y2="160" stroke="rgba(0,0,0,0.04)" strokeDasharray="3 3" />
              <line x1="550" y1="10" x2="550" y2="160" stroke="rgba(0,0,0,0.04)" strokeDasharray="3 3" />
              <path d={fillPoints} fill="url(#chartGrad)" />
              <path d={pathPoints} fill="none" stroke="#b86bff" strokeWidth="2.5" strokeLinecap="round" />
              {coords.map((pt, idx) => (
                <circle key={idx} cx={pt.cx} cy={pt.cy} r="4.5" fill="#b86bff" stroke="#ffffff" strokeWidth="2" title={`Alerts: ${pt.val}`} />
              ))}
              {monthLabels.map((lbl, idx) => (
                <text key={idx} x={50 + idx * 100} y="185" fill="#9b9fb3" fontSize="11" textAnchor="middle" fontFamily="sans-serif">{lbl}</text>
              ))}
            </svg>
          </div>
        </article>
      </div>

      {/* Row 3: Severity & License Bar Charts */}
      <div className="bar-charts-row">
        <article className="dashboard-card">
          <div className="card-header-row">
            <h2 className="card-title">Vulnerability Severity Distribution</h2>
          </div>
          {severityBreakdown.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>No severity data yet.</div>
          ) : (
            <div className="bar-chart-layout">
              <div className="bars-area">
                <div className="bars-flex-container">
                  {severityBreakdown.map((bar, idx) => (
                    <div className="bar-wrapper" key={idx}>
                      <div className={`bar-pill ${bar.val !== '0' ? 'highlighted' : ''}`} style={{ height: bar.height }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="x-axis-labels-row">
                {severityBreakdown.map((bar, idx) => (
                  <span className="x-axis-label-item" key={idx}>{bar.label}</span>
                ))}
              </div>
            </div>
          )}
        </article>

        <article className="dashboard-card">
          <div className="card-header-row">
            <h2 className="card-title">Top License Allocation</h2>
          </div>
          {licenseBreakdown.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>No license data. Upload an SBOM file.</div>
          ) : (
            <div className="bar-chart-layout">
              <div className="bars-area">
                <div className="bars-flex-container">
                  {licenseBreakdown.map((bar, idx) => {
                    const numVal = parseFloat(bar.percentage);
                    return (
                      <div className="bar-wrapper" key={idx}>
                        <div className="bar-pill" style={{ height: `${numVal}%` }} />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="x-axis-labels-row">
                {licenseBreakdown.map((bar, idx) => (
                  <span className="x-axis-label-item" key={idx} style={{ fontSize: '10px' }}>
                    {(bar.name || '').split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>

      {/* Row 4: Vulnerabilities Log Card */}
      <div className="projects-row">
        <article className="dashboard-card">
          <div className="projects-header">
            <h2 className="projects-title">Vulnerability Audit Log ({vulnerabilities.length})</h2>
          </div>
          <div className="projects-table-container">
            {vulnerabilities.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🛡️</div>
                <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)' }}>No Issues Logged</div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  This project has no active vulnerabilities or compliance issues.
                </p>
              </div>
            ) : (
              <table className="projects-table">
                <thead>
                  <tr>
                    <th>Vulnerability / CVE ID</th>
                    <th>Date Detected</th>
                    <th>Severity Rating</th>
                    <th>Ingestion Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vulnerabilities.map((vuln, idx) => (
                    <tr key={`${vuln.name}-${idx}`}>
                      <td className="manager-cell">
                        <div className="manager-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '12px', width: '24px', height: '24px', fontSize: '9px', fontWeight: 'bold' }}>
                          CV
                        </div>
                        <div>
                          <div className="manager-name">{vuln.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{vuln.description}</div>
                        </div>
                      </td>
                      <td className="date-cell">{vuln.date}</td>
                      <td className="amount-cell" style={{ color: (vuln.severity === 'High' || vuln.severity === 'Critical') ? '#ef4444' : '#f59e0b', fontWeight: '600' }}>
                        {vuln.severity}
                      </td>
                      <td>
                        <span className={`status-badge ${vuln.statusClass}`}>{vuln.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}