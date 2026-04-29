import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiTrash2, FiShield, FiCheckSquare, FiSquare, FiEdit2, FiEye, FiEyeOff } from 'react-icons/fi';
import { adminGetUsers, adminCreateUser, adminDeleteUser, adminUpdateUser } from '../services/api';
import { toast } from 'react-toastify';
import NotificationPanel from '../components/NotificationPanel';

const AdminPanel = () => {
  const user = JSON.parse(localStorage.getItem('flexibond_user') || '{}');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit mode tracking
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  // User form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('viewer');
  const [permissions, setPermissions] = useState(['overview', 'products', 'salesperson', 'comparison', 'upload']);

  const availableModules = [
    { id: 'overview', label: 'Dashboard Overview' },
    { id: 'products', label: 'Product Analytics' },
    { id: 'salesperson', label: 'Salesperson Performance' },
    { id: 'comparison', label: 'Salesperson Comparison' },
    { id: 'upload', label: 'Data Upload Area' },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminGetUsers();
      if (res.data && res.data.users) {
        setUsers(res.data.users);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error loading users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTogglePerm = (modId) => {
    if (permissions.includes(modId)) {
      setPermissions(permissions.filter(p => p !== modId));
    } else {
      setPermissions([...permissions, modId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      return toast.warning('Please enter a username');
    }
    if (!isEditMode && !password) {
      return toast.warning('Please enter a password');
    }
    if (password && password !== confirmPassword) {
      return toast.warning('Passwords do not match!');
    }

    try {
      if (isEditMode) {
        await adminUpdateUser(editingUserId, { role, permissions, password: password.trim() ? password : undefined });
        toast.success('User updated successfully');
      } else {
        await adminCreateUser({ username, password, role, permissions });
        toast.success('User created successfully');
      }
      
      // Reset State
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setRole('viewer');
      setPermissions(['overview', 'products', 'salesperson', 'comparison', 'upload']);
      setIsEditMode(false);
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save user');
    }
  };

  const handleEditClick = (userObj) => {
    setIsEditMode(true);
    setEditingUserId(userObj._id);
    setUsername(userObj.username);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setRole(userObj.role);
    setPermissions(userObj.permissions || []);
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setEditingUserId(null);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setRole('viewer');
    setPermissions(['overview', 'products', 'salesperson', 'comparison', 'upload']);
  };

  const handleDeleteUser = async (userId) => {
    if (userId === user._id) {
      toast.error('You cannot delete your own admin account while logged in.');
      return;
    }
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    try {
      await adminDeleteUser(userId);
      toast.success('User removed');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>User Management</h1>
          <p>Create credentials and grant permissions strictly for analytics modules</p>
        </div>
        {user.role === 'admin' && <NotificationPanel />}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '20px' }}>
        
        {/* Create / Edit User Card */}
        <div className="chart-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-600)', margin: 0 }}>
              {isEditMode ? <FiEdit2 /> : <FiUserPlus />} {isEditMode ? 'Edit Portal User' : 'Add New User'}
            </h3>
            {isEditMode && (
              <button 
                type="button" 
                onClick={cancelEdit}
                style={{ background: 'var(--primary-100)', color: 'var(--primary-600)', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <FiUserPlus /> Switch to Create Form
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isEditMode}
                placeholder="e.g. jignesh_view"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: isEditMode ? 'var(--bg-light)' : '#fff' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  {isEditMode ? 'New Password' : 'Password'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isEditMode ? 'Leave blank' : 'Enter password'}
                    style={{ width: '100%', padding: '10px 12px', paddingRight: '40px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                  />
                  <span 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    style={{ width: '100%', padding: '10px 12px', paddingRight: '40px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                  />
                  <span 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>System Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#fff', outline: 'none' }}
              >
                <option value="viewer">Viewer (Restricted)</option>
                <option value="admin">Administrator (Full access)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button 
                type="submit" 
                style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                {isEditMode ? <FiEdit2 /> : <FiUserPlus />} {isEditMode ? 'Update User' : 'Save User'}
              </button>
              {isEditMode && (
                <button 
                  type="button"
                  onClick={cancelEdit}
                  style={{ padding: '12px 16px', background: 'var(--bg-light)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {role === 'viewer' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Module Access Permissions</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', background: 'var(--bg-light)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  {availableModules.map(mod => (
                    <div 
                      key={mod.id} 
                      onClick={() => handleTogglePerm(mod.id)} 
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      {permissions.includes(mod.id) ? (
                        <FiCheckSquare color="var(--primary-600)" size={16} />
                      ) : (
                        <FiSquare color="var(--text-muted)" size={16} />
                      )}
                      <span>{mod.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Existing Users List */}
        <div className="chart-card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-600)' }}>
            <FiShield /> Configured Portal Users
          </h3>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>Loading portal users...</p>
          ) : users.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>No alternative users registered yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {users.map(u => (
                <div 
                  key={u._id} 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'var(--bg-light)', borderRadius: '10px', border: '1px solid var(--border-color)' }}
                >
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{u.username}</span>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', background: u.role === 'admin' ? '#fee2e2' : '#dbeafe', color: u.role === 'admin' ? '#ef4444' : '#2563eb', fontWeight: 600 }}>{u.role}</span>
                      {u.role === 'viewer' && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Perms: {(u.permissions || []).join(', ') || 'None'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleEditClick(u)}
                      style={{ padding: '8px', background: 'transparent', border: 'none', color: 'var(--primary-600)', cursor: 'pointer', borderRadius: '6px' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-light)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <FiEdit2 size={16} />
                    </button>
                    {u.username !== 'flexibond' && u._id !== user._id && (
                      <button 
                        onClick={() => handleDeleteUser(u._id)}
                        style={{ padding: '8px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', borderRadius: '6px' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
