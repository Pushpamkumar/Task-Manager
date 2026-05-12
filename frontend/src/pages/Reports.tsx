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
        <div className="stat-card c-accent"><div className="stat-label">Total Tasks</div><div className="stat-value c-accent">{tasks.length}</div></div>
        <div className="stat-card c-orange"><div className="stat-label">In Progress</div><div className="stat-value c-orange">{inprog}</div></div>
        <div className="stat-card c-blue"><div className="stat-label">Completed</div><div className="stat-value c-blue">{done}</div></div>
        <div className="stat-card c-pink"><div className="stat-label">Overdue</div><div className="stat-value c-pink">{overdue}</div></div>
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
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{p.emoji} {p.name}</span>
                    <span style={{ fontSize: '13px', color: p.color, fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: '6px' }}><div className="progress-fill" style={{ width: `${pct}%`, background: p.color }}></div></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginTop: '8px' }}>
                    <span>{pdone}/{ptasks.length} tasks</span>
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
