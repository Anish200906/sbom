import { useEffect, useState } from 'react';

export default function ExportPage({ activeProject, projectsData = [], setActiveProjectId, workspace, saveWorkspace }) {
  const [projectName, setProjectName] = useState(activeProject ? activeProject.name : 'Identity Provider');

  useEffect(() => {
    if (activeProject) {
      setProjectName(activeProject.name);
    }
  }, [activeProject]);

  const formattedProjectName = projectName
    ? projectName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
    : 'project';

  const deliverables = workspace?.exports || [];

  const getAvatar = (format) => {
    const isPdf = format && format.includes('PDF');
    const letter = isPdf ? 'PD' : 'SX';
    const bg = isPdf ? '#fff5e6' : '#dbfaf6';
    const color = isPdf ? '#d97d24' : '#80e2d6';
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="12" fill={bg} />
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill={color} fontSize="9" fontWeight="bold">{letter}</text>
      </svg>
    );
  };

  const handleExport = (format) => {
    const isRiskReport = format === 'CatBoost Risk Report (PDF)';
    const isPdf = format === 'PDF Summary' || isRiskReport;
    const ext = isPdf ? 'pdf' : 'spdx';
    
    let filenameSuffix = 'sbom-export';
    if (format === 'PDF Summary') filenameSuffix = 'compliance-audit-report';
    else if (isRiskReport) filenameSuffix = 'catboost-risk-report';

    const name = `${formattedProjectName}-${filenameSuffix}.${ext}`;
    
    const newExport = {
      name,
      description: isRiskReport 
        ? `CatBoost ML Risk Prediction report for ${projectName || 'project'}`
        : `${format} review report for ${projectName || 'project'}`,
      format,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      size: isRiskReport ? '1.8 MB' : '2.5 MB',
      status: 'Complete',
      statusClass: 'complete'
    };

    const updatedExports = [newExport, ...deliverables];
    saveWorkspace({
      ...workspace,
      exports: updatedExports
    });

    if (isRiskReport) {
      const projectDeps = activeProject?.dependencies || [];
      const productionDeps = projectDeps.filter(d => d.reachability !== 'dev-only');
      const riskyDeps = productionDeps.filter(d => d.risk_label === 'Risky');
      const devCount = projectDeps.length - productionDeps.length;

      const recommendations = [];
      productionDeps.forEach(d => {
        const isRisky = d.risk_label === 'Risky';
        const hasCve = d.has_cve === 1 || d.cvss_score > 0;
        const isCopyleft = d.license && (d.license.includes('GPL') || d.license.includes('AGPL') || d.license.includes('LGPL') || d.license === 'Unknown');
        const isStale = d.maintenance_score !== undefined && d.maintenance_score >= 30;

        if (hasCve || isRisky) {
          recommendations.push({
            type: 'Security',
            title: `Vulnerability / High Risk in ${d.name} (${d.version})`,
            desc: `This package is flagged as ${isRisky ? 'High Risk by the CatBoost classifier' : 'vulnerable (CVSS: ' + d.cvss_score + ')'}.`,
            action: `Upgrade ${d.name} to the latest patched version immediately. ${d.patch_available ? 'A patch is available.' : 'No patch available; review code exposure or consider a firewall workaround.'}`
          });
        }
        if (isCopyleft) {
          recommendations.push({
            type: 'Compliance',
            title: `License Policy Warning for ${d.name} (${d.version})`,
            desc: `Uses ${d.license || 'Unknown'} license which may pose copyleft compliance risks.`,
            action: `Review legal terms for ${d.name}. Seek to replace it with a permissively licensed alternative (e.g. MIT or Apache-2.0).`
          });
        }
        if (isStale) {
          recommendations.push({
            type: 'Maintenance',
            title: `Stale Maintenance for ${d.name} (${d.version})`,
            desc: `Dependency has poor code maintenance signals (Maintenance Score: ${d.maintenance_score}).`,
            action: `Monitor ${d.name} for deprecation. Evaluate migration to a actively-maintained alternative to avoid long-term security debt.`
          });
        }
      });

      // Call backend API to download PDF
      fetch('http://localhost:5000/api/model/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_name: projectName,
          summary: {
            total: projectDeps.length,
            filtered: devCount,
            risky: riskyDeps.length
          },
          results: productionDeps.map(d => ({
            library: d.name,
            version: d.version,
            license: d.license,
            maintenance_score: d.maintenance_score !== undefined ? d.maintenance_score : 10,
            cvss_score: d.cvss_score || 0,
            risk_label: d.risk_label || 'Safe',
            risk_probability: d.risk_probability || 0
          })),
          recommendations: recommendations
        })
      })
      .then(res => {
        if (!res.ok) throw new Error('PDF download request failed.');
        return res.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formattedProjectName}-catboost-risk-report.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to download PDF. Please check backend server.');
      });
    } else {
      alert(`Successfully generated and saved export: ${name}`);
    }
  };
  return (
    <div className="dashboard-page">
      {/* Project Selection / Name Input */}
      <div style={{ marginBottom: '24px' }}>
        <div className="dashboard-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="projectNameSelect" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
              Project Name
            </label>
            <select
              id="projectNameSelect"
              value={activeProject?.id}
              onChange={(e) => setActiveProjectId && setActiveProjectId(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                width: '100%',
                maxWidth: '400px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {projectsData.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Export Options Panel */}
      <div className="export-formats-panel" style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button className="format-btn" type="button" onClick={() => handleExport('CatBoost Risk Report (PDF)')} style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1.5px dashed var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-secondary)', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}>
          <span className="format-icon" style={{ marginBottom: '8px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.08)', padding: '14px', borderRadius: '50%' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </span>
          <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>Export Risk Report (PDF)</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '380px' }}>
            Generate and save the print-friendly PDF report detailing package risk probabilities and CatBoost model classifications for production dependencies.
          </span>
        </button>
      </div>

      {/* Recent Deliverables Table Card */}
      <div className="projects-row">
        <article className="dashboard-card">
          <div className="projects-header">
            <h2 className="projects-title">Generated Deliverables</h2>
            <button className="card-options-btn" type="button" aria-label="More Options">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </button>
          </div>

          <div className="projects-table-container">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Deliverable Name</th>
                  <th>Format</th>
                  <th>Date Generated</th>
                  <th>File Size</th>
                  <th>Compliance Status</th>
                </tr>
              </thead>
              <tbody>
                {deliverables.map((file, idx) => (
                  <tr key={`${file.name}-${idx}`}>
                    <td className="manager-cell">
                      <div className="manager-avatar">{getAvatar(file.format)}</div>
                      <div>
                        <div className="manager-name">{file.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{file.description}</div>
                      </div>
                    </td>
                    <td className="date-cell">{file.format}</td>
                    <td className="date-cell">{file.date}</td>
                    <td className="amount-cell">{file.size}</td>
                    <td>
                      <span className={`status-badge ${file.statusClass}`}>
                        {file.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Page Footer */}
          <footer className="page-footer">
            <span className="page-footer-left">© 2026 Cyclops</span>
            <div className="page-footer-right">
              <span className="page-footer-link">About</span>
              <span className="page-footer-link">Support</span>
              <span className="page-footer-link">Contact Us</span>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}