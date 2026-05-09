import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import ResourceCard from '../components/ResourceCard';
import SearchBar from '../components/SearchBar';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState('');
    const [search, setSearch]       = useState('');

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true);
            try {
                const { data } = await axiosInstance.get('/api/resources', {
                    params: search ? { search } : {},
                });
                setResources(data);
            } catch {
                setError('Failed to load resources.');
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, [search]);

    if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
    if (error)   return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Learning Resources</h1>
            <div className="mb-6">
                <SearchBar value={search} onChange={setSearch} />
            </div>
            {resources.length === 0 ? (
                <p className="text-gray-500">No resources yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource) => (
                        <ResourceCard key={resource._id} resource={resource} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Resources;
