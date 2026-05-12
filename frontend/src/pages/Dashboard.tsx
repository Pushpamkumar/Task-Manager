import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Dashboard({ user }: { user: any }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, taskRes, actRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks'),
          api.get('/activity')
        ]);
        setProjects(projRes.data);
        setTasks(taskRes.data);
        setActivities(actRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done');
  const done = tasks.filter(t => t.status === 'done');

  const stats = [
    { label: 'Total Projects', value: projects.length, cls: 'c-accent' },
    { label: 'Active Tasks', value: tasks.filter(t => t.status !== 'done').length, cls: 'c-blue' },
    { label: 'Completed', value: done.length, cls: 'c-orange' },
    { label: 'Overdue', value: overdue.length, cls: 'c-pink' },
  ];

  const recent = projects.slice(0, 4);

  return (
    <div className="view active fade-up">
      <div className="stat-grid">
        {stats.map((s, i) => (
          <div key={i} className={`stat-card ${s.cls} fade-up-${i + 1}`}>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-value ${s.cls}`}>{s.value}</div>
            <div className="stat-delta">
              {s.label === 'Overdue' && s.value > 0 ? '⚠️ Needs attention' : s.label === 'Completed' ? '🎉 Great work!' : 'Active'}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
        <div>
          <div className="section-header">
            <div className="section-title">Recent Projects</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/projects')}>View all →</button>
          </div>
          <div className="projects-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {recent.map(p => {
              const ptasks = tasks.filter(t => t.projectId === p.id);
              const pdone = ptasks.filter(t => t.status === 'done').length;
              const pct = ptasks.length ? Math.round((pdone / ptasks.length) * 100) : 0;
              const deadline = p.deadline ? new Date(p.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline';
              
              return (
                <div key={p.id} className="project-card" onClick={() => navigate(`/projects/${p.id}`)}>
                  <div className="project-card-header">
                    <div className="project-icon" style={{ background: `${p.color}15`, color: p.color }}>{p.emoji || '📁'}</div>
                  </div>
                  <div className="project-name">{p.name}</div>
                  <div className="project-desc">{p.description}</div>
                  
                  <div className="project-progress-label"><span>Progress</span><span>{pct}%</span></div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: p.color }}></div></div>
                  
                  <div className="project-meta" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="member-avatars">
                      {p.members?.slice(0, 3).map((m: any) => (
                        <div key={m.user.id} className="member-avatar" style={{ background: m.user.color, color: '#000' }}>
                          {m.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </div>
                      ))}
                      {p.members?.length > 3 && <div className="member-avatar" style={{ background: 'var(--card2)', color: 'var(--muted)' }}>+{p.members.length - 3}</div>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: 'var(--muted)' }}>
                      <span>📋 {ptasks.length} tasks</span>
                      <span>🗓️ {deadline}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {!projects.length && (
              <div className="empty" style={{ gridColumn: '1 / -1' }}><p>No projects yet. Create one to get started!</p></div>
            )}
          </div>
        </div>
        
        <div>
          <div className="section-header"><div className="section-title">Activity Feed</div></div>
          <div className="table-wrap" style={{ background: 'var(--card)', padding: '20px' }}>
            <div className="activity-list">
              {activities.length > 0 ? activities.map(a => (
                <div key={a.id} className="activity-item" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <div className="activity-dot" style={{ background: a.color, width: '8px', height: '8px', marginTop: '6px' }}></div>
                  <div style={{ flex: 1 }}>
                    <div className="activity-text" style={{ fontSize: '13px', lineHeight: '1.4' }}>{a.text}</div>
                    <div className="activity-time" style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                      {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(a.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="empty" style={{ padding: '20px 0' }}><p>No recent activity</p></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
