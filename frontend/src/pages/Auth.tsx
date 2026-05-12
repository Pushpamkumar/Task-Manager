import React, { useState } from 'react';
import './Auth.css';

interface AuthProps {
  onLogin: (token: string, user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      onLogin(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const quickLogin = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div id="auth-screen">
      <div className="auth-wrap">
        <div className="auth-left">
          <div className="auth-logo">
            <div className="auth-logo-icon">⚡</div>
            <span className="auth-logo-text">TaskFlow</span>
          </div>
          <div className="auth-left-content">
            <div className="auth-tagline">Manage work,<br/><span>not chaos.</span></div>
            <p className="auth-sub">A modern project management platform with real-time task tracking, role-based access, and beautiful dashboards.</p>
          </div>
          <div className="auth-badges">
            <div className="badge">🔐 RBAC</div>
            <div className="badge">📊 Analytics</div>
            <div className="badge">⚡ Real-time</div>
            <div className="badge">📱 Responsive</div>
          </div>
        </div>
        <div className="auth-right">
          <div>
            <h2>Welcome back</h2>
            <p>Sign in to your workspace</p>
          </div>
          <div className="tabs">
            <div className={`tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Sign In</div>
            <div className={`tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Sign Up</div>
          </div>

          {error && <div style={{ color: 'var(--red)', fontSize: '13px' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Alex Johnson" />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {/* Role selection removed - defaulting to member */}
            <button type="submit" className="btn btn-primary btn-full">
              {isLogin ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>

          {isLogin && (
            <div className="auth-demo">
              <p>Quick Demo Login</p>
              <div className="demo-users">
                <div className="demo-user" onClick={() => quickLogin('admin@taskflow.io', 'Admin123')}>
                  <span>admin@taskflow.io</span><strong>Admin</strong>
                </div>
                <div className="demo-user" onClick={() => quickLogin('pushpamkumar669@gmail.com', 'Pushp@m009')}>
                  <span>pushpamkumar669@gmail.com</span><strong>Member</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
