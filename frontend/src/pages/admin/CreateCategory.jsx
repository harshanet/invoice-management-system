import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import { useAuth } from '../../context/AuthContext';

const CreateCategory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm]     = useState({ name: '', description: '' });
    const [error, setError]   = useState('');
    const [loading, setLoading] = useState(false);

    const handle = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return setError('Name is required.');
        setLoading(true);
        setError('');
        try {
            await axiosInstance.post('/api/categories', form, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            navigate('/admin/categories');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create category.');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";

    return (
        <div className="container mx-auto p-6 max-w-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Category</h1>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={handle('name')}
                        className={inputClass}
                        placeholder="e.g. Web Development"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={form.description}
                        onChange={handle('description')}
                        className={inputClass}
                        rows={3}
                        placeholder="Optional description"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Category'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/categories')}
                        className="text-sm text-gray-500 hover:underline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCategory;
