import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axiosConfig';

const Banner = ({ kind, children }) =>
    children ? (
        <div
            className={`mb-4 rounded-lg px-4 py-2.5 text-sm ${
                kind === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
            }`}
        >
            {children}
        </div>
    ) : null;

const Field = ({ label, ...props }) => (
    <label className="block">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <input
            {...props}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 disabled:bg-gray-50"
        />
    </label>
);

const StatTile = ({ label, value }) => (
    <div className="rounded-lg border border-gray-200 p-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
        <p className="mt-1 text-xl font-bold text-gray-900">{value ?? '—'}</p>
    </div>
);

const AdminSettings = () => {
    const { user, login } = useAuth();

    const [account, setAccount] = useState({ name: '', email: '', university: '', address: '' });
    const [accountMsg, setAccountMsg] = useState(null); // { kind, text }
    const [savingAccount, setSavingAccount] = useState(false);

    const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
    const [pwMsg, setPwMsg] = useState(null);
    const [savingPw, setSavingPw] = useState(false);

    const [stats, setStats] = useState(null);

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
            .catch(() => setAccountMsg({ kind: 'error', text: 'Could not load your profile.' }));

        axiosInstance.get('/api/admin/stats').then((r) => setStats(r.data)).catch(() => {});
    }, []);

    const saveAccount = async (e) => {
        e.preventDefault();
        setSavingAccount(true);
        setAccountMsg(null);
        try {
            const { data } = await axiosInstance.put('/api/auth/profile', account);
            // Keep the logged-in session in sync (preserve role/token fallbacks).
            login({ ...user, name: data.name, email: data.email, role: data.role ?? user.role, token: data.token ?? user.token });
            setAccountMsg({ kind: 'success', text: 'Account details saved.' });
        } catch (err) {
            setAccountMsg({ kind: 'error', text: err.response?.data?.message || 'Failed to save account details.' });
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

    return (
        <div className="max-w-3xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

            {/* Account details */}
            <section className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="font-semibold text-gray-800 mb-1">Account</h2>
                <p className="text-sm text-gray-500 mb-4">Update your administrator profile details.</p>
                <Banner kind={accountMsg?.kind}>{accountMsg?.text}</Banner>
                <form onSubmit={saveAccount} className="grid grid-cols-2 gap-4">
                    <Field label="Name" value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} />
                    <Field label="Email" type="email" value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} />
                    <Field label="University" value={account.university} onChange={(e) => setAccount({ ...account, university: e.target.value })} />
                    <Field label="Address" value={account.address} onChange={(e) => setAccount({ ...account, address: e.target.value })} />
                    <div className="col-span-2">
                        <button
                            type="submit"
                            disabled={savingAccount}
                            className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {savingAccount ? 'Saving…' : 'Save changes'}
                        </button>
                    </div>
                </form>
            </section>

            {/* Change password */}
            <section className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="font-semibold text-gray-800 mb-1">Security</h2>
                <p className="text-sm text-gray-500 mb-4">Change your password. You'll need your current password to confirm.</p>
                <Banner kind={pwMsg?.kind}>{pwMsg?.text}</Banner>
                <form onSubmit={savePassword} className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 max-w-sm">
                        <Field label="Current password" type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
                    </div>
                    <Field label="New password" type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
                    <Field label="Confirm new password" type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
                    <div className="col-span-2">
                        <button
                            type="submit"
                            disabled={savingPw}
                            className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {savingPw ? 'Updating…' : 'Update password'}
                        </button>
                    </div>
                </form>
            </section>

            {/* Platform overview */}
            <section className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-800 mb-1">Platform overview</h2>
                <p className="text-sm text-gray-500 mb-4">A read-only snapshot of the current library.</p>
                <div className="grid grid-cols-4 gap-4">
                    <StatTile label="Resources" value={stats?.resources} />
                    <StatTile label="Categories" value={stats?.categories} />
                    <StatTile label="Users" value={stats?.users} />
                    <StatTile label="Bookmarks" value={stats?.bookmarks} />
                </div>
            </section>
        </div>
    );
};

export default AdminSettings;
