import { useState, useRef } from 'react';

/* ─── Step states ────────────────────────────────────────────────────────── */
// idle → uploading → filtering → predicting → done | error

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
    <div className="analysis-results-wrap">
      {/* Search */}
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
    { label: 'Risky',            value: summary.risky,        color: '#ef4444', icon: '⚠' },
    { label: 'Safe',             value: summary.safe,         color: '#22c55e', icon: '✓' },
  ];
  return (
    <div className="analysis-summary-cards">
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
  const steps = ['Upload', 'Filter Unused', 'Run Model', 'Results'];
  const idx   = { idle: -1, uploading: 0, filtering: 1, predicting: 2, done: 3, error: 3 }[step] ?? -1;
  return (
    <div className="analysis-steps">
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

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function AnalysisPage() {
  const [step, setStep]         = useState('idle');  // idle | uploading | filtering | predicting | done | error
  const [errorMsg, setErrorMsg] = useState('');
  const [fileName, setFileName] = useState('');
  const [summary, setSummary]   = useState(null);
  const [results, setResults]   = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const reset = () => { setStep('idle'); setErrorMsg(''); setFileName(''); setSummary(null); setResults([]); };

  const runPipeline = async (file) => {
    setFileName(file.name);
    setStep('uploading');

    // 1. Parse JSON
    let rawDeps;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      // Accept array or CycloneDX / package-lock shapes
      if (Array.isArray(parsed)) {
        rawDeps = parsed;
      } else if (parsed.components) {
        rawDeps = parsed.components.map(c => ({ name: c.name, version: c.version, description: c.description || '' }));
      } else if (parsed.dependencies) {
        rawDeps = Object.entries(parsed.dependencies).map(([name, v]) => ({
          name, version: typeof v === 'string' ? v.replace(/^[^0-9]*/, '') : (v.version || '?')
        }));
      } else {
        throw new Error('Unrecognised JSON shape. Expected an array of deps, CycloneDX, or package-lock.');
      }
    } catch (e) {
      setErrorMsg(`Parse error: ${e.message}`);
      setStep('error');
      return;
    }

    if (!rawDeps.length) {
      setErrorMsg('No dependencies found in the uploaded file.');
      setStep('error');
      return;
    }

    // 2. Call predict endpoint (filter + model in one shot)
    setStep('filtering');
    await new Promise(r => setTimeout(r, 400)); // show filtering step briefly

    setStep('predicting');
    try {
      const res = await fetch('http://localhost:5000/api/model/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dependencies: rawDeps })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Prediction failed');
      setSummary(data.summary);
      setResults(data.results);
      setStep('done');
    } catch (e) {
      setErrorMsg(`Model error: ${e.message}`);
      setStep('error');
    }
  };

  const handleFile = (file) => {
    if (!file || !file.name.endsWith('.json')) {
      setErrorMsg('Please upload a .json file.');
      setStep('error');
      return;
    }
    runPipeline(file);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const isRunning = ['uploading', 'filtering', 'predicting'].includes(step);
  const stepLabel = { uploading: 'Parsing file…', filtering: 'Removing unused dependencies…', predicting: 'Running CatBoost model…' }[step] || '';

  return (
    <div className="dashboard-page">
      <div className="projects-row">
        <article className="dashboard-card">
          <div className="projects-header">
            <h2 className="projects-title">
              Risk Analysis
              <span className="pipeline-badge-header">CatBoost Model</span>
            </h2>
            {step !== 'idle' && (
              <button className="simple-filter-toggle" type="button" onClick={reset}>
                New Analysis
              </button>
            )}
          </div>

          {/* Step indicator */}
          {step !== 'idle' && <Steps step={step} />}

          {/* ── IDLE: Dropzone ── */}
          {step === 'idle' && (
            <div
              className={`analysis-dropzone${dragActive ? ' drag-active' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <input ref={inputRef} type="file" accept=".json" style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              <div className="analysis-dropzone-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="analysis-drop-title">Drop your SBOM JSON here</h3>
              <p className="analysis-drop-sub">
                Upload any SBOM JSON — dev/unused dependencies are automatically removed,<br/>
                then the CatBoost model predicts risk for every remaining library.
              </p>
              <button className="analysis-browse-btn" type="button" onClick={() => inputRef.current?.click()}>
                Browse File
              </button>
              <div className="analysis-pipeline-hint">
                <span>JSON upload</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                <span>Remove dev deps</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                <span>CatBoost predict</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                <span>Risk report</span>
              </div>
            </div>
          )}

          {/* ── RUNNING ── */}
          {isRunning && (
            <div className="analysis-running">
              <div className="reach-spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
              <div>
                <div className="analysis-running-title">{stepLabel}</div>
                <div className="analysis-running-file">{fileName}</div>
              </div>
            </div>
          )}

          {/* ── ERROR ── */}
          {step === 'error' && (
            <div className="analysis-error-banner">
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
              <div className="analysis-file-bar">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
                </svg>
                <span><strong>{fileName}</strong> — {summary.filtered} dev/unused removed → {summary.total} production deps analysed</span>
                <span className="analysis-risk-pct" style={{ marginLeft: 'auto', color: summary.risky_pct > 30 ? '#ef4444' : '#22c55e' }}>
                  {summary.risky_pct}% risky
                </span>
              </div>
              <ResultsTable results={results} />
            </>
          )}

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
