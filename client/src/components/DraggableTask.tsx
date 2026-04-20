'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Clock } from 'lucide-react';

interface DraggableTaskProps {
  id: string;
  title: string;
  deadline?: string;
}

const DraggableTask = ({ id, title, deadline }: DraggableTaskProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="draggable-task-node"
      {...attributes}
    >
      <div className="drag-handle" {...listeners}>
        <GripVertical size={14} />
      </div>
      <div className="task-info">
        <p className="mono task-title">{title}</p>
        {deadline && (
          <div className="task-deadline mono text-dim">
            <Clock size={10} />
            {deadline}
          </div>
        )}
      </div>

      <style jsx>{`
        .draggable-task-node {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--bg-accent);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          cursor: default;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .draggable-task-node:hover {
          border-color: rgba(0, 240, 255, 0.2);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .drag-handle {
          cursor: grab;
          color: var(--text-dim);
          display: flex;
          align-items: center;
          padding: 4px;
        }

        .drag-handle:active {
          cursor: grabbing;
        }

        .task-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .task-title {
          font-size: 0.8rem;
          color: var(--text-primary);
        }

        .task-deadline {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.65rem;
        }
      `}</style>
    </div>
  );
};

export default DraggableTask;
