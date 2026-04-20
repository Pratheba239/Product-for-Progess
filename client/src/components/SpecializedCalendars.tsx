'use client';

import React, { useState } from 'react';
import { Heart, Smile, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const SpecializedCalendars = () => {
  const [moods, setMoods] = useState([
    { emotion: 'Joyful', color: 'var(--neon-cyan)' },
    { emotion: 'Productive', color: 'var(--neon-green)' },
  ]);

  return (
    <div className="specialized-containers">
      <section className="neon-card">
        <div className="card-header">
          <Heart size={18} className="text-glow-red" />
          <h3 className="mono text-glow-red">BIOMETREC_SYNC</h3>
        </div>
        <div className="sync-info">
          <div className="status-row">
            <span className="mono text-dim">CYCLE_DAY:</span>
            <span className="mono">12</span>
          </div>
          <div className="neon-progress-bar">
            <motion.div 
              className="progress-fill red" 
              initial={{ width: 0 }}
              animate={{ width: '40%' }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="mono phase-text">PHASE: <span className="text-glow-red">FOLLICULAR</span></p>
        </div>
      </section>

      <section className="neon-card">
        <div className="card-header">
          <Smile size={18} className="text-glow-amber" />
          <h3 className="mono text-glow-amber">EMOTIONAL_ARCHIAL</h3>
        </div>
        <div className="mood-log">
          <div className="mood-dots">
            {moods.map((m, i) => (
              <div 
                key={i} 
                className="mood-node" 
                style={{ background: m.color, boxShadow: `0 0 10px ${m.color}` }} 
                title={m.emotion}
              ></div>
            ))}
            <button className="add-node-btn">
              <Plus size={14} />
            </button>
          </div>
          <p className="mono today-log">LOG: <span className="text-dim">PEACEFUL, PRODUCTIVE</span></p>
        </div>
      </section>

      <style jsx>{`
        .specialized-containers {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-top: 1rem;
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 1.25rem;
        }

        h3 { 
          font-size: 0.85rem; 
          margin-bottom: 0; 
          font-weight: 700;
        }

        .sync-info .status-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .neon-progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .progress-fill.red {
          height: 100%;
          background: var(--neon-red);
          box-shadow: 0 0 10px var(--neon-red-glow);
        }

        .phase-text {
          font-size: 0.7rem;
        }

        .mood-dots {
          display: flex;
          gap: 10px;
          margin-bottom: 1rem;
          align-items: center;
        }

        .mood-node {
          width: 20px;
          height: 20px;
          border-radius: 2px;
        }

        .add-node-btn {
          width: 20px;
          height: 20px;
          border-radius: 2px;
          border: 1px dashed var(--text-dim);
          background: none;
          color: var(--text-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-node-btn:hover {
          border-color: var(--neon-amber);
          color: var(--neon-amber);
        }

        .today-log {
          font-size: 0.7rem;
        }
      `}</style>
    </div>
  );
};

export default SpecializedCalendars;
