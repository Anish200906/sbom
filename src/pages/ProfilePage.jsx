import { useState } from 'react';
import { updateUserProfile } from '../db';

export default function ProfilePage({ currentUser, setCurrentUser }) {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [role, setRole] = useState(currentUser?.role || '');
  const [org, setOrg] = useState(currentUser?.org || '');

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const res = await updateUserProfile(currentUser.email, { name, email, role, org });
    if (res.success) {
      alert('Profile changes saved successfully!');
      setCurrentUser(res.user);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
    } else {
      alert(res.message || 'Failed to save changes.');
    }
  };

  return (
    <div className="dashboard-page">
      <div className="overview-header">
        <h1 className="overview-title">My Profile</h1>
      </div>

      <div className="projects-row">
        <article className="dashboard-card" style={{ gap: '24px' }}>
          <form onSubmit={handleProfileSave} className="auth-form" style={{ maxWidth: '480px' }}>
            {/* Profile Avatar Editor Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
              <svg width="64" height="64" viewBox="0 0 100 100" style={{ borderRadius: '50%', backgroundColor: 'var(--border-color)', flexShrink: 0 }}>
                <defs>
                  <linearGradient id="profileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a8b2fc" />
                    <stop offset="100%" stopColor="#80b3ff" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="50" fill="url(#profileGrad)" />
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#ffffff" fontSize="36" fontWeight="bold" fontFamily="system-ui">BW</text>
              </svg>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Profile Picture</h3>
                <button 
                  type="button" 
                  style={{
                    marginTop: '6px',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={() => alert('Feature disabled in mockup')}
                >
                  Change Photo
                </button>
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Full Name</label>
              <input
                type="text"
                className="auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Email Address</label>
              <input
                type="email"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Job Title / Role</label>
              <input
                type="text"
                className="auth-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Organization</label>
              <input
                type="text"
                className="auth-input"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn" style={{ maxWidth: '140px' }}>
              Save Changes
            </button>
          </form>

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
