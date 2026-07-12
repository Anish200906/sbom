import { useState } from 'react';
import { updateUserProfile } from '../db';

export default function SettingsPage({ theme, setTheme, currentUser }) {
  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preference state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  const handleSecuritySave = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      alert('Please enter your current password.');
      return;
    }
    if (currentPassword !== currentUser?.password) {
      alert('Incorrect current password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    const res = await updateUserProfile(currentUser.email, { password: newPassword });
    if (res.success) {
      alert('Password updated successfully!');
      currentUser.password = newPassword; // Sync local object ref
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      alert(res.message || 'Failed to update password.');
    }
  };

  const handlePreferencesSave = (e) => {
    e.preventDefault();
    alert('System preferences updated!');
  };

  return (
    <div className="dashboard-page">
      <div className="overview-header">
        <h1 className="overview-title">System Settings</h1>
      </div>

      <div className="projects-row">
        <article className="dashboard-card" style={{ gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '480px' }}>
            {/* Security Form */}
            <form onSubmit={handleSecuritySave} className="auth-form">
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                Update Password
              </h3>
              
              <div className="auth-form-group">
                <label className="auth-label">Current Password</label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label">New Password</label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Confirm New Password</label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="auth-submit-btn" style={{ maxWidth: '160px' }}>
                Update Password
              </button>
            </form>

            {/* Preferences Form */}
            <form onSubmit={handlePreferencesSave} className="auth-form">
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                Preferences
              </h3>

              <div className="auth-form-group">
                <label className="auth-label">Application Theme</label>
                <select
                  className="auth-input"
                  value={theme}
                  onChange={(e) => {
                    setTheme(e.target.value);
                    localStorage.setItem('theme', e.target.value);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                </select>
              </div>

              <div className="auth-form-group" style={{ gap: '10px', marginTop: '4px' }}>
                <label className="auth-label">Email Alerts</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="alert-vulnerabilities"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                  />
                  <label htmlFor="alert-vulnerabilities" style={{ fontSize: '13px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                    Notify me of Critical or High vulnerabilities
                  </label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="alert-reports"
                    checked={weeklyReports}
                    onChange={(e) => setWeeklyReports(e.target.checked)}
                    style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                  />
                  <label htmlFor="alert-reports" style={{ fontSize: '13px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                    Send weekly compliance & scan summaries
                  </label>
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" style={{ maxWidth: '160px' }}>
                Save Preferences
              </button>
            </form>
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
