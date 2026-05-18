import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';

const StatCard = ({ label, value }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-5 flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
        </div>
        <div className="w-10 h-10 bg-gray-100 rounded-lg" />
    </div>
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats]         = useState(null);
    const [resources, setResources] = useState([]);
    const [deleteId, setDeleteId]   = useState(null);
    const [deleting, setDeleting]   = useState(false);

    const loadRecent = useCallback(() => {
        axiosInstance.get('/api/admin/resources/recent').then(r => setResources(r.data)).catch(() => {});
    }, []);

    useEffect(() => {
        axiosInstance.get('/api/admin/stats').then(r => setStats(r.data)).catch(() => {});
        loadRecent();
    }, [loadRecent]);

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await axiosInstance.delete(`/api/resources/${deleteId}`);
            setResources(prev => prev.filter(r => r._id !== deleteId));
        } catch {
            alert('Failed to delete resource.');
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    const fmt = (d) => new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Resources"  value={stats?.resources} />
                <StatCard label="Categories"       value={stats?.categories} />
                <StatCard label="Registered Users" value={stats?.users} />
                <StatCard label="Bookmarks"        value={stats?.bookmarks} />
            </div>

            {/* Recent resources table */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">Recent Resources</h2>
                    <button
                        onClick={() => navigate('/admin/resources/new')}
                        className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        + Add Resource
                    </button>
                </div>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                            <th className="px-5 py-3 text-left font-medium">Title</th>
                            <th className="px-5 py-3 text-left font-medium">Category</th>
                            <th className="px-5 py-3 text-left font-medium">Type</th>
                            <th className="px-5 py-3 text-left font-medium">Difficulty</th>
                            <th className="px-5 py-3 text-left font-medium">Added</th>
                            <th className="px-5 py-3 text-left font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resources.map((r) => (
                            <tr key={r._id} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="px-5 py-3 font-medium text-gray-800 max-w-xs truncate">{r.title}</td>
                                <td className="px-5 py-3 text-gray-600">{r.category || '—'}</td>
                                <td className="px-5 py-3 text-gray-600 capitalize">{r.type}</td>
                                <td className="px-5 py-3 text-gray-600 capitalize">{r.difficulty}</td>
                                <td className="px-5 py-3 text-gray-500">{fmt(r.createdAt)}</td>
                                <td className="px-5 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/resources/${r._id}/edit`)}
                                            className="text-xs border border-gray-300 rounded px-2.5 py-1 text-gray-600 hover:bg-gray-100"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(r._id)}
                                            className="text-xs border border-gray-300 rounded px-2.5 py-1 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {resources.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-5 py-8 text-center text-gray-400">No resources yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Quick actions */}
            <div>
                <h2 className="font-semibold text-gray-800 mb-3">Quick Actions</h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/admin/resources/new')}
                        className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                    >
                        + Add Resource
                    </button>
                    <button
                        onClick={() => navigate('/admin/categories/new')}
                        className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                    >
                        + Add Category
                    </button>
                    <button
                        disabled
                        className="border border-gray-300 text-sm font-medium px-5 py-2.5 rounded-lg text-gray-400 cursor-not-allowed"
                    >
                        ↓ Export CSV
                    </button>
                </div>
            </div>

            {/* Delete confirmation modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-80">
                        <h2 className="text-base font-semibold text-gray-900 mb-2">Delete resource?</h2>
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

export default AdminDashboard;
