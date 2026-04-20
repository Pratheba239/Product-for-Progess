'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  Wallet, 
  ShoppingCart, 
  Tv, 
  Settings,
  User,
  Zap,
  FileText,
  LogOut,
  LogIn
} from 'lucide-react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/authConfig";

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { title: 'Home', href: '/', icon: LayoutDashboard },
    { title: 'Finance', href: '/finance', icon: Wallet },
    { title: 'Grocery', href: '/grocery', icon: ShoppingCart },
    { title: 'Work', href: '/work', icon: Briefcase },
    { title: 'Documents', href: '/documents', icon: FileText },
    { title: 'Media', href: '/entertainment', icon: Tv },
  ];

  const { instance, accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.error(e);
    });
  };

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
    });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-glow">
          <Zap size={24} className="text-glow-green" />
        </div>
        <span className="mono text-glow-green">PP_OS</span>
      </div>
      
      <nav className="nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <div className={`nav-item ${isActive ? 'active' : ''}`}>
                <Icon size={20} />
                {isActive && <div className="active-indicator" />}
                <span className="nav-tooltip mono">{item.title}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item">
          <Settings size={20} />
          <span className="nav-tooltip mono">Settings</span>
        </div>
        
        {isAuthenticated ? (
          <div className="nav-item" onClick={handleLogout}>
            <LogOut size={20} className="text-glow-red" />
            <span className="nav-tooltip mono">Logout</span>
          </div>
        ) : (
          <div className="nav-item" onClick={handleLogin}>
            <LogIn size={20} className="text-glow-cyan" />
            <span className="nav-tooltip mono">Login</span>
          </div>
        )}

        <div className="nav-item user-status">
          <div className={`status-dot ${isAuthenticated ? 'online' : 'offline'}`}></div>
          <User size={20} />
          <span className="nav-tooltip mono">{isAuthenticated ? accounts[0].username : 'Guest'}</span>
        </div>
      </div>

      <style jsx>{`
        .sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--bg-secondary);
          border-right: 1px solid rgba(57, 255, 20, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .sidebar-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 3rem;
        }

        .logo-glow {
          width: 45px;
          height: 45px;
          background: rgba(57, 255, 20, 0.05);
          border: 1px solid var(--neon-green);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          box-shadow: 0 0 10px var(--neon-green-glow);
        }

        .nav-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          flex: 1;
        }

        .nav-item {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .nav-item:hover {
          color: var(--neon-cyan);
          background: rgba(0, 240, 255, 0.05);
          box-shadow: inset 0 0 10px rgba(0, 240, 255, 0.1);
        }

        .nav-item.active {
          color: var(--neon-green);
          background: rgba(57, 255, 20, 0.05);
          border: 1px solid rgba(57, 255, 20, 0.2);
        }

        .active-indicator {
          position: absolute;
          left: -15px;
          width: 4px;
          height: 20px;
          background: var(--neon-green);
          box-shadow: 0 0 8px var(--neon-green-glow);
          border-radius: 0 2px 2px 0;
        }

        .nav-tooltip {
          position: absolute;
          left: 65px;
          background: var(--bg-accent);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
          white-space: nowrap;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-item:hover .nav-tooltip {
          opacity: 1;
        }

        .sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: auto;
          padding-bottom: 1rem;
        }

        .user-status {
          position: relative;
        }

        .status-dot {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          z-index: 10;
        }

        .status-dot.online {
          background: var(--neon-green);
          box-shadow: 0 0 5px var(--neon-green-glow);
        }

        .status-dot.offline {
          background: #ff3131;
          box-shadow: 0 0 5px rgba(255, 49, 49, 0.5);
        }

        .text-glow-red {
          color: #ff3131;
          filter: drop-shadow(0 0 5px rgba(255, 49, 49, 0.5));
        }

        .text-glow-cyan {
          color: var(--neon-cyan);
          filter: drop-shadow(0 0 5px var(--neon-cyan-glow));
        }

      `}</style>
    </div>
  );
};

export default Sidebar;
