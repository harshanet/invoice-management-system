import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          university: response.data.university || '',
          address: response.data.address || '',
        });
      } catch (error) {
        console.error('Profile fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setToast({ msg: 'Profile saved!', isError: false });
    } catch (error) {
      setToast({ msg: 'Failed to save.', isError: true });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = formData.name
    ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="toast" style={toast.isError ? {
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.2)',
          color: 'var(--red)'
        } : {}}>
          {toast.isError ? '⚠ ' : '✓ '}{toast.msg}
        </div>
      )}

      {/* Page title */}
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your account</p>
      </div>

      {/* Avatar card */}
      <div className="profile-header-card">
        <div className="profile-avatar">{initials}</div>
        <div>
          <div className="profile-name">{formData.name || 'Unknown User'}</div>
          <div className="profile-email">{formData.email}</div>
          {user?.role === 'admin' && (
            <div className="badge badge-amber" style={{ marginTop: 6 }}>Admin</div>
          )}
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSubmit} style={{ padding: '0 16px' }}>
        <p className="section-label" style={{ padding: 0, marginBottom: 12 }}>Account Details</p>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: 14 }}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              id="profile-name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              id="profile-email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
            />
          </div>
          <div className="input-group">
            <label className="input-label">University</label>
            <input
              id="profile-university"
              type="text"
              placeholder="e.g. QUT"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className="input"
            />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Address</label>
            <input
              id="profile-address"
              type="text"
              placeholder="Your address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input"
            />
          </div>
        </div>

        <button
          id="profile-save"
          type="submit"
          className="btn btn-primary btn-full"
          disabled={saving}
          style={{ marginBottom: 12, opacity: saving ? 0.7 : 1 }}
        >
          {saving ? (
            <>
              <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div>
              Saving...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Save Changes
            </>
          )}
        </button>

        <div className="divider"></div>

        <button
          type="button"
          className="btn btn-danger btn-full"
          onClick={handleLogout}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </form>
    </div>
  );
};

export default Profile;
