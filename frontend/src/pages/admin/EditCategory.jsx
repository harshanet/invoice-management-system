import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import { useAuth } from '../../context/AuthContext';

const EditCategory = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm]       = useState({ name: '', description: '' });
    const [error, setError]     = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const { data } = await axiosInstance.get(`/api/categories/${id}`);
                setForm({ name: data.name, description: data.description || '' });
            } catch {
                setError('Failed to load category.');
            } finally {
                setFetching(false);
            }
        };
        fetchCategory();
    }, [id]);

    const handle = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return setError('Name is required.');
        setLoading(true);
        setError('');
        try {
            await axiosInstance.put(`/api/categories/${id}`, form, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            navigate('/admin/categories');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update category.');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";

    if (fetching) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

    return (
        <div className="container mx-auto p-6 max-w-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Category</h1>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={handle('name')}
                        className={inputClass}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={form.description}
                        onChange={handle('description')}
                        className={inputClass}
                        rows={3}
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
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

export default EditCategory;
