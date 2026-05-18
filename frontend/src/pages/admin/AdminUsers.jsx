import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axiosConfig';

const RoleBadge = ({ role }) => (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
        role === 'admin'
            ? 'bg-indigo-100 text-indigo-700'
            : 'bg-gray-100 text-gray-600'
    }`}>
        {role}
    </span>
);

const AdminUsers = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers]       = useState([]);
    const [search, setSearch]     = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [togglingId, setTogglingId] = useState(null);

    const load = useCallback(() => {
        const q = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
        axiosInstance.get(`/api/admin/users${q}`).then(r => setUsers(r.data)).catch(() => {});
    }, [search]);

    useEffect(() => { load(); }, [load]);

    const fmt = (d) => d
        ? new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—';

    const toggleRole = async (u) => {
        setTogglingId(u._id);
        const newRole = u.role === 'admin' ? 'user' : 'admin';
        try {
            const { data } = await axiosInstance.put(`/api/admin/users/${u._id}/role`, { role: newRole });
            setUsers(prev => prev.map(x => x._id === u._id ? { ...x, role: data.role } : x));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update role.');
        } finally {
            setTogglingId(null);
        }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await axiosInstance.delete(`/api/admin/users/${deleteId}`);
            setUsers(prev => prev.filter(u => u._id !== deleteId));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user.');
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    const initial = (name) => (name?.[0] ?? '?').toUpperCase();

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                <span className="text-sm text-gray-500">{users.length} registered</span>
            </div>

            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-50"
                />
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                            <th className="px-5 py-3 text-left font-medium">User</th>
                            <th className="px-5 py-3 text-left font-medium">Email</th>
                            <th className="px-5 py-3 text-left font-medium">Role</th>
                            <th className="px-5 py-3 text-left font-medium">Joined</th>
                            <th className="px-5 py-3 text-left font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                            {initial(u.name)}
                                        </div>
                                        <span className="font-medium text-gray-800">{u.name}</span>
                                        {u._id === currentUser?._id || u.email === currentUser?.email
                                            ? <span className="text-xs text-gray-400">(you)</span>
                                            : null}
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-gray-600">{u.email}</td>
                                <td className="px-5 py-3"><RoleBadge role={u.role} /></td>
                                <td className="px-5 py-3 text-gray-500">{fmt(u.createdAt)}</td>
                                <td className="px-5 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => toggleRole(u)}
                                            disabled={togglingId === u._id || u.email === currentUser?.email}
                                            className="text-xs border border-gray-300 rounded px-2.5 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            {togglingId === u._id
                                                ? '...'
                                                : u.role === 'admin' ? 'Make User' : 'Make Admin'}
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(u._id)}
                                            disabled={u.email === currentUser?.email}
                                            className="text-xs border border-gray-300 rounded px-2.5 py-1 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-5 py-8 text-center text-gray-400">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete confirmation modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-80">
                        <h2 className="text-base font-semibold text-gray-900 mb-2">Delete user?</h2>
                        <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="text-sm border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
