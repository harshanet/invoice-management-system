import { Link } from 'react-router-dom';

const CATEGORY_GRADIENT = {
  'Programming':  'from-blue-900 via-indigo-800 to-violet-900',
  'Design':       'from-purple-900 via-fuchsia-800 to-pink-800',
  'Data Science': 'from-teal-900 via-emerald-800 to-cyan-900',
  'DevOps':       'from-orange-800 via-red-800 to-rose-900',
  'Career':       'from-sky-900 via-blue-800 to-indigo-900',
};
const DEFAULT_GRADIENT = 'from-gray-800 via-slate-700 to-gray-900';

const DIFFICULTY_BADGE = {
  beginner:     'bg-green-100 text-green-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced:     'bg-red-100 text-red-700',
};

const timeAgo = (date) => {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  return `${Math.floor(days / 30)} months ago`;
};

const ResourceCard = ({ resource, bookmarked = false, onToggle }) => {
  const gradient = CATEGORY_GRADIENT[resource.category] || DEFAULT_GRADIENT;
  const diffClass = DIFFICULTY_BADGE[resource.difficulty] || 'bg-gray-100 text-gray-600';

  return (
    <Link to={`/resources/${resource._id}`} className="block group h-full">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow h-full flex flex-col">
        {/* Thumbnail */}
        {resource.image ? (
          <img src={resource.image} alt={resource.title} className="h-44 w-full object-cover flex-shrink-0" />
        ) : (
          <div className={`h-44 bg-gradient-to-br ${gradient} flex-shrink-0`} />
        )}

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 gap-3">
          {/* Badges + bookmark */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                {resource.type}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${diffClass}`}>
                {resource.difficulty}
              </span>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle?.(resource._id); }}
              className={`transition-colors flex-shrink-0 ${bookmarked ? 'text-indigo-500' : 'text-gray-300 hover:text-indigo-500'}`}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              <svg className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>

          {/* Title + description */}
          <div className="flex-1">
            <h2 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-indigo-600 transition-colors">
              {resource.title}
            </h2>
            {resource.description && (
              <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                {resource.description}
              </p>
            )}
          </div>

          {/* Bottom meta */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400 capitalize">{resource.category || '—'}</span>
            <span className="text-xs text-gray-400">{timeAgo(resource.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ResourceCard;
