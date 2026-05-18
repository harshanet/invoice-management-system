import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import ResourceCard from '../components/ResourceCard';

const BookmarkIcon = () => (
  <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const Bookmarks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axiosInstance.get('/api/bookmarks')
      .then(({ data }) => setBookmarks(data))
      .catch(() => setError('Failed to load bookmarks.'))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleRemove = async (resourceId) => {
    setBookmarks((prev) => prev.filter((b) => b.resourceId?._id !== resourceId));
    try {
      await axiosInstance.delete(`/api/bookmarks/${resourceId}`);
    } catch {
      axiosInstance.get('/api/bookmarks').then(({ data }) => setBookmarks(data));
    }
  };

  if (loading) return <p className="text-center mt-20 text-gray-400">Loading...</p>;
  if (error)   return <p className="text-center mt-20 text-red-500">{error}</p>;

  return (
    <div className="px-10 py-10">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookmarks</h1>
      <p className="text-base text-gray-500 mb-8">Resources you've saved for later.</p>
      <hr className="border-gray-200 mb-10" />

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <BookmarkIcon />
          <p className="text-lg font-semibold text-gray-500 mt-4 mb-1">No bookmarks yet</p>
          <p className="text-sm text-gray-400 mb-7">
            Browse resources and click the bookmark icon to save them here.
          </p>
          <Link
            to="/resources"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Browse Resources
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-7">
            <h2 className="text-lg font-bold text-gray-900 whitespace-nowrap">Saved</h2>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400 whitespace-nowrap">
              {bookmarks.length} resource{bookmarks.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {bookmarks.map((b) =>
              b.resourceId ? (
                <ResourceCard
                  key={b._id}
                  resource={b.resourceId}
                  bookmarked={true}
                  onToggle={handleRemove}
                />
              ) : null
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Bookmarks;
