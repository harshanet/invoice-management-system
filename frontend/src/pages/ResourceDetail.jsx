import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const CATEGORY_GRADIENT = {
  'Programming':  'from-blue-900 via-indigo-800 to-violet-900',
  'Design':       'from-purple-900 via-fuchsia-800 to-pink-800',
  'Data Science': 'from-teal-900 via-emerald-800 to-cyan-900',
  'DevOps':       'from-orange-800 via-red-800 to-rose-900',
  'Career':       'from-sky-900 via-blue-800 to-indigo-900',
};
const DEFAULT_GRADIENT = 'from-gray-800 via-slate-700 to-gray-900';

const DIFFICULTY_BADGE = {
  beginner:     'bg-green-100 text-green-700 border-green-200',
  intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
  advanced:     'bg-red-100 text-red-700 border-red-200',
};

const typeBadgeColor = {
  video:   'bg-blue-50 text-blue-700',
  course:  'bg-purple-50 text-purple-700',
  article: 'bg-green-50 text-green-700',
  book:    'bg-pink-50 text-pink-700',
  tool:    'bg-cyan-50 text-cyan-700',
  other:   'bg-gray-50 text-gray-700',
};

const BookmarkIcon = ({ filled }) => (
  <svg className="w-5 h-5" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resource, setResource] = useState(null);
  const [related, setRelated]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/resources/${id}`);
        setResource(data);
        if (data.category) {
          const { data: rel } = await axiosInstance.get('/api/resources', {
            params: { category: data.category },
          });
          setRelated(rel.filter((r) => r._id !== id).slice(0, 3));
        }
      } catch {
        setError('Resource not found.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;
    axiosInstance.get('/api/bookmarks')
      .then(({ data }) => {
        setBookmarked(data.some((b) => b.resourceId?._id === id));
      })
      .catch(() => {});
  }, [user, id]);

  const handleToggleBookmark = async () => {
    if (!user) { navigate('/login'); return; }
    const wasBookmarked = bookmarked;
    setBookmarked(!wasBookmarked);
    try {
      if (wasBookmarked) {
        await axiosInstance.delete(`/api/bookmarks/${id}`);
      } else {
        await axiosInstance.post('/api/bookmarks', { resourceId: id });
      }
    } catch {
      setBookmarked(wasBookmarked);
    }
  };

  if (loading) return <p className="text-center mt-20 text-gray-400">Loading...</p>;
  if (error)   return <p className="text-center mt-20 text-red-500">{error}</p>;

  const gradient  = CATEGORY_GRADIENT[resource.category] || DEFAULT_GRADIENT;
  const diffClass = DIFFICULTY_BADGE[resource.difficulty] || 'bg-gray-100 text-gray-600 border-gray-200';
  const typeClass = typeBadgeColor[resource.type] || 'bg-gray-50 text-gray-700';

  const added = new Date(resource.createdAt).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back link */}
      <div className="px-10 pt-8 pb-4">
        <button
          onClick={() => navigate('/resources')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Browse
        </button>
      </div>

      {/* Hero banner */}
      {resource.image ? (
        <img src={resource.image} alt={resource.title} className="mx-10 rounded-2xl h-72 w-[calc(100%-5rem)] object-cover" />
      ) : (
        <div className={`mx-10 rounded-2xl h-72 bg-gradient-to-br ${gradient}`} />
      )}

      {/* Content */}
      <div className="px-10 pt-8 pb-16 flex gap-8 items-start">
        {/* Main column */}
        <div className="flex-1 min-w-0">
          {/* Badges + read time */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${typeClass} border-current/20`}>
              {resource.type}
            </span>
            {resource.difficulty && (
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${diffClass}`}>
                {resource.difficulty}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <ClockIcon />
              <span className="capitalize">{resource.category || resource.type}</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
            {resource.title}
          </h1>

          <hr className="border-gray-200 mb-6" />

          {/* Action buttons */}
          <div className="flex items-center gap-3 mb-6">
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Open Resource
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button
              onClick={handleToggleBookmark}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
              className={`w-11 h-11 flex items-center justify-center border rounded-xl transition-colors ${
                bookmarked
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-600'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <BookmarkIcon filled={bookmarked} />
            </button>
            <button className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
              <ShareIcon />
            </button>
          </div>

          <hr className="border-gray-200 mb-6" />

          {/* Description */}
          {resource.description && (
            <p className="text-base text-gray-600 leading-relaxed">
              {resource.description}
            </p>
          )}
        </div>

        {/* Details sidebar */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Details</h3>
            </div>

            <div className="divide-y divide-gray-100">
              {resource.category && (
                <div className="px-5 py-4">
                  <p className="text-xs text-gray-400 mb-1">Category</p>
                  <p className="text-sm font-medium text-gray-800">{resource.category}</p>
                </div>
              )}
              <div className="px-5 py-4">
                <p className="text-xs text-gray-400 mb-1">Published</p>
                <p className="text-sm font-medium text-gray-800">{added}</p>
              </div>
              {resource.difficulty && (
                <div className="px-5 py-4">
                  <p className="text-xs text-gray-400 mb-1">Difficulty</p>
                  <p className="text-sm font-medium text-gray-800 capitalize">{resource.difficulty}</p>
                </div>
              )}
              {resource.tags?.length > 0 && (
                <div className="px-5 py-4">
                  <p className="text-xs text-gray-400 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {resource.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related resources */}
          {related.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Related</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {related.map((r) => (
                  <Link
                    key={r._id}
                    to={`/resources/${r._id}`}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors"
                  >
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${typeBadgeColor[r.type] || 'bg-gray-50 text-gray-700'}`}>
                      {r.type}
                    </span>
                    <span className="text-xs text-gray-700 font-medium line-clamp-1">{r.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
