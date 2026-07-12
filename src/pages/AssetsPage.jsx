import { useState, useEffect, useCallback } from 'react';

const renderAvatar = (dep) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="12" fill={dep.avatarBg || '#e0e4ff'} />
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
      fill={dep.avatarColor || '#a8b2fc'} fontSize="10" fontWeight="bold">
      {dep.avatarLetter || '??'}
    </text>
  </svg>
);

export default function AssetsPage({ activeProject, projectsData = [], setActiveProjectId }) {
  const [showAll, setShowAll] = useState(false);
  const [filteredDeps, setFilteredDeps] = useState(null);
  const [hiddenCount, setHiddenCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const rawDeps = activeProject?.dependencies || [];

  const runFilter = useCallback(async (deps) => {
    if (!deps || deps.length === 0) {
      setFilteredDeps([]);
      setHiddenCount(0);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/reachability/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dependencies: deps, devDependencyNames: [] })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.success) {
        const production = data.dependencies.filter(d => d.reachability === 'reachable');
        const removed    = data.dependencies.filter(d => d.reachability !== 'reachable');
        setFilteredDeps(data.dependencies);
        setHiddenCount(removed.length);
      }
    } catch {
      // Fallback — show everything as-is
      setFilteredDeps(deps);
      setHiddenCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setFilteredDeps(null);
    setHiddenCount(0);
    runFilter(rawDeps);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject?.id]);

  if (!activeProject) {
    return <div style={{ padding: '40px', color: 'var(--text-secondary)', textAlign: 'center' }}>Loading project data…</div>;
  }

  const allDeps  = filteredDeps ?? rawDeps;
  const prodDeps = allDeps.filter(d => !d.reachability || d.reachability === 'reachable');
  const display  = showAll ? allDeps : prodDeps;

  return (
    <div className="dashboard-page">
      <div className="projects-row">
        <article className="dashboard-card">
          <div className="projects-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 className="projects-title">Software Dependencies</h2>
              <select
                value={activeProject?.id}
                onChange={(e) => setActiveProjectId && setActiveProjectId(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '600',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {projectsData.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <button className="card-options-btn" type="button" aria-label="More Options">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
              </svg>
            </button>
          </div>

          {/* Simple filter note */}
          {!isLoading && hiddenCount > 0 && (
            <div className="simple-filter-bar">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>
                Showing <strong>{prodDeps.length}</strong> production dependencies
                &nbsp;—&nbsp;
                <strong>{hiddenCount}</strong> dev/unused {hiddenCount === 1 ? 'dependency' : 'dependencies'} hidden
              </span>
              <button
                className="simple-filter-toggle"
                onClick={() => setShowAll(v => !v)}
                type="button"
              >
                {showAll ? 'Hide unused' : 'Show all'}
              </button>
            </div>
          )}

          {isLoading && (
            <div className="simple-filter-loading">
              <div className="reach-spinner reach-spinner-sm" />
              <span>Filtering unused dependencies…</span>
            </div>
          )}

          <div className="projects-table-container">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Package Name</th>
                  <th>Version</th>
                  <th>License</th>
                  <th>Compliance Status</th>
                </tr>
              </thead>
              <tbody>
                {display.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      {rawDeps.length === 0
                        ? 'No dependencies yet. Upload an SBOM file.'
                        : 'No production dependencies found.'}
                    </td>
                  </tr>
                ) : display.map((dep, idx) => (
                  <tr
                    key={`${dep.name}-${idx}`}
                    className={dep.reachability && dep.reachability !== 'reachable' ? 'reach-row-dimmed' : ''}
                  >
                    <td className="manager-cell">
                      <div className="manager-avatar">{renderAvatar(dep)}</div>
                      <div>
                        <div className="manager-name">{dep.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{dep.description}</div>
                      </div>
                    </td>
                    <td className="date-cell">{dep.version}</td>
                    <td className="amount-cell">{dep.license}</td>
                    <td>
                      <span className={`status-badge ${dep.statusClass}`}>{dep.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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