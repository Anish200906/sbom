import { useState } from 'react';

const renderAvatar = (project) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="12" fill={project.avatarBg} />
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill={project.avatarColor} fontSize="10" fontWeight="bold">{project.avatarLetter}</text>
  </svg>
);

export default function ProjectPage({ activeProject, setActiveProjectId, projectsData }) {
  return (
    <div className="dashboard-page">
      <div className="projects-row">
        <article className="dashboard-card">
          <div className="projects-header">
            <h2 className="projects-title">SBOM Projects</h2>
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
                  <th>Project Name</th>
                  <th>Last Scanned</th>
                  <th>Vulnerabilities</th>
                  <th>Compliance Status</th>
                </tr>
              </thead>
              <tbody>
                {projectsData.map((project, idx) => {
                  const isActive = project.id === activeProject.id;
                  return (
                    <tr
                      key={`${project.name}-${idx}`}
                      onClick={() => setActiveProjectId(project.id)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <td className="manager-cell">
                        <div className="manager-avatar">{renderAvatar(project)}</div>
                        <div>
                          <div className="manager-name" style={{ fontWeight: isActive ? '600' : 'normal' }}>
                            {project.name} {isActive && <span style={{ fontSize: '10px', color: '#b86bff', marginLeft: '6px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(184, 107, 255, 0.08)' }}>Active</span>}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{project.description}</div>
                        </div>
                      </td>
                      <td className="date-cell">{project.date}</td>
                      <td className="amount-cell">{project.vulnerabilitiesText}</td>
                      <td>
                        <span className={`status-badge ${project.statusClass}`}>
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
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