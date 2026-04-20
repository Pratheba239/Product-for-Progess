'use client';

import React from 'react';
import { Book, Film, Users, Coffee, BookOpen, ArrowRight, Play, Database, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const EntertainmentPage = () => {
  const activities = [
    { id: 1, title: 'THE_MIDNIGHT_LIBRARY', type: 'Book', detail: 'MATT_HAIG', icon: Book, color: 'var(--neon-cyan)' },
    { id: 2, title: 'INCEPTION_CORE', type: 'Movie', detail: 'SCI_FI_INTEL', icon: Film, color: 'var(--neon-green)' },
    { id: 3, title: 'NEURAL_NETWORK_MEETUP', type: 'Meetup', detail: 'SOCIAL_SYNC', icon: Users, color: 'var(--neon-amber)' },
    { id: 4, title: 'STIMULANT_REFILL', type: 'Coffee', detail: 'CYBER_CAFE', icon: Coffee, color: 'var(--text-dim)' },
    { id: 5, title: 'SYNTHETIC_CRAVINGS', type: 'Recipe', detail: 'NUTRITION_GEN', icon: BookOpen, color: 'var(--neon-red)' },
  ];

  return (
    <div className="media-vault">
      <header className="page-header">
        <h1 className="mono">MEDIA_VAULT_DECRYPTION</h1>
        <p className="mono text-dim">CURATED_EXPERIENCES_DATA_STREAM</p>
      </header>

      <div className="archive-grid">
        {activities.map((activity, i) => {
          const Icon = activity.icon;
          return (
            <motion.div 
              key={activity.id} 
              className="neon-card activity-node"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="node-top">
                <div className="type-badge mono" style={{ color: activity.color, borderColor: activity.color }}>
                  {activity.type}
                </div>
                <div className="node-icon" style={{ color: activity.color }}>
                  <Icon size={20} />
                </div>
              </div>

              <div className="node-body">
                <h3 className="mono">{activity.title}</h3>
                <p className="mono text-dim detail-text">{activity.detail}</p>
              </div>

              <div className="node-action">
                <Play size={14} />
                <span className="mono">ACCESS_DATA</span>
              </div>
            </motion.div>
          );
        })}

        <div className="neon-card add-node dotted">
          <Plus size={32} className="text-dim" />
          <p className="mono text-dim">INITIALIZE_NEW_ENTRY</p>
        </div>
      </div>

      <style jsx>{`
        .media-vault {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .page-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 1.5rem;
        }

        .archive-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .activity-node {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          min-height: 220px;
          cursor: pointer;
        }

        .node-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .type-badge {
          font-size: 0.6rem;
          padding: 2px 6px;
          border-radius: 2px;
          border: 1px solid currentColor;
          letter-spacing: 0.1em;
        }

        .node-body h3 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          letter-spacing: 0;
        }

        .detail-text {
          font-size: 0.7rem;
        }

        .node-action {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.65rem;
          color: var(--text-dim);
          transition: color 0.2s;
        }

        .activity-node:hover .node-action {
          color: var(--neon-cyan);
        }

        .dotted {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          background: transparent;
          cursor: pointer;
        }

        .dotted:hover {
          background: rgba(255, 255, 255, 0.02);
          border-color: var(--neon-cyan);
        }

        .dotted p { font-size: 0.7rem; }
      `}</style>
    </div>
  );
};

export default EntertainmentPage;
