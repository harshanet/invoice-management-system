import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import ResourceForm from '../../components/ResourceForm';

const TIPS = [
    'Use clear, descriptive titles.',
    'Add relevant tags to improve discoverability.',
    'Choose the correct difficulty level for the audience.',
    'Verify the external URL is accessible before saving.',
];

const CreateResource = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');

    const handleSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            await axiosInstance.post('/api/resources', data);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create resource.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
                <Link to="/admin/dashboard" className="hover:text-gray-700">Resources</Link>
                <span>/</span>
                <span className="text-gray-800 font-medium">Add Resource</span>
            </div>

            <div className="flex gap-6 items-start">
                {/* Form card */}
                <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
                    <h1 className="text-xl font-bold text-gray-900 mb-6">Add New Resource</h1>
                    <ResourceForm
                        onSubmit={handleSubmit}
                        loading={loading}
                        error={error}
                        onCancel={() => navigate('/admin/dashboard')}
                    />
                </div>

                {/* Tips sidebar */}
                <div className="w-56 bg-white rounded-lg border border-gray-200 p-5 flex-shrink-0">
                    <h2 className="text-sm font-semibold text-gray-800 mb-4">Tips</h2>
                    <ul className="flex flex-col gap-3">
                        {TIPS.map((tip) => (
                            <li key={tip} className="flex gap-2 text-xs text-gray-500 leading-snug">
                                <span className="text-gray-400 mt-0.5">•</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CreateResource;
