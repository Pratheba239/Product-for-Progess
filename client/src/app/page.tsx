'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Terminal, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  ArrowUpRight 
} from 'lucide-react';
import { taskApi } from '@/lib/api';

export default function Home() {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const tRes = await taskApi.getAll('USER_01');
        setTasks(tRes.data.slice(0, 3)); // Top 3 tasks
      } catch (err) {
        console.error('DASHBOARD_SYNC_FAILURE');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const dailyFocus = tasks.map(t => ({
    title: t.title,
    progress: t.status === 'completed' ? 100 : (t.status === 'in_progress' ? 50 : 10),
    id: t.id
  }));

  return (
    <div className="dashboard-view">
      <header className="system-status">
        <div className="status-label mono text-glow-green">SYSTEM_STATUS_ONLINE</div>
        <h1 className="mono operator-name">OPERATOR_01</h1>
        
        <div className="metric-row">
          <div className="metric-card">
            <span className="mono text-dim">UPTIME</span>
            <span className="mono text-glow-cyan">142:32:04</span>
          </div>
          <div className="metric-card">
            <span className="mono text-dim">EFFICIENCY</span>
            <span className="mono text-glow-green">98.4%</span>
          </div>
        </div>
      </header>

      <section className="grid-layout">
        <div className="main-column">
          <motion.div 
            className="neon-card mission-control"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="card-header">
              <h2 className="mono">DAILY_FOCUS</h2>
              <span className="mono text-dim">PRIORITY_COMMANDS_FOR_TODAY</span>
            </div>

            <div className="focus-list">
              {dailyFocus.map((item, i) => (
                <div key={i} className="focus-item">
                  <div className="item-header">
                    <span className="mono">{item.title}</span>
                    <span className="mono text-glow-cyan">{item.progress}%</span>
                  </div>
                  <div className="progress-container">
                    <motion.div 
                      className="progress-fill cyan"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="sub-grid">
            <div className="neon-card mini-stats">
              <div className="card-header">
                <Terminal size={16} className="text-glow-green" />
                <h3 className="mono">CORE_LATENCY</h3>
              </div>
              <div className="big-number mono">12ms</div>
            </div>
            <div className="neon-card mini-stats">
              <div className="card-header">
                <ShieldCheck size={16} className="text-glow-cyan" />
                <h3 className="mono">THREAT_LEVEL</h3>
              </div>
              <div className="big-number mono" style={{ color: 'var(--neon-red)' }}>ZERO</div>
            </div>
          </div>
        </div>

        <div className="side-column">
          <motion.div 
            className="neon-card gauge-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="gauge-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="gauge-bg" />
                <motion.circle 
                  cx="50" cy="50" r="45" 
                  className="gauge-path"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 0.72 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </svg>
              <div className="gauge-content">
                <span className="mono big-number">72</span>
                <span className="mono text-dim">QUOTA</span>
              </div>
            </div>
            <h3 className="mono text-center">SYNC_VELOCITY</h3>
          </motion.div>

          <div className="neon-card active-processes">
            <h3 className="mono">ACTIVE_THREADS</h3>
            <div className="process-list">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="process-item">
                  <Activity size={12} className="text-glow-cyan" />
                  <span className="mono text-dim">PROC_{i+425}</span>
                  <div className="process-sparkline"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .dashboard-view {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .system-status {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 1.5rem;
        }

        .operator-name {
          font-size: 4rem;
          line-height: 1;
          margin: 0.5rem 0 1.5rem;
          letter-spacing: -2px;
        }

        .metric-row {
          display: flex;
          gap: 2rem;
        }

        .metric-card {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .grid-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 2rem;
        }

        .main-column, .side-column {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .mission-control {
          min-height: 380px;
        }

        .card-header {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 2rem;
        }

        h2 { font-size: 1.25rem; }

        .focus-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .index-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .progress-container {
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill.cyan {
          height: 100%;
          background: var(--neon-cyan);
          box-shadow: 0 0 10px var(--neon-cyan-glow);
        }

        .sub-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .big-number {
          font-size: 2rem;
          font-weight: 700;
        }

        .gauge-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding: 2.5rem;
        }

        .gauge-circle {
          position: relative;
          width: 180px;
          height: 180px;
        }

        .gauge-bg {
          fill: none;
          stroke: rgba(255, 255, 255, 0.05);
          stroke-width: 8;
        }

        .gauge-path {
          fill: none;
          stroke: var(--neon-green);
          stroke-width: 8;
          stroke-linecap: round;
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
          filter: drop-shadow(0 0 5px var(--neon-green-glow));
        }

        .gauge-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .process-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }

        .process-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.75rem;
        }

        .process-sparkline {
          flex: 1;
          height: 2px;
          background: linear-gradient(90deg, var(--neon-cyan), transparent);
          opacity: 0.3;
        }

        .text-center { text-align: center; }
      `}</style>
    </div>
  );
}
