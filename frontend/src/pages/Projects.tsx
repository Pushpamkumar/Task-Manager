import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Projects({ user, searchQuery }: { user: any, searchQuery?: string }) {
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

  const filterOptions = [
    { id: 'all', label: 'All', icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { id: 'active', label: 'Active', icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> },
    { id: 'done', label: 'Done', icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> },
  ];

  const filteredProjects = projects.filter(p => {
    // Search filter
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Status filter
    if (filter === 'all') return true;
    const ptasks = tasks.filter(t => t.projectId === p.id);
    const pdone = ptasks.filter(t => t.status === 'done').length;
    const isDone = ptasks.length > 0 && pdone === ptasks.length;
    if (filter === 'done') return isDone;
    if (filter === 'active') return !isDone;
    return true;
  });

  return (
    <div className="view active fade-up">
      <div className="filter-bar">
        {filterOptions.map((f) => (
          <button 
            key={f.id} 
            className={`filter-chip ${filter === f.id ? 'active' : ''}`} 
            onClick={() => setFilter(f.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {f.icon} {f.label}
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
