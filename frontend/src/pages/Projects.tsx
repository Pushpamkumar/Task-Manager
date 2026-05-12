import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Projects({ user }: { user: any }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

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
    fetchData();
  }, []);

  const filters = ['all', '🚀 Active', '✅ Done'];

  const filteredProjects = projects.filter(p => {
    if (filter === 'all') return true;
    const ptasks = tasks.filter(t => t.projectId === p.id);
    const pdone = ptasks.filter(t => t.status === 'done').length;
    const isDone = ptasks.length > 0 && pdone === ptasks.length;
    if (filter === '✅ Done') return isDone;
    if (filter === '🚀 Active') return !isDone;
    return true;
  });

  return (
    <div className="view active fade-up">
      <div className="filter-bar">
        {filters.map((f, i) => (
          <button 
            key={i} 
            className={`filter-chip ${filter === f ? 'active' : ''}`} 
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="projects-grid">
        {filteredProjects.map(p => {
          const ptasks = tasks.filter(t => t.projectId === p.id);
          const pdone = ptasks.filter(t => t.status === 'done').length;
          const pct = ptasks.length ? Math.round((pdone / ptasks.length) * 100) : 0;
          return (
            <div key={p.id} className="project-card" onClick={() => navigate(`/projects/${p.id}`)}>
              <div className="project-card-header">
                <div className="project-icon" style={{ background: `${p.color}22` }}>{p.emoji || '📁'}</div>
              </div>
              <div className="project-name">{p.name}</div>
              <div className="project-desc">{p.description}</div>
              <div className="project-progress-label"><span>Progress</span><span>{pct}%</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: p.color }}></div></div>
              <div className="project-meta">
                <span>{ptasks.length} tasks</span>
              </div>
            </div>
          );
        })}
        {!filteredProjects.length && (
          <div className="empty" style={{ gridColumn: '1/-1' }}>
            <div className="empty-icon">🗂️</div>
            <p>No projects yet. {user.role === 'admin' ? 'Create one!' : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
}
