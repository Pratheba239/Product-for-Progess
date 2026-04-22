'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';

interface QuadrantProps {
  id: string;
  title: string;
  glowColor: string;
  children?: React.ReactNode;
}

const Quadrant = ({ id, title, glowColor, children }: QuadrantProps) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div 
      ref={setNodeRef} 
      className={`quadrant-node glass-panel ${isOver ? 'target-active' : ''}`}
      style={{ '--glow-color': glowColor, '--glow-rgba': glowColor.replace('var(--', 'var(--rgba-') } as React.CSSProperties}
    >
      <div className="node-header">
        <div className="status-bit"></div>
        <h4 className="mono tracking-tighter text-[10px] opacity-70">{title}</h4>
      </div>
      
      <div className="node-grid-overlay"></div>
      
      <div className="task-sync-zone">
        {children}
      </div>

      <style jsx>{`
        .quadrant-node {
          flex: 1;
          min-height: 380px;
          border-radius: var(--border-radius);
          padding: 1.25rem;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .quadrant-node::before {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 4px; height: 100%;
          background: var(--glow-color);
          opacity: 0.3;
        }

        .quadrant-node.target-active {
          background: rgba(255, 255, 255, 0.03);
          border-color: var(--glow-color);
          box-shadow: 0 0 30px -10px var(--glow-color);
          transform: translateY(-2px);
        }

        .node-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 10;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.5rem;
        }

        .status-bit {
          width: 6px;
          height: 6px;
          background: var(--glow-color);
          box-shadow: 0 0 8px var(--glow-color);
        }

        .node-grid-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.02) 1px, transparent 0);
          background-size: 24px 24px;
          pointer-events: none;
        }

        .task-sync-zone {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          z-index: 10;
          min-height: 200px;
        }
      `}</style>
    </div>
  );
};

const EisenhowerMatrix = ({ childrenMap }: { childrenMap: Record<string, React.ReactNode> }) => {
  return (
    <div className="matrix-protocol">
      <div className="matrix-row">
        <Quadrant id="urgent_important" title="MISSION_CRITICAL" glowColor="var(--neon-red)">
          {childrenMap['urgent_important']}
        </Quadrant>
        <Quadrant id="not_urgent_important" title="STRATEGIC_RESERVE" glowColor="var(--neon-green)">
          {childrenMap['not_urgent_important']}
        </Quadrant>
      </div>
      <div className="matrix-row">
        <Quadrant id="urgent_not_important" title="OPERATIONAL_NOISE" glowColor="var(--neon-cyan)">
          {childrenMap['urgent_not_important']}
        </Quadrant>
        <Quadrant id="not_urgent_not_important" title="BACKGROUND_TASKS" glowColor="var(--text-dim)">
          {childrenMap['not_urgent_not_important']}
        </Quadrant>
      </div>

      <style jsx>{`
        .matrix-protocol {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }
        .matrix-row {
          display: flex;
          gap: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default EisenhowerMatrix;
