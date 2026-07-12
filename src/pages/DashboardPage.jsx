import { useState } from 'react';

export default function DashboardPage({ activeProject }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Defensive null guards — project may be loading or come from stale localStorage
  if (!activeProject) {
    return <div style={{ padding: '40px', color: 'var(--text-secondary)', textAlign: 'center' }}>Loading project data…</div>;
  }

  const severityBreakdown = activeProject.severityBreakdown || [];
  const licenseBreakdown = activeProject.licenseBreakdown || [];
  const dependencyBreakdown = activeProject.dependencyBreakdown || [];
  const vulnerabilities = activeProject.vulnerabilities || [];

  return (
    <div className="dashboard-page">
      {/* Overview Header Row */}
      <div className="overview-header">
        <h1 className="overview-title">Dashboard Overview</h1>
      </div>

      {/* Row 1: Two Column Grid */}
      <div className="dashboard-row-1">
        {/* Vulnerability Severity Breakdown Card */}
        <article className="dashboard-card">
          <h2 className="card-title">Vulnerability Severity</h2>
          <div className="device-traffic-container">
            <div className="chart-layout">
              {/* Y Axis Labels */}
              <div className="y-axis-labels">
                <span>15</span>
                <span>10</span>
                <span>5</span>
                <span>0</span>
              </div>
              {/* Bars and Gridlines */}
              <div className="chart-bars-area">
                <div className="grid-lines">
                  <div className="grid-line" />
                  <div className="grid-line" />
                  <div className="grid-line" />
                  <div className="grid-line" />
                </div>
                <div className="bars-container">
                  {severityBreakdown.map((item) => (
                    <div className="bar-wrapper-layout1" key={item.label} title={`${item.label}: ${item.val}`}>
                      <div
                        className={`bar-pill-layout1 ${item.class}`}
                        style={{ height: item.height }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* X Axis Labels */}
            <div className="x-axis-row">
              <div className="x-axis-labels">
                {severityBreakdown.map((item) => (
                  <span className="x-label-item" key={item.label}>
                    {item.label} ({item.val})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* License Compliance Share Card */}
        <article className="dashboard-card">
          <h2 className="card-title">License Compliance</h2>
          <div className="location-chart-layout">
            {/* SVG Donut Chart */}
            <svg className="donut-chart-svg" viewBox="0 0 130 130">
              {(() => {
                let accumulatedPercent = 0;
                const classes = ['donut-us', 'donut-ca', 'donut-mx', 'donut-ot'];
                return licenseBreakdown.map((item, idx) => {
                  const percentStr = item.percentage.replace('%', '');
                  const percent = parseFloat(percentStr) || 0;
                  const dashSize = (percent / 100) * 251.2;
                  const offset = -(accumulatedPercent / 100) * 251.2;
                  accumulatedPercent += percent;
                  
                  const dotClass = classes[idx % classes.length];
                  
                  return (
                    <circle
                      key={item.name}
                      className={`donut-segment ${dotClass}`}
                      cx="65"
                      cy="65"
                      r="40"
                      strokeDasharray={`${dashSize.toFixed(2)} 251.2`}
                      strokeDashoffset={offset.toFixed(2)}
                    />
                  );
                });
              })()}
            </svg>

            {/* Legend */}
            <div className="location-legend">
              {licenseBreakdown.map((item) => (
                <div className="legend-row" key={item.name}>
                  <div className="legend-left">
                    <span className={`legend-dot ${item.dotClass}`} />
                    <span className="legend-name">{item.name}</span>
                  </div>
                  <span className="legend-value">{item.percentage}</span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>

      {/* Row 2: Dependency Allocation Breakdown Card */}
      <div className="dashboard-row-2">
        <article className="dashboard-card">
          <h2 className="card-title">Dependency Type Allocation</h2>
          <div className="device-traffic-container">
            <div className="marketing-chart-layout">
              {/* Y Axis Labels */}
              <div className="y-axis-labels">
                <span>500</span>
                <span>250</span>
                <span>100</span>
                <span>0</span>
              </div>
              {/* Bars and Gridlines */}
              <div className="chart-bars-area">
                <div className="grid-lines">
                  <div className="grid-line" />
                  <div className="grid-line" />
                  <div className="grid-line" />
                  <div className="grid-line" />
                </div>
                <div className="marketing-bars-container">
                  {dependencyBreakdown.map((item, index) => (
                    <div className="marketing-bar-wrapper" key={`${item.label}-${index}`} title={`${item.label}: ${item.val}`}>
                      <div
                        className={`marketing-bar-pill ${item.class}`}
                        style={{ height: item.height }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* X Axis Labels */}
            <div className="x-axis-row">
              <div className="marketing-x-axis-labels">
                {dependencyBreakdown.map((item, index) => (
                  <span className="marketing-x-label-item" key={`${item.label}-${index}`}>
                    {item.label} ({item.val})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* Row 3: Vulnerabilities Table Card */}
      <div className="projects-row">
        <article className="dashboard-card">
          <div className="projects-header">
            <h2 className="projects-title">Active Vulnerabilities & Alerts ({vulnerabilities.length})</h2>
            <button className="card-options-btn" type="button" aria-label="More Options">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </button>
          </div>

          <div className="projects-table-container">
            {vulnerabilities.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎉</div>
                <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)' }}>No Vulnerabilities Found</div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  This project compliance check is fully green and secure.
                </p>
              </div>
            ) : (
              <table className="projects-table">
                <thead>
                  <tr>
                    <th>CVE ID & Package</th>
                    <th>Date Identified</th>
                    <th>Severity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vulnerabilities.map((vuln, idx) => (
                    <tr key={`${vuln.name}-${idx}`}>
                      <td className="manager-cell">
                        <div className="manager-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff5e6', color: '#d97d24', borderRadius: '12px', width: '24px', height: '24px', fontSize: '9px', fontWeight: 'bold' }}>
                          VU
                        </div>
                        <div>
                          <div className="manager-name">{vuln.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{vuln.description}</div>
                        </div>
                      </td>
                      <td className="date-cell">{vuln.date}</td>
                      <td className="amount-cell" style={{ color: vuln.severity === 'High' ? '#ef4444' : '#f59e0b', fontWeight: '600' }}>
                        {vuln.severity}
                      </td>
                      <td>
                        <span className={`status-badge ${vuln.statusClass}`}>
                          {vuln.status}
                        </span>
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