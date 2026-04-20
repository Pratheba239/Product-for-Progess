'use client';

import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import EisenhowerMatrix from '@/components/EisenhowerMatrix';
import DraggableTask from '@/components/DraggableTask';
import { Plus, Filter, Database, Search } from 'lucide-react';
import { taskApi } from '@/lib/api';
import { motion } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  deadline: string;
  priority: string;
  status?: string;
}

const WorkPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // In this demo environment, we'll use local state if the API is not yet live
        // or a hardcoded userId.
        const res = await taskApi.getAll('USER_01');
        setTasks(res.data);
      } catch (err) {
        console.warn('API_OFFLINE: Using fallback data');
        setTasks([
          { id: '1', title: 'AZURE_SERVICES_PROPOSAL', deadline: '2026-04-20', priority: 'urgent_important' },
          { id: '2', title: 'QUARTERLY_REVENUE_AUDIT', deadline: '2026-04-19', priority: 'urgent_important' },
          { id: '3', title: 'NEURAL_LINK_MAINTENANCE', deadline: '2026-05-01', priority: 'not_urgent_important' },
          { id: '4', title: 'LEGACY_CODE_CLEANUP', deadline: '2026-04-25', priority: 'urgent_not_important' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const newPriority = over.id as string;
      setTasks(prev => prev.map(t => 
        t.id === active.id ? { ...t, priority: newPriority } : t
      ));
      
      try {
        await taskApi.updatePriority(active.id as string, newPriority);
      } catch (err) {
        console.error('PRIORITY_SYNC_FAILED');
      }
    }
  };

  const tasksByPriority = {
    urgent_important: tasks.filter(t => t.priority === 'urgent_important'),
    not_urgent_important: tasks.filter(t => t.priority === 'not_urgent_important'),
    urgent_not_important: tasks.filter(t => t.priority === 'urgent_not_important'),
    not_urgent_not_important: tasks.filter(t => t.priority === 'not_urgent_not_important'),
  };

  return (
    <div className="work-protocol">
      <header className="protocol-header">
        <div className="title-area">
          <h1 className="mono">OPERATIONAL_PRIORITY_MATRIX</h1>
          <p className="mono text-dim">TASK_DISTRIBUTION_PROTOCOL_v2.4</p>
        </div>
        <div className="protocol-actions">
          <div className="search-box">
            <Search size={16} />
            <input type="text" placeholder="FILTER_THREADS..." className="mono" />
          </div>
          <button className="neon-btn secondary mono"><Plus size={16} /> NEW_TASK</button>
        </div>
      </header>

      <div className="protocol-container">
        <section className="matrix-layer">
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <EisenhowerMatrix 
              childrenMap={Object.fromEntries(
                Object.entries(tasksByPriority).map(([key, list]) => [
                  key,
                  list.map(t => (
                    <DraggableTask 
                      key={t.id} 
                      id={t.id} 
                      title={t.title} 
                      deadline={t.deadline} 
                    />
                  ))
                ])
              )}
            />
          </DndContext>
        </section>

        <section className="terminal-log neon-card">
          <div className="card-header">
            <Database size={16} className="text-glow-cyan" />
            <h3 className="mono">MASTER_TASK_STREAM</h3>
          </div>
          
          <div className="stream-content">
            <table className="terminal-table mono">
              <thead>
                <tr>
                  <th>UUID</th>
                  <th>IDENTIFIER</th>
                  <th>TIMESTAMP</th>
                  <th>PRIORITY</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className="stream-row">
                    <td className="text-dim">{task.id.substring(0, 8)}</td>
                    <td>{task.title}</td>
                    <td>{task.deadline}</td>
                    <td><span className={`priority-tag ${task.priority}`}>{task.priority}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <style jsx>{`
        .work-protocol {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .protocol-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 1.5rem;
        }

        .protocol-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-accent);
          padding: 0.5rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          color: var(--text-dim);
        }

        .search-box input {
          background: none;
          border: none;
          color: var(--text-primary);
          outline: none;
          font-size: 0.8rem;
        }

        .neon-btn {
          background: none;
          border: 1px solid var(--neon-cyan);
          color: var(--neon-cyan);
          padding: 0.5rem 1rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.8rem;
        }

        .neon-btn:hover {
          background: rgba(0, 240, 255, 0.1);
          box-shadow: 0 0 10px var(--neon-cyan-glow);
        }

        .protocol-container {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .matrix-layer {
          width: 100%;
        }

        .terminal-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.75rem;
          margin-top: 1rem;
        }

        .terminal-table th {
          text-align: left;
          padding: 0.75rem;
          color: var(--text-dim);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .terminal-table td {
          padding: 1rem 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        }

        .stream-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .priority-tag {
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 2px;
          border: 1px solid currentColor;
        }

        .priority-tag.urgent_important { color: var(--neon-red); }
        .priority-tag.not_urgent_important { color: var(--neon-green); }
        .priority-tag.urgent_not_important { color: var(--neon-cyan); }
        .priority-tag.not_urgent_not_important { color: var(--text-dim); }
      `}</style>
    </div>
  );
};

export default WorkPage;
