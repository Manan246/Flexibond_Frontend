import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiUploadCloud, FiUsers, FiLogOut } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('flexibond_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('flexibond_token');
    localStorage.removeItem('flexibond_user');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Flexibond</h2>
        <p>Analytics</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiHome className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/salesperson" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiUsers className="nav-icon" />
          <span>Salesperson</span>
        </NavLink>
        <NavLink to="/upload" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiUploadCloud className="nav-icon" />
          <span>Data Upload</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</div>
          <div className="details">
            <span className="name">{user.username || 'User'}</span>
            <span className="role">{user.role || 'Admin'}</span>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
