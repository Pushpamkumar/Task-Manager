import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Tasks({ user, searchQuery }: { user: any, searchQuery?: string }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

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

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (taskId: string, newStatus: string) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filters = ['all', 'todo', 'inprogress', 'done', 'overdue'];
  const filterLabels: any = { all: 'All', todo: 'To Do', inprogress: 'In Progress', done: 'Done', overdue: 'Overdue' };

  let filteredTasks = tasks.filter(t => user.role === 'admin' || t.assigneeId === user.id);
  
  if (searchQuery) {
    filteredTasks = filteredTasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  if (filter === 'overdue') {
    filteredTasks = filteredTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done');
  } else if (filter !== 'all') {
    filteredTasks = filteredTasks.filter(t => t.status === filter);
  }

  return (
    <div className="view active fade-up">
      <div className="filter-bar">
        {filters.map(f => (
          <button 
            key={f} 
            className={`filter-chip ${filter === f ? 'active' : ''}`} 
            onClick={() => setFilter(f)}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Project</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {!filteredTasks.length ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty">
                    <div className="empty-icon">✓</div>
                    <p>No tasks found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTasks.map(t => {
                const p = projects.find(x => x.id === t.projectId);
                const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done';
                const canEdit = user.role === 'admin' || t.assigneeId === user.id;

                return (
                  <tr key={t.id}>
                    <td><span style={{ fontWeight: 500 }}>{t.title}</span></td>
                    <td><span style={{ color: p?.color || 'var(--muted)' }}>● </span>{p?.name || '—'}</td>
                    <td>
                      <select 
                        value={t.status}
                        onChange={(e) => updateStatus(t.id, e.target.value)}
                        disabled={!canEdit}
                        style={{ background: 'var(--card2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', cursor: canEdit ? 'pointer' : 'default' }}
                      >
                        <option value="todo">To Do</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </td>
                    <td><span className={`priority-badge p-${t.priority}`}>{t.priority}</span></td>
                    <td style={{ color: isOverdue ? 'var(--red)' : 'inherit' }}>
                      {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}
                      {isOverdue && ' ⚠️'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
