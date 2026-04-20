'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Clock, Calendar as CalIcon, Bell, ShieldAlert } from 'lucide-react';
import SpecializedCalendars from './SpecializedCalendars';
import { motion } from 'framer-motion';

const CalendarPanel = () => {
  const [date, setDate] = useState<Date | null>(new Date());

  const upcomingEvents = [
    { title: 'Project Deadline', time: 'TODAY_17:00', type: 'deadline', icon: Clock },
    { title: 'Client Sync', time: 'TOMORROW_10:00', type: 'meeting', icon: CalIcon },
    { title: 'Neural Sync Failed', time: 'ACTION_REQUIRED', type: 'alert', icon: ShieldAlert },
  ];

  return (
    <div className="calendar-sidebar">
      <div className="temporal-header">
        <h2 className="mono text-glow-cyan">TEMPORAL_MAPPING</h2>
        <div className="status-indicator">
          <div className="pulse-dot"></div>
          <span className="mono text-dim">LIVE_SYNC</span>
        </div>
      </div>

      <div className="calendar-wrapper">
        <Calendar 
          onChange={(val) => setDate(val as Date)} 
          value={date}
          className="neon-cyber-calendar"
        />
      </div>

      <div className="chrono-queue">
        <h3 className="mono section-title">CHRONO_QUEUE</h3>
        <div className="event-stack">
          {upcomingEvents.map((event, i) => {
            const Icon = event.icon;
            return (
              <motion.div 
                key={i} 
                className={`event-card ${event.type}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <div className="event-icon-box">
                  <Icon size={16} />
                </div>
                <div className="event-content">
                  <p className="mono event-title">{event.title}</p>
                  <p className="mono event-time text-dim">{event.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="biometric-monitoring">
        <h3 className="mono section-title">BIOMETRIC_MONITORING</h3>
        <SpecializedCalendars />
      </div>

      <style jsx global>{`
        .neon-cyber-calendar {
          width: 100% !important;
          border: 1px solid rgba(0, 240, 255, 0.1) !important;
          background: var(--bg-secondary) !important;
          color: var(--text-primary) !important;
          font-family: 'JetBrains Mono', monospace !important;
          border-radius: 4px !important;
          padding: 10px !important;
          font-size: 0.75rem !important;
        }
        .react-calendar__tile {
          color: var(--text-secondary) !important;
        }
        .react-calendar__tile--now {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid var(--text-dim) !important;
        }
        .react-calendar__tile--active {
          background: var(--neon-cyan) !important;
          color: var(--bg-primary) !important;
          box-shadow: 0 0 10px var(--neon-cyan-glow) !important;
          border-radius: 4px !important;
        }
        .react-calendar__navigation button {
          color: var(--neon-cyan) !important;
        }
        .react-calendar__navigation button:enabled:hover {
          background: rgba(0, 240, 255, 0.05) !important;
        }
        .react-calendar__month-view__weekdays__weekday {
          color: var(--text-dim) !important;
          text-decoration: none !important;
        }
      `}</style>
      
      <style jsx>{`
        .calendar-sidebar {
          width: var(--panel-right-width);
          height: 100vh;
          background: var(--bg-secondary);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          position: sticky;
          top: 0;
          overflow-y: auto;
          border-left: 1px solid rgba(255, 255, 255, 0.05);
        }

        .temporal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        h2 { font-size: 0.9rem; margin: 0; }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.65rem;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          background: var(--neon-green);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(57, 255, 20, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(57, 255, 20, 0); }
          100% { box-shadow: 0 0 0 0 rgba(57, 255, 20, 0); }
        }

        .section-title {
          font-size: 0.75rem;
          margin-bottom: 1rem;
          color: var(--text-dim);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.5rem;
        }

        .event-stack {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .event-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: var(--bg-accent);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 4px;
        }

        .event-card.deadline { border-left: 3px solid var(--neon-cyan); }
        .event-card.meeting { border-left: 3px solid var(--neon-amber); }
        .event-card.alert { border-left: 3px solid var(--neon-red); color: var(--neon-red); }

        .event-icon-box {
          color: inherit;
          opacity: 0.8;
        }

        .event-title { font-size: 0.8rem; font-weight: 500; }
        .event-time { font-size: 0.65rem; }
      `}</style>
    </div>
  );
};

export default CalendarPanel;
