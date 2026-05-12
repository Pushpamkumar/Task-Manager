import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Reports({ user }: { user: any }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks')
        ]);
        setProjects(projRes.data);
        setTasks(taskRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user.role === 'admin') fetchData();
  }, [user]);

  const todo = tasks.filter(t => t.status === 'todo').length;
  const inprog = tasks.filter(t => t.status === 'inprogress').length;
  const done = tasks.filter(t => t.status === 'done').length;
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;

  const chartData = [
    { label: 'To Do', value: todo, color: '#7a7a9a' },
    { label: 'In Progress', value: inprog, color: '#ffb347' },
    { label: 'Done', value: done, color: '#2ecc71' },
    { label: 'Overdue', value: overdue, color: '#ff4444' },
  ];
  const max = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div className="view active fade-up">
      <div className="stat-grid">
        <div className="stat-card c-accent">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="stat-label">Total Tasks</div>
            <div style={{ color: 'var(--accent)', opacity: 0.5 }}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20"></path></svg></div>
          </div>
          <div className="stat-value c-accent">{tasks.length}</div>
        </div>
        <div className="stat-card c-orange">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="stat-label">In Progress</div>
            <div style={{ color: 'var(--orange)', opacity: 0.5 }}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
          </div>
          <div className="stat-value c-orange">{inprog}</div>
        </div>
        <div className="stat-card c-blue">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="stat-label">Completed</div>
            <div style={{ color: 'var(--blue)', opacity: 0.5 }}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
          </div>
          <div className="stat-value c-blue">{done}</div>
        </div>
        <div className="stat-card c-pink">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="stat-label">Overdue</div>
            <div style={{ color: 'var(--pink)', opacity: 0.5 }}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div>
          </div>
          <div className="stat-value c-pink">{overdue}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '4px' }}>
        <div>
          <div className="section-header"><div className="section-title">Project Progress</div></div>
          <div>
            {projects.map(p => {
              const ptasks = tasks.filter(t => t.projectId === p.id);
              const pdone = ptasks.filter(t => t.status === 'done').length;
              const pct = ptasks.length ? Math.round((pdone / ptasks.length) * 100) : 0;
              return (
                <div key={p.id} style={{ marginBottom: '16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{p.emoji}</span>
                      <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.3px' }}>{p.name}</span>
                    </div>
                    <span style={{ fontSize: '13px', color: p.color, fontWeight: 800 }}>{pct}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: '8px', background: 'var(--border)' }}>
                    <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${p.color}aa, ${p.color})`, boxShadow: `0 0 10px ${p.color}40` }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginTop: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> {pdone}/{ptasks.length} tasks</span>
                    <span>{p.deadline ? `📅 ${new Date(p.deadline).toLocaleDateString()}` : ''}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="section-header"><div className="section-title">Tasks by Status</div></div>
          <div className="table-wrap" style={{ padding: '24px' }}>
            {chartData.map(d => (
              <div key={d.label} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--muted)' }}>{d.label}</span>
                  <span style={{ fontWeight: 600 }}>{d.value}</span>
                </div>
                <div style={{ height: '10px', background: 'var(--border)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round((d.value / max) * 100)}%`, background: d.color, borderRadius: '5px', transition: 'width .6s ease' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
