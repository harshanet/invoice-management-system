import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axiosInstance.post('/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-logo-area">
        <div className="auth-logo-icon">🚗</div>
        <div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join ParkEase in seconds</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-form-card">
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '13px',
              color: '#ef4444',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Full name</label>
            <input
              id="register-name"
              type="text"
              required
              placeholder="Kevin Naderian"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email address</label>
            <input
              id="register-email"
              type="email"
              required
              placeholder="you@university.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Password</label>
            <input
              id="register-password"
              type="password"
              required
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input"
            />
          </div>
        </div>

        <button
          id="register-submit"
          type="submit"
          className="btn btn-primary btn-full"
          disabled={loading}
          style={{ marginBottom: '16px', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? (
            <>
              <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div>
              Creating account...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              Create Account
            </>
          )}
        </button>

        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>

        <p style={{ marginTop: '12px' }}>
          <Link to="/login">
            <button type="button" className="btn btn-secondary btn-full">
              Sign In Instead
            </button>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
