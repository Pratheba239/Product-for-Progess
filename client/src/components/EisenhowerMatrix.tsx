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
      className={`quadrant-node ${isOver ? 'target-active' : ''}`}
      style={{ '--glow-color': glowColor } as React.CSSProperties}
    >
      <div className="node-header">
        <div className="status-bit"></div>
        <h4 className="mono">{title}</h4>
      </div>
      
      <div className="node-grid-overlay"></div>
      
      <div className="task-sync-zone">
        {children}
      </div>

      <style jsx>{`
        .quadrant-node {
          flex: 1;
          min-height: 320px;
          background: rgba(18, 18, 18, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .quadrant-node.target-active {
          background: rgba(var(--glow-color), 0.05);
          border-color: var(--glow-color);
          box-shadow: inset 0 0 20px rgba(var(--glow-color), 0.1);
          transform: scale(1.01);
        }

        .node-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 10;
        }

        .status-bit {
          width: 8px;
          height: 8px;
          background: var(--glow-color);
          box-shadow: 0 0 8px var(--glow-color);
          border-radius: 1px;
        }

        h4 {
          font-size: 0.75rem;
          color: var(--text-dim);
          letter-spacing: 0.1em;
        }

        .node-grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
        }

        .task-sync-zone {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          z-index: 10;
          min-height: 100%;
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
