import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import UserProfile from './UserProfile';
import Logout from '../auth/Logout';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/projects', label: 'Projects', icon: '📁' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
    // Add more menu items as needed
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>SoftAssist</h2>
      </div>
      
      <UserProfile />

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Logout />
      </div>
    </div>
  );
};

export default Sidebar; 