import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Users({ user, searchQuery }: { user: any, searchQuery?: string }) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const filteredUsers = searchQuery 
    ? users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    : users;

  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="view active fade-up">
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="user-avatar" style={{ background: `${u.color}20`, color: u.color, width: '32px', height: '32px', borderRadius: '9px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {initials(u.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{u.name}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: 'var(--muted)', fontSize: '13px' }}>{u.email}</td>
                <td><span className={`chip ${u.role === 'admin' ? 'chip-active' : 'chip-inactive'}`}>{u.role}</span></td>
                <td style={{ color: 'var(--muted)', fontSize: '12px' }}>{new Date(u.joinedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
