import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import { useAuth } from '../../context/AuthContext';

const AdminCategories = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState('');
    const [confirmId, setConfirmId]   = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axiosInstance.get('/api/categories');
                setCategories(data);
            } catch {
                setError('Failed to load categories.');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/api/categories/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setCategories((prev) => prev.filter((c) => c._id !== id));
        } catch {
            setError('Failed to delete category.');
        } finally {
            setConfirmId(null);
        }
    };

    if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                <button
                    onClick={() => navigate('/admin/categories/new')}
                    className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-blue-700"
                >
                    + New Category
                </button>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {categories.length === 0 ? (
                <p className="text-gray-500">No categories yet.</p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Description</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map((cat) => (
                                <tr key={cat._id}>
                                    <td className="px-4 py-3 font-medium text-gray-800">{cat.name}</td>
                                    <td className="px-4 py-3 text-gray-500">{cat.description || '—'}</td>
                                    <td className="px-4 py-3 text-right">
                                        {confirmId === cat._id ? (
                                            <span className="flex items-center justify-end gap-2">
                                                <span className="text-gray-600 text-xs">Delete?</span>
                                                <button
                                                    onClick={() => handleDelete(cat._id)}
                                                    className="text-xs text-red-600 font-semibold hover:underline"
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={() => setConfirmId(null)}
                                                    className="text-xs text-gray-500 hover:underline"
                                                >
                                                    No
                                                </button>
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => navigate(`/admin/categories/${cat._id}/edit`)}
                                                    className="text-blue-500 hover:underline text-xs"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setConfirmId(cat._id)}
                                                    className="text-red-500 hover:underline text-xs"
                                                >
                                                    Delete
                                                </button>
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
