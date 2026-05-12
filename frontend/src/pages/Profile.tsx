import React, { useState } from 'react';
import api from '../utils/api';

export default function Profile({ user, onUpdate }: { user: any, onUpdate: any }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    try {
      setError('');
      const res = await api.put('/users/profile', { name, email, password });
      onUpdate(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setPassword('');
      alert('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Update failed');
    }
  };

  const initials = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="view active fade-up">
      <div style={{ maxWidth: '480px' }}>
        <div className="table-wrap" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: `${user.color}20`, color: user.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700 }}>
              {initials}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '20px', fontWeight: 700 }}>{user.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{user.email}</div>
              <span className={`chip ${user.role === 'admin' ? 'chip-active' : 'chip-inactive'}`} style={{ marginTop: '6px' }}>{user.role}</span>
            </div>
          </div>
          {error && <div style={{ color: 'var(--red)', fontSize: '13px' }}>{error}</div>}
          <div className="form-group"><label>Display Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} /></div>
          <div className="form-group"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="form-group"><label>New Password (leave blank to keep)</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" /></div>
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
