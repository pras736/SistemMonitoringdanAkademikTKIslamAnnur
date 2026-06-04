import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Icons } from '../../components/Icons';
import loginCollage from '../../assets/login_collage.png';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Replace with your actual login API endpoint
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        username,
        password,
      });

      const { token, role } = response.data;

      // Store token securely in production
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Navigate based on role from API
      if (role === 'admin') navigate('/admin');
      else if (role === 'orangtua') navigate('/orangtua');
      else navigate('/guru');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* Left Side: Image/Banner */}
        <div className="login-left-panel">
          <div className="login-image-container">
            <img src={loginCollage} alt="TK Islam Annur Activities" className="login-image" />
          </div>
          <div className="flex flex-col">
            <h2 className="login-title">SELAMAT DATANG DI<br />SISTEM AKADEMIK DAN MONITORING<br />TK ISLAM ANNUR PEKANBARU</h2>
            <p className="login-subtitle">Where every little seedling grows into a beautiful flower of knowledge.</p>

            <div className="login-features">
              <span className="login-feature-badge-primary"><Icons.Check /> Growth Mindset</span>
              <span className="login-feature-badge-danger"><Icons.Check /> Daily Star</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="login-right-panel">
          <div className="login-header">
            <h2 className="login-header-title">Welcome Back!</h2>
            <p className="login-header-subtitle">Please sign in to your academic portal.</p>
          </div>

          {error && (
            <div className="login-error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="login-form-group">
              <label className="login-label">Portal ID / Username</label>
              <div className="login-input-wrapper">
                <div className="login-input-icon"><Icons.User /></div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your ID or Username"
                  required
                  className="login-input"
                />
              </div>
            </div>

            <div className="login-form-group">
              <div className="login-label-row">
                <label className="login-label">Password</label>
                <a href="#" className="login-link">Forgot Password?</a>
              </div>
              <div className="login-input-wrapper">
                <div className="login-input-icon"><Icons.Lock /></div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="login-input"
                />
              </div>
            </div>

            <div className="login-checkbox-wrapper">
              <label className="login-checkbox-label">
                <input type="checkbox" className="login-checkbox" />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`login-submit-btn ${loading ? 'login-submit-btn-loading' : 'login-submit-btn-idle'}`}
            >
              {loading ? 'Signing in...' : (
                <>
                  Login <Icons.Check />
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="login-footer-text">New to KindyBloom? <a href="#" className="login-footer-link">Register now</a></p>
            <div className="login-footer-links">
              <a href="#" className="login-footer-sublink"><Icons.Help /> Help Center</a>
              <a href="#" className="login-footer-sublink"><Icons.Check /> Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
