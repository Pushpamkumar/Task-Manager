import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function ProjectDetail({ user, setModalOpen, setSelectedTask, searchQuery }: { user: any, setModalOpen: any, setSelectedTask: any, searchQuery?: string }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);

  const isAdmin = user.role === 'admin';

  const fetchData = async () => {
    try {
      const [projRes, taskRes, userRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks'),
        isAdmin ? api.get('/users') : Promise.resolve({ data: [] })
      ]);
      const p = projRes.data.find((x: any) => x.id === id);
      if (!p) {
        navigate('/projects');
        return;
      }
      setProject(p);
      setTasks(taskRes.data.filter((t: any) => t.projectId === id));
      if (isAdmin) setAllUsers(userRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (!project) return null;

  const pdone = tasks.filter(t => t.status === 'done').length;
  const pct = tasks.length ? Math.round((pdone / tasks.length) * 100) : 0;

  const handleAddMember = async (userId: string) => {
    try {
      const currentMemberIds = project.members.map((m: any) => m.userId);
      if (currentMemberIds.includes(userId)) return;

      const updatedMembers = [...currentMemberIds, userId];
      await api.put(`/projects/${project.id}`, {
        ...project,
        members: updatedMembers
      });
      fetchData();
      setShowAddMember(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!window.confirm('Remove this member from the project?')) return;
    try {
      const updatedMembers = project.members.map((m: any) => m.userId).filter((id: string) => id !== userId);
      await api.put(`/projects/${project.id}`, {
        ...project,
        members: updatedMembers
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const cols = [
    { key: 'todo', label: 'To Do', color: '#7a7a9a' },
    { key: 'inprogress', label: 'In Progress', color: '#ffb347' },
    { key: 'done', label: 'Done', color: '#2ecc71' },
  ];

  const openTaskDetail = (task: any) => {
    setSelectedTask(task);
    setModalOpen('taskDetail');
  };

  const visibleTasks = searchQuery 
    ? tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : tasks;

  const availableUsers = allUsers.filter(u => 
    u.role !== 'admin' && !project.members.some((m: any) => m.userId === u.id)
  );

  return (
    <div className="view active fade-up">
      <div className="project-detail-header" style={{ '--accent-color': project.color } as any}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '40px' }}>{project.emoji || '📁'}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '32px', fontWeight: 800, letterSpacing: '-0.8px', marginBottom: '4px' }}>{project.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px', maxWidth: '600px' }}>{project.description}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: '12px', color: 'var(--muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> {project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline'}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> {pdone}/{tasks.length} tasks</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', minWidth: '160px' }}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: '48px', fontWeight: 800, color: project.color, lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>complete</div>
            <div className="progress-bar" style={{ marginTop: '12px', height: '8px', background: 'var(--border2)' }}>
              <div className="progress-fill" style={{ width: `${pct}%`, background: project.color }}></div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 300px' : '1fr', gap: '32px', marginTop: '32px' }}>
        <div>
          <div className="section-header">
            <div className="section-title" style={{ fontSize: '20px' }}>Task Board</div>
            <button className="btn btn-primary btn-sm" onClick={() => setModalOpen('task')}>+ Add Task</button>
          </div>

          <div className="tasks-board">
            {cols.map(col => {
              const colTasks = visibleTasks.filter(t => t.status === col.key);
              return (
                <div key={col.key} className="task-col" style={{ background: 'var(--card)50' }}>
                  <div className="task-col-header">
                    <div className="task-col-title">
                      <div className="col-dot" style={{ background: col.color }}></div>{col.label}
                    </div>
                    <div className="task-count">{colTasks.length}</div>
                  </div>
                  <div className="task-items">
                    {colTasks.length > 0 ? colTasks.map(t => {
                      const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done';
                      const assignee = project.members?.find((m: any) => m.userId === t.assigneeId)?.user;
                      return (
                        <div key={t.id} className="task-item" style={{ position: 'relative' }} onClick={() => openTaskDetail(t)}>
                          <div className="task-title" style={{ fontSize: '14px', fontWeight: 600 }}>{t.title}</div>
                          <div className="task-meta" style={{ marginTop: '12px' }}>
                            <span className={`priority-badge p-${t.priority}`} style={{ fontSize: '10px' }}>{t.priority}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {isOverdue && <span style={{ color: 'var(--red)', fontSize: '10px', fontWeight: 700 }}>⚠️ LATE</span>}
                              {t.dueDate && <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                              {assignee && (
                                <div className="member-avatar" style={{ background: assignee.color, color: '#000', width: '22px', height: '22px', fontSize: '9px', marginLeft: '4px' }}>
                                  {assignee.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="empty" style={{ padding: '40px 20px' }}>
                        <div className="empty-icon" style={{ fontSize: '24px' }}>
                          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                        </div>
                        <p style={{ fontSize: '12px' }}>No tasks found</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {isAdmin && (
          <div>
            <div className="section-header">
              <div className="section-title" style={{ fontSize: '20px' }}>Project Team</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAddMember(!showAddMember)}>{showAddMember ? '✕' : '+ Invite'}</button>
            </div>

            <div className="table-wrap" style={{ background: 'var(--card)', padding: '20px', position: 'relative' }}>
              {showAddMember && (
                <div style={{ marginBottom: '20px', padding: '12px', background: 'var(--card2)', borderRadius: '12px', border: '1px solid var(--accent)40' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Select Member to Add</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                    {availableUsers.map(u => (
                      <div key={u.id} className="demo-user" style={{ padding: '8px' }} onClick={() => handleAddMember(u.id)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: u.color, color: '#000', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{u.name[0]}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '12px', fontWeight: 600 }}>{u.name}</div>
                            <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{u.email}</div>
                          </div>
                          <span style={{ fontSize: '10px', color: 'var(--accent)' }}>+ Add</span>
                        </div>
                      </div>
                    ))}
                    {availableUsers.length === 0 && <div style={{ fontSize: '11px', textAlign: 'center', padding: '10px', color: 'var(--muted)' }}>No members available to add</div>}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {project.members.map((m: any) => (
                  <div key={m.user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: m.user.color, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                        {m.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{m.user.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{m.user.email}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveMember(m.user.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '4px' }}
                      title="Remove Member"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
