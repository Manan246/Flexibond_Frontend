import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiUploadCloud, FiUsers, FiLogOut, FiBox, FiBarChart2 } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('flexibond_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('flexibond_token');
    localStorage.removeItem('flexibond_user');
    if (onClose) onClose();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>Flexibond</h2>
        <p>Analytics</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiHome className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/products" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiBox className="nav-icon" />
          <span>Products</span>
        </NavLink>
        <NavLink to="/salesperson" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiUsers className="nav-icon" />
          <span>Salesperson</span>
        </NavLink>
        <NavLink to="/comparison" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiBarChart2 className="nav-icon" />
          <span>Comparison</span>
        </NavLink>
        <NavLink to="/upload" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
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
