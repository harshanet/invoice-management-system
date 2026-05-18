import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../axiosConfig';

const EMPTY_FORM = { name: '', description: '' };

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [search, setSearch]         = useState('');
    const [form, setForm]             = useState(EMPTY_FORM);
    const [editId, setEditId]         = useState(null);
    const [formError, setFormError]   = useState('');
    const [saving, setSaving]         = useState(false);
    const [deleteId, setDeleteId]     = useState(null);
    const [deleting, setDeleting]     = useState(false);

    const load = useCallback(() => {
        axiosInstance.get('/api/admin/categories').then(r => setCategories(r.data)).catch(() => {});
    }, []);

    useEffect(() => { load(); }, [load]);

    const filtered = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const handle = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const startEdit = (cat) => {
        setEditId(cat._id);
        setForm({ name: cat.name, description: cat.description || '' });
        setFormError('');
    };

    const cancelForm = () => {
        setEditId(null);
        setForm(EMPTY_FORM);
        setFormError('');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return setFormError('Category name is required.');
        setSaving(true);
        setFormError('');
        try {
            if (editId) {
                const { data } = await axiosInstance.put(`/api/categories/${editId}`, form);
                setCategories(prev => prev.map(c => c._id === editId ? { ...c, ...data } : c));
            } else {
                await axiosInstance.post('/api/categories', form);
                load();
            }
            cancelForm();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to save category.');
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await axiosInstance.delete(`/api/categories/${deleteId}`);
            setCategories(prev => prev.filter(c => c._id !== deleteId));
            if (editId === deleteId) cancelForm();
        } catch {
            alert('Failed to delete category.');
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white";

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
                <button
                    onClick={cancelForm}
                    className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                    + Add Category
                </button>
            </div>

            <div className="flex gap-5 items-start">
                {/* Left — category list */}
                <div className="flex-1 bg-white rounded-lg border border-gray-200">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800 mb-3">
                            All Categories ({categories.length})
                        </h2>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search categories..."
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-50"
                        />
                    </div>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                                <th className="px-5 py-3 text-left font-medium">Category Name</th>
                                <th className="px-5 py-3 text-left font-medium">Resources</th>
                                <th className="px-5 py-3 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(cat => (
                                <tr key={cat._id} className={`border-b border-gray-50 hover:bg-gray-50 ${editId === cat._id ? 'bg-indigo-50' : ''}`}>
                                    <td className="px-5 py-3 font-medium text-gray-800">{cat.name}</td>
                                    <td className="px-5 py-3 text-gray-500">{cat.resourceCount} resources</td>
                                    <td className="px-5 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEdit(cat)}
                                                className="text-xs border border-gray-300 rounded px-2.5 py-1 text-gray-600 hover:bg-gray-100"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(cat._id)}
                                                className="text-xs border border-gray-300 rounded px-2.5 py-1 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-5 py-8 text-center text-gray-400">No categories found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Right — inline form */}
                <div className="w-72 bg-white rounded-lg border border-gray-200 p-5 flex-shrink-0">
                    <h2 className="font-semibold text-gray-800 mb-4">
                        {editId ? 'Edit Category' : 'Add Category'}
                    </h2>
                    <form onSubmit={handleSave} className="flex flex-col gap-4">
                        {formError && <p className="text-red-500 text-xs">{formError}</p>}

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Category Name *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={handle('name')}
                                className={inputClass}
                                placeholder="e.g. Programming"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={form.description}
                                onChange={handle('description')}
                                className={inputClass}
                                rows={4}
                                placeholder="Short description of this category..."
                            />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <button
                                type="button"
                                onClick={cancelForm}
                                className="border border-gray-300 text-sm font-medium px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Category'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Delete confirmation modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-80">
                        <h2 className="text-base font-semibold text-gray-900 mb-2">Delete category?</h2>
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

export default AdminCategories;
