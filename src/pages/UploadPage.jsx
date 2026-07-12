import { useState, useRef } from 'react';

// Generate avatar inline from file name extension
const getUploadAvatar = (name = '') => {
  const ext = name.split('.').pop().toUpperCase().slice(0, 2) || 'FL';
  const colors = {
    JS: { bg: '#e0e4ff', fg: '#a8b2fc' },
    CS: { bg: '#dbfaf6', fg: '#80e2d6' },
    SP: { bg: '#e0f3ff', fg: '#80b3ff' },
    XM: { bg: '#fff5e6', fg: '#d97d24' },
    PD: { bg: '#fee2e2', fg: '#ef4444' },
  };
  const c = colors[ext] || { bg: '#e0e4ff', fg: '#a8b2fc' };
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="12" fill={c.bg} />
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill={c.fg} fontSize="9" fontWeight="bold">{ext}</text>
    </svg>
  );
};

const RISK_COLOR = {
  Risky: { badge: 'risk-badge risk-critical', bar: '#ef4444' },
  Safe:  { badge: 'risk-badge risk-info',     bar: '#22c55e' },
};

/* ─── Result Table ───────────────────────────────────────────────────────── */
function ResultsTable({ results }) {
  const [sortKey, setSortKey]   = useState('risk_probability');
  const [sortAsc, setSortAsc]   = useState(false);
  const [search, setSearch]     = useState('');

  const toggle = (key) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(false); }
  };

  const filtered = results
    .filter(r => r.library.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  const SortIcon = ({ k }) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: sortKey === k ? 1 : 0.3, marginLeft: 4 }}>
      {sortKey === k && sortAsc
        ? <polyline points="18 15 12 9 6 15" />
        : <polyline points="6 9 12 15 18 9" />}
    </svg>
  );

  return (
    <div className="analysis-results-wrap" style={{ padding: '10px 0 24px' }}>
      <div className="analysis-search-row">
        <div className="analysis-search-box">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="analysis-search-input"
            placeholder="Filter by library name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span className="analysis-count-badge">{filtered.length} of {results.length}</span>
      </div>

      <div className="projects-table-container">
        <table className="projects-table">
          <thead>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => toggle('library')}>
                Library <SortIcon k="library" />
              </th>
              <th>Version</th>
              <th style={{ cursor: 'pointer' }} onClick={() => toggle('cvss_score')}>
                CVSS <SortIcon k="cvss_score" />
              </th>
              <th>CVE / Patch</th>
              <th style={{ cursor: 'pointer' }} onClick={() => toggle('risk_probability')}>
                Risk Score <SortIcon k="risk_probability" />
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => toggle('risk_label')}>
                Prediction <SortIcon k="risk_label" />
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '28px', color: 'var(--text-muted)' }}>No results match your filter.</td></tr>
            ) : filtered.map((r, i) => {
              const meta = RISK_COLOR[r.risk_label] || RISK_COLOR.Safe;
              const pct  = Math.round(r.risk_probability * 100);
              return (
                <tr key={`${r.library}-${i}`}>
                  <td className="manager-cell" style={{ minWidth: 160 }}>
                    <div className="manager-avatar">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect width="24" height="24" rx="12" fill={r.risk_label === 'Risky' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.12)'} />
                        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
                          fill={r.risk_label === 'Risky' ? '#ef4444' : '#22c55e'} fontSize="9" fontWeight="bold">
                          {r.library.slice(0, 2).toUpperCase()}
                        </text>
                      </svg>
                    </div>
                    <div className="manager-name">{r.library}</div>
                  </td>
                  <td className="date-cell" style={{ fontFamily: 'monospace', fontSize: '11px' }}>{r.version}</td>
                  <td className="amount-cell">
                    <span style={{ color: r.cvss_score >= 7 ? '#ef4444' : r.cvss_score >= 4 ? '#f59e0b' : 'var(--text-muted)', fontWeight: 600 }}>
                      {r.cvss_score > 0 ? r.cvss_score.toFixed(1) : '—'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {r.has_cve  ? <span className="status-badge status-pending">CVE</span> : null}
                      {r.patch_available ? <span className="status-badge status-complete">Patch</span> : null}
                      {!r.has_cve ? <span className="status-badge status-approved">Clean</span> : null}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 56, height: 4, borderRadius: 4, background: 'var(--border-color)', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: meta.bar, borderRadius: 4, transition: 'width 0.4s ease' }} />
                      </div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', minWidth: 28 }}>{pct}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={meta.badge}>{r.risk_label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Summary Cards ──────────────────────────────────────────────────────── */
function SummaryCards({ summary }) {
  const cards = [
    { label: 'Total Analysed',   value: summary.total,       color: '#a8b2fc', icon: '⬡' },
    { label: 'Dev/Unused Removed', value: summary.filtered,  color: '#80e2d6', icon: '⊖' },
    { label: 'Risky Predicted',  value: summary.risky,       color: '#ef4444', icon: '⚠' },
    { label: 'Safe Predicted',   value: summary.safe,        color: '#22c55e', icon: '✓' },
  ];
  return (
    <div className="analysis-summary-cards" style={{ padding: '20px 0 10px' }}>
      {cards.map(c => (
        <div key={c.label} className="analysis-summary-card" style={{ '--card-color': c.color }}>
          <span className="asc-icon">{c.icon}</span>
          <span className="asc-value">{c.value}</span>
          <span className="asc-label">{c.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Step Indicator ─────────────────────────────────────────────────────── */
function Steps({ step }) {
  const steps = ['Parsing File', 'Filtering Unused', 'Model Analysis', 'Risk Results'];
  const idx   = { idle: -1, parsing: 0, filtering: 1, predicting: 2, done: 3, error: 3 }[step] ?? -1;
  return (
    <div className="analysis-steps" style={{ margin: '0 -24px 20px -24px' }}>
      {steps.map((s, i) => (
        <div key={s} className={`analysis-step ${i < idx ? 'step-done' : i === idx ? 'step-active' : 'step-pending'}`}>
          <div className="step-circle">
            {i < idx
              ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              : i === idx && step !== 'done'
                ? <div className="reach-spinner reach-spinner-sm" style={{ borderTopColor: '#a8b2fc' }} />
                : <span>{i + 1}</span>}
          </div>
          <span className="step-label">{s}</span>
          {i < steps.length - 1 && <div className="step-line" />}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function UploadPage({ activeProject, workspace, saveWorkspace }) {
  const uploads = workspace?.uploads || [];
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep]             = useState('idle'); // idle | parsing | filtering | predicting | done | error
  const [errorMsg, setErrorMsg]     = useState('');
  const [fileName, setFileName]     = useState('');
  const [summary, setSummary]       = useState(null);
  const [results, setResults]       = useState([]);

  const inputRef = useRef(null);

  const reset = () => {
    setStep('idle');
    setErrorMsg('');
    setFileName('');
    setSummary(null);
    setResults([]);
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith('.json')) {
      setErrorMsg('Please upload a .json file.');
      setStep('error');
      return;
    }

    setFileName(file.name);
    setStep('parsing');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target.result);
        
        // Calculate file size format
        const sizeFormatted = file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(0)} KB`;
        
        let description = 'CycloneDX JSON scan manifest';
        if (json.bomFormat) {
          description = `${json.bomFormat} ${json.specVersion || ''} Scan Manifest`;
        } else if (json.spdxVersion) {
          description = `SPDX ${json.spdxVersion} scan tree`;
        } else if (json.dependencies) {
          description = 'Node npm package lock tree';
        } else {
          description = 'Custom JSON scan manifest';
        }

        let components = [];
        if (Array.isArray(json)) {
          components = json;
        } else if (json.components && Array.isArray(json.components)) {
          components = json.components;
        } else if (json.packages && Array.isArray(json.packages)) {
          components = json.packages.map(p => ({
            name: p.name || p.SPDXID,
            version: p.versionInfo || '',
            license: p.licenseDeclared || 'Unknown',
            purl: p.externalRefs && p.externalRefs[0] ? p.externalRefs[0].referenceLocator : ''
          }));
        } else if (json.packages && typeof json.packages === 'object') {
          components = Object.entries(json.packages)
            .filter(([key]) => key !== '')
            .map(([key, p]) => {
              const name = key.replace(/^node_modules\//, '');
              return {
                name: name,
                version: p.version || '',
                license: p.license || 'Unknown',
                purl: `pkg:npm/${name}@${p.version || ''}`
              };
            });
        } else if (json.dependencies && typeof json.dependencies === 'object') {
          components = Object.entries(json.dependencies).map(([name, depVal]) => {
            const version = typeof depVal === 'string' ? depVal : (depVal.version || '');
            const cleanVer = version.replace(/^[\^~]/, '');
            return {
              name: name,
              version: version,
              license: typeof depVal === 'object' && depVal.license ? depVal.license : 'Unknown',
              purl: `pkg:npm/${name}@${cleanVer}`
            };
          });
        }

        if (!components.length) {
          throw new Error('No dependencies found in the file.');
        }

        // Build list of raw dependencies for API
        const rawDeps = components.map(c => ({
          name: c.name || c.library || 'unknown-package',
          version: c.version || '0.0.0',
          cvss_score: c.cvss_score ?? 0,
          has_cve: c.has_cve ?? 0,
          patch_available: c.patch_available ?? 0,
          business_score: c.business_score ?? 1,
          maintenance_score: c.maintenance_score ?? 0,
          dependency_depth: c.dependency_depth ?? 1,
          is_direct: c.is_direct ?? 1,
          is_transitive: c.is_transitive ?? 0,
          application_usage: c.application_usage ?? 1,
          pagerank: c.pagerank ?? 0,
          betweenness: c.betweenness ?? 0,
          indegree: c.indegree ?? 0,
          outdegree: c.outdegree ?? 0,
          compatible_with_proprietary: c.compatible_with_proprietary ?? true
        }));

        setStep('filtering');
        await new Promise(r => setTimeout(r, 450)); // simulate step transistion

        setStep('predicting');
        
        // POST to model predict endpoint
        const res = await fetch('http://localhost:5000/api/model/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dependencies: rawDeps })
        });
        const data = await res.json();
        
        if (!data.success) throw new Error(data.message || 'Model prediction failed.');

        // Prediction success - Save workspace changes
        let newDepsCount = 0;
        let updatedProjects = [...workspace.projects];

        const finalResults = data.results;
        const finalSummary = data.summary;

        const predictionsMap = new Map(finalResults.map(r => [r.library, r]));
        
        const parsedDeps = rawDeps.map(comp => {
          const pred = predictionsMap.get(comp.name);
          const isProd = !!pred;

          let ecosystem = 'npm';
          let avatarLetter = 'JS';
          let avatarBg = '#f7df1e';
          let avatarColor = '#000000';

          const compLic = components.find(c => c.name === comp.name)?.license || 'Unknown';

          return {
            name: comp.name,
            description: isProd ? 'production library' : 'development library',
            avatarLetter,
            avatarBg,
            avatarColor,
            version: comp.version,
            license: compLic,
            status: isProd && pred.risk_label === 'Risky' ? 'Approved with Risk' : 'Approved',
            statusClass: isProd && pred.risk_label === 'Risky' ? 'pending' : 'approved',
            reachability: isProd ? 'reachable' : 'dev-only',
            reachability_score: isProd ? 95 : 10,
            risk_label: isProd ? pred.risk_label : 'Safe',
            risk_probability: isProd ? pred.risk_probability : 0,
            cvss_score: comp.cvss_score,
            has_cve: comp.has_cve,
            patch_available: comp.patch_available,
            maintenance_score: comp.maintenance_score || 10
          };
        });

        // Create a brand-new project entry from this uploaded SBOM
        const cleanProjName = file.name.slice(0, file.name.lastIndexOf('.')) || file.name;
        const projectVulns = parsedDeps
          .filter(d => d.risk_label === 'Risky' || d.cvss_score > 0 || d.has_cve == 1)
          .map(d => {
            const severity = d.cvss_score >= 9 ? 'Critical' 
              : d.cvss_score >= 7 ? 'High' 
              : d.cvss_score >= 4 ? 'Medium' 
              : d.cvss_score > 0 ? 'Low' 
              : d.risk_label === 'Risky' ? 'High' : 'Low';
            
            const description = d.risk_label === 'Risky'
              ? `CatBoost model flagged this dependency as Risky with probability ${Math.round(d.risk_probability * 100)}%.`
              : `Dependency has a known vulnerability with CVSS score ${d.cvss_score}.`;

            return {
              name: `${d.name} (${d.version})`,
              severity,
              description,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              cve: d.has_cve ? 'CVE-ALERT' : 'ML-ALERT',
              status: 'Pending',
              statusClass: 'pending'
            };
          });

        const criticalCount = parsedDeps.filter(d => d.cvss_score >= 9).length;
        const highCount     = parsedDeps.filter(d => (d.cvss_score >= 7 && d.cvss_score < 9) || (d.risk_label === 'Risky' && d.cvss_score < 7)).length;
        const medCount      = parsedDeps.filter(d => d.cvss_score >= 4 && d.cvss_score < 7 && d.risk_label !== 'Risky').length;
        const lowCount      = parsedDeps.filter(d => d.cvss_score > 0 && d.cvss_score < 4 && d.risk_label !== 'Risky').length;
        
        const maxVal = Math.max(criticalCount, highCount, medCount, lowCount, 1);
        const severityBreakdown = [
          { label: 'Critical', val: String(criticalCount), height: `${(criticalCount/maxVal)*100}%`, class: 'bar-linux' },
          { label: 'High',     val: String(highCount),     height: `${(highCount/maxVal)*100}%`,     class: 'bar-mac' },
          { label: 'Medium',   val: String(medCount),      height: `${(medCount/maxVal)*100}%`,      class: 'bar-ios' },
          { label: 'Low',      val: String(lowCount),      height: `${(lowCount/maxVal)*100}%`,      class: 'bar-windows' }
        ];

        const directCount = parsedDeps.filter(d => d.reachability === 'reachable').length;
        const devCount    = parsedDeps.filter(d => d.reachability === 'dev-only').length;
        const maxDepVal   = Math.max(directCount, devCount, 1);
        const dependencyBreakdown = [
          { label: 'Direct', val: String(directCount), height: `${(directCount/maxDepVal)*100}%`, class: 'bar-mac' },
          { label: 'Transitive', val: '0', height: '0%', class: 'bar-windows' },
          { label: 'DevDeps', val: String(devCount), height: `${(devCount/maxDepVal)*100}%`, class: 'bar-ios' }
        ];

        const licCounts = {};
        parsedDeps.forEach(d => {
          const l = d.license || 'Unknown';
          licCounts[l] = (licCounts[l] || 0) + 1;
        });
        const totalDeps = parsedDeps.length || 1;
        const licenseBreakdown = Object.entries(licCounts).map(([name, count]) => ({
          name,
          percentage: `${Math.round((count / totalDeps) * 100)}%`,
          dotClass: 'dot-us'
        }));

        const newProjectObj = {
          id: `project-${Date.now()}`,
          name: cleanProjName,
          description: description,
          avatarLetter: cleanProjName.slice(0, 2).toUpperCase(),
          avatarBg: '#a8b2fc',
          avatarColor: '#ffffff',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          vulnerabilitiesText: `${criticalCount + highCount} High, ${medCount} Med`,
          status: 'Complete',
          statusClass: 'complete',
          complianceScore: Math.max(100 - (criticalCount * 10 + highCount * 5 + medCount * 2), 30),
          totalDependencies: parsedDeps.length,
          licenseAlerts: parsedDeps.filter(d => d.license === 'Unknown' || d.license.includes('GPL')).length,
          severityBreakdown,
          licenseBreakdown,
          dependencyBreakdown,
          dependencies: parsedDeps,
          vulnerabilities: projectVulns,
          trendData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values: [0, 0, 0, 0, 0, criticalCount + highCount + medCount],
            pathPoints: "M 50,140 C 100,140 200,140 300,140 C 400,140 500,140 550,110",
            fillPoints: "M 50,140 C 100,140 200,140 300,140 C 400,140 500,140 550,110 L 550,160 L 50,160 Z",
            coordinates: [
              { cx: 50, cy: 140, val: 0 },
              { cx: 550, cy: 110, val: criticalCount + highCount + medCount }
            ]
          }
        };

        updatedProjects = [newProjectObj, ...workspace.projects];

        const newUpload = {
          name: file.name,
          description,
          avatar: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="12" fill="#e0e4ff" />
              <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#a8b2fc" fontSize="9" fontWeight="bold">JS</text>
            </svg>
          ),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          size: sizeFormatted,
          status: 'Complete',
          statusClass: 'complete'
        };

        saveWorkspace({
          ...workspace,
          projects: updatedProjects,
          uploads: [newUpload, ...workspace.uploads]
        });

        setSummary(finalSummary);
        setResults(finalResults);
        setStep('done');

      } catch (err) {
        setErrorMsg(err.message || 'Invalid JSON file format.');
        setStep('error');
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = () => { setDragActive(false); };
  
  const handleDrop = (e) => {
    e.preventDefault(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const isRunning = ['parsing', 'filtering', 'predicting'].includes(step);
  const stepLabel = { 
    parsing: 'Parsing SBOM json manifest…', 
    filtering: 'Filtering dev and unused dependencies…', 
    predicting: 'Running CatBoost model inference…' 
  }[step] || '';

  return (
    <div className="dashboard-page">
      <div className="projects-row">
        <article className="dashboard-card">
          <div className="projects-header">
            <h2 className="projects-title">
              SBOM Upload & Risk Analysis
              <span className="pipeline-badge-header">CatBoost Pipeline</span>
            </h2>
            {step !== 'idle' && (
              <button className="simple-filter-toggle" type="button" onClick={reset}>
                Ingest New SBOM
              </button>
            )}
          </div>

          {/* Steps Progress Indicator */}
          {step !== 'idle' && <Steps step={step} />}

          {/* ── IDLE: Dropzone ── */}
          {step === 'idle' && (
            <>
              <input 
                ref={inputRef}
                type="file" 
                accept=".json" 
                style={{ display: 'none' }} 
                id="file-upload-input" 
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <div
                className={`analysis-dropzone${dragActive ? ' drag-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                style={{ margin: '12px 0 28px 0' }}
              >
                <div className="analysis-dropzone-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                </div>
                <h3 className="analysis-drop-title">Drag and drop your SBOM file here</h3>
                <p className="analysis-drop-sub">
                  Supports CycloneDX, SPDX documents, or npm package-locks.
                  <br/>Ingesting will auto-filter dev dependencies and predict production risk.
                </p>
                <button
                  className="analysis-browse-btn"
                  type="button"
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                >
                  Select File
                </button>
                <div className="analysis-pipeline-hint">
                  <span>Ingest JSON</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                  <span>Filter Dev/Unused</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                  <span>CatBoost Risk Score</span>
                </div>
              </div>
            </>
          )}

          {/* ── RUNNING ── */}
          {isRunning && (
            <div className="analysis-running" style={{ margin: '12px 0 28px 0' }}>
              <div className="reach-spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
              <div>
                <div className="analysis-running-title">{stepLabel}</div>
                <div className="analysis-running-file">{fileName}</div>
              </div>
            </div>
          )}

          {/* ── ERROR ── */}
          {step === 'error' && (
            <div className="analysis-error-banner" style={{ margin: '12px 0 28px 0' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>{errorMsg}</span>
              <button className="simple-filter-toggle" type="button" onClick={reset} style={{ marginLeft: 'auto' }}>Try Again</button>
            </div>
          )}

          {/* ── DONE: Results ── */}
          {step === 'done' && summary && (
            <>
              <SummaryCards summary={summary} />
              <div className="analysis-file-bar" style={{ margin: '12px 0 16px 0' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
                </svg>
                <span>Uploaded: <strong>{fileName}</strong> — {summary.filtered} dev dependencies bypassed → {summary.total} evaluated</span>
                <span className="analysis-risk-pct" style={{ marginLeft: 'auto', color: summary.risky_pct > 30 ? '#ef4444' : '#22c55e' }}>
                  {summary.risky_pct}% Risky
                </span>
              </div>
              <ResultsTable results={results} />
            </>
          )}

          {/* ── RECENT UPLOADS TABLE (only visible when idle) ── */}
          {step === 'idle' && (
            <>
              <div className="projects-header" style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <h2 className="projects-title">Recent Ingestions</h2>
              </div>
              <div className="projects-table-container">
                <table className="projects-table">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Uploaded Date</th>
                      <th>File Size</th>
                      <th>Ingestion Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploads.length === 0 ? (
                      <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>No uploads yet. Drop an SBOM file above.</td></tr>
                    ) : uploads.map((file, idx) => (
                      <tr key={`${file.name}-${idx}`}>
                        <td className="manager-cell">
                          <div className="manager-avatar">{getUploadAvatar(file.name)}</div>
                          <div>
                            <div className="manager-name">{file.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{file.description}</div>
                          </div>
                        </td>
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
            </>
          )}

          {/* Page Footer */}
          <footer className="page-footer" style={{ marginTop: '30px' }}>
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