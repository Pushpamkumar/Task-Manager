import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Auth from './pages/Auth';
import './App.css';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import ProjectDetail from './pages/ProjectDetail';
import Modals from './components/Modals';

function AppContent() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || 'null'));
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token && user && location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [token, user, location.pathname, navigate]);

  const handleLogin = (t: string, u: any) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
    setToken(t);
    setUser(u);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  if (!token || !user) {
    return <Auth onLogin={handleLogin} />;
  }

  const initials = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const isAdmin = user.role === 'admin';

  const viewTitles: any = {
    '/dashboard': 'Dashboard',
    '/projects': 'Projects',
    '/tasks': 'My Tasks',
    '/users': 'User Management',
    '/reports': 'Reports & Analytics',
    '/profile': 'My Profile'
  };

  const currentTitle = viewTitles[location.pathname] || 'Project Detail';

  const handleTopbarAction = () => {
    if (location.pathname === '/tasks' || location.pathname.startsWith('/projects/')) {
      setModalOpen('task');
    } else if (isAdmin) {
      setModalOpen('project');
    }
  };

  const topbarActionText = (location.pathname === '/tasks' || location.pathname.startsWith('/projects/')) 
    ? '+ New Task' 
    : '+ New Project';

  return (
    <div id="app" className="visible" style={{ display: 'flex' }}>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">⚡</div>
          <span className="logo-text">TaskFlow</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">Overview</div>
          <div className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>
            <span className="nav-icon">▣</span> Dashboard
          </div>
          <div className="nav-section">Work</div>
          <div className={`nav-item ${location.pathname === '/projects' ? 'active' : ''}`} onClick={() => navigate('/projects')}>
            <span className="nav-icon">◈</span> Projects
          </div>
          <div className={`nav-item ${location.pathname === '/tasks' ? 'active' : ''}`} onClick={() => navigate('/tasks')}>
            <span className="nav-icon">✓</span> My Tasks
          </div>
          {isAdmin && (
            <>
              <div className="nav-section">Admin</div>
              <div className={`nav-item ${location.pathname === '/users' ? 'active' : ''}`} onClick={() => navigate('/users')}>
                <span className="nav-icon">👥</span> Users
              </div>
              <div className={`nav-item ${location.pathname === '/reports' ? 'active' : ''}`} onClick={() => navigate('/reports')}>
                <span className="nav-icon">📊</span> Reports
              </div>
            </>
          )}
        </nav>
        <div className="sidebar-user">
          <div className="user-card" onClick={() => navigate('/profile')}>
            <div className="user-avatar" style={{ background: user.color, color: '#000' }}>{initials}</div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-role"><span className={`role-${user.role}`}>{user.role.toUpperCase()}</span></div>
            </div>
          </div>
          <button className="btn btn-ghost btn-full btn-sm" style={{ marginTop: '8px' }} onClick={handleLogout}>Sign Out</button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-title">{currentTitle}</div>
          <div className="topbar-actions">
            <div className="search-bar">
              <span style={{ color: 'var(--muted)', fontSize: '14px' }}>🔍</span>
              <input type="text" placeholder="Search..." />
            </div>
            {(isAdmin || location.pathname === '/tasks' || location.pathname.startsWith('/projects/')) && (
              <button className="btn btn-primary btn-sm" onClick={handleTopbarAction}>{topbarActionText}</button>
            )}
          </div>
        </header>
        <div className="content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard user={user} token={token} />} />
            <Route path="/projects" element={<Projects user={user} token={token} />} />
            <Route path="/projects/:id" element={<ProjectDetail user={user} setModalOpen={setModalOpen} setSelectedTask={setSelectedTask} />} />
            <Route path="/tasks" element={<Tasks user={user} setModalOpen={setModalOpen} setSelectedTask={setSelectedTask} />} />
            <Route path="/users" element={isAdmin ? <Users user={user} token={token} /> : <Navigate to="/dashboard" />} />
            <Route path="/reports" element={isAdmin ? <Reports user={user} token={token} /> : <Navigate to="/dashboard" />} />
            <Route path="/profile" element={<Profile user={user} token={token} onUpdate={setUser} />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
      
      <Modals 
        isOpen={modalOpen} 
        onClose={() => { setModalOpen(null); setSelectedTask(null); }} 
        user={user} 
        selectedTask={selectedTask}
        setModalOpen={setModalOpen}
        onSuccess={() => {
          // Quick hack to force reload the current view by navigating to it again
          const curr = location.pathname;
          navigate('/', { replace: true });
          setTimeout(() => navigate(curr, { replace: true }), 10);
        }} 
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
