import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';

const AdminResources = () => {
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [search, setSearch]       = useState('');
    const [deleteId, setDeleteId]   = useState(null);
    const [deleting, setDeleting]   = useState(false);

    const load = useCallback(() => {
        const q = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
        axiosInstance.get(`/api/admin/resources${q}`).then(r => setResources(r.data)).catch(() => {});
    }, [search]);

    useEffect(() => { load(); }, [load]);

    const fmt = (d) => new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });

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

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
                <button
                    onClick={() => navigate('/admin/resources/new')}
                    className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                    + Add Resource
                </button>
            </div>

            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by title or category..."
                    className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-50"
                />
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
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
                                <td colSpan={6} className="px-5 py-8 text-center text-gray-400">No resources found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
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

export default AdminResources;
