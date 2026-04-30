import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('flexibond_token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }

    try {
      setLoading(true);
      const res = await login(username, password);
      
      if (res.data.success) {
        localStorage.setItem('flexibond_token', res.data.token);
        localStorage.setItem('flexibond_user', JSON.stringify(res.data.user));
        toast.success('Login successful!');
        
        const user = res.data.user;
        let defaultRoute = '/dashboard';
        
        if (user.role === 'viewer') {
          const perms = user.permissions || [];
          if (perms.includes('overview')) defaultRoute = '/dashboard';
          else if (perms.includes('products')) defaultRoute = '/products';
          else if (perms.includes('salesperson')) defaultRoute = '/salesperson';
          else if (perms.includes('comparison')) defaultRoute = '/comparison';
          else if (perms.includes('financials')) defaultRoute = '/financial';
          else if (perms.includes('channel')) defaultRoute = '/channel';
          else if (perms.includes('upload')) defaultRoute = '/upload';
          else defaultRoute = '/no-access';
        }
        
        navigate(defaultRoute);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-section">
          <h1>Flexibond</h1>
          <p>Analytics Dashboard</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
            />
          </div>
          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0
                }}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
