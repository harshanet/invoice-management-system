import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Banner = ({ kind, children }) =>
  children ? (
    <div
      className={`mb-5 rounded-xl px-4 py-3 text-sm ${
        kind === 'error'
          ? 'bg-red-50 text-red-700 border border-red-200'
          : 'bg-green-50 text-green-700 border border-green-200'
      }`}
    >
      {children}
    </div>
  ) : null;

const inputClass =
  'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:opacity-60';
const labelClass = 'text-sm font-medium text-gray-700 block mb-1.5';
const primaryBtn =
  'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50';

const Card = ({ title, subtitle, children }) => (
  <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
    <h2 className="font-semibold text-gray-900">{title}</h2>
    {subtitle && <p className="text-sm text-gray-500 mt-0.5 mb-5">{subtitle}</p>}
    {children}
  </section>
);

const Settings = () => {
  const { user, login } = useAuth();

  const [account, setAccount] = useState({ name: '', email: '', university: '', address: '' });
  const [accountMsg, setAccountMsg] = useState(null);
  const [savingAccount, setSavingAccount] = useState(false);
  const [loading, setLoading] = useState(true);

  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState(null);
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    axiosInstance
      .get('/api/auth/profile')
      .then((r) =>
        setAccount({
          name: r.data.name || '',
          email: r.data.email || '',
          university: r.data.university || '',
          address: r.data.address || '',
        })
      )
      .catch(() => setAccountMsg({ kind: 'error', text: 'Could not load your profile.' }))
      .finally(() => setLoading(false));
  }, []);

  const saveAccount = async (e) => {
    e.preventDefault();
    setSavingAccount(true);
    setAccountMsg(null);
    try {
      const { data } = await axiosInstance.put('/api/auth/profile', account);
      // Keep the logged-in session (avatar/name) in sync; preserve role + token.
      login({ ...user, name: data.name, email: data.email, role: data.role ?? user.role, token: data.token ?? user.token });
      setAccountMsg({ kind: 'success', text: 'Profile saved.' });
    } catch (err) {
      setAccountMsg({ kind: 'error', text: err.response?.data?.message || 'Failed to save profile.' });
    } finally {
      setSavingAccount(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    if (pw.newPassword.length < 6) {
      setPwMsg({ kind: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (pw.newPassword !== pw.confirm) {
      setPwMsg({ kind: 'error', text: 'New password and confirmation do not match.' });
      return;
    }
    setSavingPw(true);
    try {
      await axiosInstance.put('/api/auth/profile', {
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      });
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
      setPwMsg({ kind: 'success', text: 'Password updated.' });
    } catch (err) {
      setPwMsg({ kind: 'error', text: err.response?.data?.message || 'Failed to update password.' });
    } finally {
      setSavingPw(false);
    }
  };

  const initial = user?.name?.[0]?.toUpperCase() ?? 'U';

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
      <p className="text-sm text-gray-500 mb-8">Manage your account and security preferences.</p>

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : (
        <>
          {/* Identity header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              {initial}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{account.name || 'Your account'}</p>
              <p className="text-sm text-gray-500">{account.email}</p>
            </div>
            {user?.role === 'admin' && (
              <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                Administrator
              </span>
            )}
          </div>

          {/* Profile */}
          <Card title="Profile" subtitle="Update your personal details.">
            <Banner kind={accountMsg?.kind}>{accountMsg?.text}</Banner>
            <form onSubmit={saveAccount} className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Name</label>
                <input className={inputClass} value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} placeholder="Your name" />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input className={inputClass} type="email" value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} placeholder="you@example.com" />
              </div>
              <div>
                <label className={labelClass}>University</label>
                <input className={inputClass} value={account.university} onChange={(e) => setAccount({ ...account, university: e.target.value })} placeholder="e.g. QUT" />
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <input className={inputClass} value={account.address} onChange={(e) => setAccount({ ...account, address: e.target.value })} placeholder="City / address" />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" disabled={savingAccount} className={primaryBtn}>
                  {savingAccount ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </Card>

          {/* Security */}
          <Card title="Security" subtitle="Change your password. You'll need your current password to confirm.">
            <Banner kind={pwMsg?.kind}>{pwMsg?.text}</Banner>
            <form onSubmit={savePassword} className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2 sm:max-w-xs">
                <label className={labelClass}>Current password</label>
                <input className={inputClass} type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} placeholder="••••••••" />
              </div>
              <div>
                <label className={labelClass}>New password</label>
                <input className={inputClass} type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} placeholder="At least 6 characters" />
              </div>
              <div>
                <label className={labelClass}>Confirm new password</label>
                <input className={inputClass} type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} placeholder="Re-enter new password" />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" disabled={savingPw} className={primaryBtn}>
                  {savingPw ? 'Updating…' : 'Update password'}
                </button>
              </div>
            </form>
          </Card>
        </>
      )}
    </div>
  );
};

export default Settings;
