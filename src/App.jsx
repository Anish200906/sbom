import { useEffect, useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import IssuesPage from './pages/IssuesPage';
import ExportPage from './pages/ExportPage';
import ProjectPage from './pages/ProjectPage';
import AssetsPage from './pages/AssetsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import { projectsData } from './data';
import { signupUser, loginUser, saveWorkspace } from './db';

const pages = {
  dashboard: DashboardPage,
  upload: UploadPage,
  issues: IssuesPage,
  export: ExportPage,
  project: ProjectPage,
  assets: AssetsPage,
  profile: ProfilePage,
  settings: SettingsPage,
};

const navigation = [
  {
    id: 'dashboard',
    label: 'Home',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 1 10 10H12V2z" fill="currentColor" />
      </svg>
    )
  },
  {
    id: 'upload',
    label: 'Uploads',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
    )
  },
  {
    id: 'project',
    label: 'Projects',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    )
  },
  {
    id: 'issues',
    label: 'Issues',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    )
  },
  {
    id: 'assets',
    label: 'Dependencies',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    )
  },
  {
    id: 'export',
    label: 'Exports',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
      </svg>
    )
  },
];

function readHash() {
  const value = window.location.hash.replace('#', '').toLowerCase();
  return pages[value] ? value : 'dashboard';
}

const mockNotifications = [
  { id: 1, title: 'Scan Completed Successfully', desc: 'Project "Identity Provider" finished scanning 124 dependencies.', time: '10m ago' },
  { id: 2, title: 'Medium Vulnerability Found', desc: 'jackson-databind has a vulnerability in project "Identity Provider".', time: '1h ago' },
  { id: 3, title: 'New Project Added', desc: 'ByeWind created project "Cyclops Frontend Monitoring".', time: '1d ago' },
  { id: 4, title: 'License Policy Alert', desc: 'GPL 3.0 license detected in project "Dashboard Server".', time: '2d ago' },
];

const mockHistory = [
  { id: 1, action: 'Theme Toggled', user: 'ByeWind', desc: 'Switched system UI to Dark Mode.', time: 'Just now' },
  { id: 2, action: 'SBOM File Uploaded', user: 'ByeWind', desc: 'Uploaded package-lock.json for project "Identity Provider".', time: '2h ago' },
  { id: 3, action: 'Export Generated', user: 'ByeWind', desc: 'Generated SPDX export for project "Dashboard Server".', time: '1d ago' },
  { id: 4, action: 'Active Project Scanned', user: 'System', desc: 'Nightly automated scan completed.', time: '3d ago' },
];

export default function App() {
  const [activePage, setActivePage] = useState(readHash);
  const [activeProjectId, setActiveProjectId] = useState(projectsData[0].id);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) return saved === 'true';
    return window.innerWidth <= 900;
  });
  const [activeDrawer, setActiveDrawer] = useState(null); // null | 'notifications' | 'history'
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [authView, setAuthView] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');



  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      email: 'byewind@example.com',
      password: 'password123',
      name: 'ByeWind',
      role: 'System Admin',
      org: 'Cyclops Security'
    };
  });

  const [workspace, setWorkspace] = useState(() => {
    const saved = localStorage.getItem('userWorkspace');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      projects: projectsData,
      uploads: [
        {
          name: 'manual-checks.json',
          description: 'Manual license checklist',
          date: 'Mar 10, 2026',
          size: '450 KB',
          status: 'Approved',
          statusClass: 'approved'
        },
        {
          name: 'package-lock.json',
          description: 'Node npm package lock tree',
          date: 'Dec 20, 2026',
          size: '256 KB',
          status: 'Complete',
          statusClass: 'complete'
        }
      ],
      exports: [
        {
          name: 'identity-provider-compliance-audit-report.pdf',
          description: 'Normalized PDF summary review report for Identity Provider',
          format: 'PDF Summary',
          date: 'Nov 10, 2026',
          size: '4.5 MB',
          status: 'Complete',
          statusClass: 'complete'
        }
      ]
    };
  });

  const saveWorkspaceUpdates = async (updatedWorkspace) => {
    setWorkspace(updatedWorkspace);
    localStorage.setItem('userWorkspace', JSON.stringify(updatedWorkspace));
    if (currentUser && currentUser.email) {
      await saveWorkspace(currentUser.email, updatedWorkspace);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    const handleHashChange = () => setActivePage(readHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Re-fetch workspace from server on every load when already authenticated
  useEffect(() => {
    if (!isAuthenticated || !currentUser?.email || !currentUser?.password) return;
    const refetchWorkspace = async () => {
      try {
        const res = await loginUser(currentUser.email, currentUser.password);
        if (res.success && res.workspace) {
          setWorkspace(res.workspace);
          localStorage.setItem('userWorkspace', JSON.stringify(res.workspace));
          // Sync activeProjectId to first project from DB
          if (res.workspace.projects && res.workspace.projects.length > 0) {
            setActiveProjectId(res.workspace.projects[0].id);
          }
        }
      } catch (e) {
        // Silently fall back to cached localStorage data
      }
    };
    refetchWorkspace();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);


  // Click outside to close profile popover
  useEffect(() => {
    if (!isProfileOpen) return;
    const handleDocumentClick = (e) => {
      if (!e.target.closest('.user-profile-card') && !e.target.closest('.profile-menu-popover')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [isProfileOpen]);

  // Keyboard accessibility (Escape key to close drawer/popover)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDrawer(null);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter your email.');
      return;
    }
    if (authView === 'forgot') {
      alert(`Password reset link sent to ${email}`);
      setAuthView('signin');
      return;
    }
    if (!password) {
      alert('Please enter your password.');
      return;
    }
    
    if (authView === 'signup') {
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      const res = await signupUser({ email, password });
      if (!res.success) {
        alert(res.message);
        return;
      }
      alert('Account successfully created!');
      setCurrentUser(res.user);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      if (res.workspace) {
        setWorkspace(res.workspace);
        localStorage.setItem('userWorkspace', JSON.stringify(res.workspace));
      }
    } else {
      // Sign in
      const res = await loginUser(email, password);
      if (!res.success) {
        alert(res.message);
        return;
      }
      setCurrentUser(res.user);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      if (res.workspace) {
        setWorkspace(res.workspace);
        localStorage.setItem('userWorkspace', JSON.stringify(res.workspace));
      }
    }
    
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebarCollapsed', String(next));
      return next;
    });
  };

  const activeProject = workspace.projects.find(p => p.id === activeProjectId) || workspace.projects[0];
  const ActivePage = pages[activePage];

  if (!isAuthenticated) {
    return (
      <div className="login-page-container">
        <div className="auth-card">
          <div className="auth-logo-row">
            <span className="auth-brand-logo">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V22M2 12H22M19.07 4.93L4.93 19.07M19.07 19.07L4.93 4.93" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3.5" fill="currentColor" />
              </svg>
            </span>
            <span className="auth-brand-name">Cyclops SBOM</span>
          </div>

          {authView !== 'forgot' && (
            <div className="auth-tabs">
              <button 
                type="button" 
                className={`auth-tab-btn${authView === 'signin' ? ' active' : ''}`}
                onClick={() => { setAuthView('signin'); setShowPassword(false); setEmail(''); setPassword(''); }}
              >
                Sign In
              </button>
              <button 
                type="button" 
                className={`auth-tab-btn${authView === 'signup' ? ' active' : ''}`}
                onClick={() => { setAuthView('signup'); setShowPassword(false); setShowConfirmPassword(false); setEmail(''); setPassword(''); }}
              >
                Sign Up
              </button>
            </div>
          )}

          {authView === 'signin' && (
            <div className="auth-info-box">
              <span className="auth-info-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </span>
              <div className="auth-info-content">
                <span className="auth-info-title">Demo Credentials</span>
                <span className="auth-info-text">
                  Email: <strong>byewind@example.com</strong><br />
                  Password: <strong>password123</strong>
                </span>
              </div>
            </div>
          )}

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            <div className="auth-form-group">
              <label className="auth-label">Email Address</label>
              <input 
                type="email" 
                className="auth-input" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            {authView !== 'forgot' && (
              <div className="auth-form-group">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="auth-input" 
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <button 
                    type="button" 
                    className="see-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {authView === 'signin' && (
                  <span className="auth-forgot-link" onClick={() => setAuthView('forgot')}>
                    Forgot password?
                  </span>
                )}
              </div>
            )}

            {authView === 'signup' && (
              <div className="auth-form-group">
                <label className="auth-label">Confirm Password</label>
                <div className="auth-input-wrapper">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    className="auth-input" 
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                  />
                  <button 
                    type="button" 
                    className="see-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            <button type="submit" className="auth-submit-btn">
              {authView === 'signin' ? 'Sign In' : authView === 'signup' ? 'Sign Up' : 'Send Reset Link'}
            </button>

            {authView === 'forgot' && (
              <span className="auth-back-link" onClick={() => setAuthView('signin')}>
                Back to Sign In
              </span>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-shell${isSidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand-section">
            <span className="brand-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V22M2 12H22M19.07 4.93L4.93 19.07M19.07 19.07L4.93 4.93" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3.5" fill="currentColor" />
              </svg>
            </span>
            <span className="brand-name">Cyclops</span>
          </div>

          <nav className="nav-list" aria-label="Primary">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={item.id === activePage ? 'nav-item active' : 'nav-item'}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="sidebar-bottom">
          {/* Profile Menu Popover */}
          <div className={`profile-menu-popover${isProfileOpen ? ' active' : ''}`}>
            <div className="profile-menu-header">
              <div className="profile-menu-user-name">{currentUser.name || currentUser.email}</div>
              <div className="profile-menu-user-role">{currentUser.role || 'Developer'}</div>
            </div>
            <button className="profile-menu-item" type="button" onClick={() => { setIsProfileOpen(false); window.location.hash = '#profile'; }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              My Profile
            </button>
            <button className="profile-menu-item" type="button" onClick={() => { setIsProfileOpen(false); window.location.hash = '#settings'; }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Settings
            </button>
            <button className="profile-menu-item logout-item" type="button" onClick={() => { setIsProfileOpen(false); setIsAuthenticated(false); localStorage.removeItem('isAuthenticated'); localStorage.removeItem('currentUser'); localStorage.removeItem('userWorkspace'); setWorkspace({ projects: projectsData, uploads: [], exports: [] }); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Log out
            </button>
          </div>

          <div className="user-profile-card" onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); }}>
            <svg width="28" height="28" viewBox="0 0 100 100" className="user-avatar">
              <defs>
                <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a8b2fc" />
                  <stop offset="100%" stopColor="#80b3ff" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="50" fill="url(#avatarGrad)" />
              <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#ffffff" fontSize="36" fontWeight="bold" fontFamily="system-ui">
                {getInitials(currentUser.name)}
              </text>
            </svg>
            <span className="user-name">{currentUser.name || currentUser.email.split('@')[0]}</span>
          </div>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="topbar-btn" type="button" aria-label="Toggle Sidebar" onClick={toggleSidebar}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button>

            <div className="breadcrumbs">
              <span className="breadcrumb-item">Dashboards</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">
                {activePage === 'dashboard' ? 'Default' : activePage === 'issues' ? 'Overview' : activePage === 'profile' ? 'Profile' : activePage === 'settings' ? 'Settings' : (navigation.find(n => n.id === activePage)?.label || 'Overview')}
              </span>
            </div>
          </div>
          <div className="topbar-right">
            <div className="search-container">
              <span className="search-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input className="search-input" type="search" placeholder="Search" />
              <span className="search-shortcut">⌘ /</span>
            </div>
            <button className="topbar-btn" type="button" aria-label="Theme" onClick={toggleTheme}>
              {theme === 'light' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>
            <button className="topbar-btn" type="button" aria-label="History" onClick={() => setActiveDrawer('history')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </button>
            <button className="topbar-btn" type="button" aria-label="Notifications" onClick={() => setActiveDrawer('notifications')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
          </div>
        </header>

        <section className="page-frame">
          <ActivePage
            activeProject={activeProject}
            setActiveProjectId={setActiveProjectId}
            projectsData={workspace.projects}
            theme={theme}
            setTheme={setTheme}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            workspace={workspace}
            saveWorkspace={saveWorkspaceUpdates}
          />
        </section>
      </main>

      {/* Sidebar Backdrop for Mobile */}
      <div 
        className={`sidebar-backdrop${!isSidebarCollapsed ? ' active' : ''}`} 
        onClick={() => setIsSidebarCollapsed(true)}
      />

      {/* Drawer Backdrop */}
      <div 
        className={`drawer-backdrop${activeDrawer ? ' active' : ''}`} 
        onClick={() => setActiveDrawer(null)}
      />

      {/* Right Drawer */}
      <aside className={`right-drawer${activeDrawer ? ' active' : ''}`}>
        <div className="drawer-header">
          <h3 className="drawer-title">
            {activeDrawer === 'notifications' ? 'Notifications' : activeDrawer === 'history' ? 'Audit History' : ''}
          </h3>
          <button className="drawer-close-btn" type="button" aria-label="Close Drawer" onClick={() => setActiveDrawer(null)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="drawer-content">
          {activeDrawer === 'notifications' && (
            mockNotifications.map(n => (
              <div key={n.id} className="drawer-item">
                <div className="drawer-item-title">{n.title}</div>
                <div className="drawer-item-desc">{n.desc}</div>
                <div className="drawer-item-time">{n.time}</div>
              </div>
            ))
          )}

          {activeDrawer === 'history' && (
            mockHistory.map(h => (
              <div key={h.id} className="drawer-item">
                <div className="drawer-item-title">{h.action}</div>
                <div className="drawer-item-desc">{h.desc}</div>
                <div className="drawer-item-time">{h.time} by {h.user}</div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}