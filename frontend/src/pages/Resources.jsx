import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import ResourceCard from '../components/ResourceCard';

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
  if (weeks < 5) return `${weeks}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const FilterIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
  </svg>
);

const SortIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Resources = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const [allResources, setAllResources] = useState([]);
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [sort, setSort]                 = useState('newest');
  const [filterOpen, setFilterOpen]     = useState(false);
  const [sortOpen, setSortOpen]         = useState(false);
  const filterRef = useRef(null);
  const sortRef   = useRef(null);

  useEffect(() => {
    Promise.all([
      axiosInstance.get('/api/resources'),
      axiosInstance.get('/api/categories'),
    ]).then(([{ data: res }, { data: cats }]) => {
      setAllResources(res);
      setCategories(cats);
    }).catch(() => setError('Failed to load resources.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
      if (sortRef.current  && !sortRef.current.contains(e.target))  setSortOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const sortFn = {
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    az:     (a, b) => a.title.localeCompare(b.title),
  }[sort];

  const filtered = allResources
    .filter((r) => !activeCategory || r.category === activeCategory)
    .filter((r) =>
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    )
    .sort(sortFn);

  const showFeatured  = !search && !activeCategory;
  const featured      = showFeatured ? filtered[0] : null;
  const gridResources = showFeatured ? filtered.slice(1) : filtered;
  const featGradient  = CATEGORY_GRADIENT[featured?.category] || DEFAULT_GRADIENT;

  if (loading) return <p className="text-center mt-20 text-gray-400">Loading...</p>;
  if (error)   return <p className="text-center mt-20 text-red-500">{error}</p>;

  return (
    <div className="px-10 py-10">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Resources</h1>
      <p className="text-base text-gray-500 mb-8">
        Explore our curated collection of tutorials, courses, books, and tools to accelerate your learning.
      </p>
      <hr className="border-gray-200 mb-10" />

      {/* Featured card */}
      {featured && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex mb-14 shadow-sm">
          <div className={`relative w-5/12 flex-shrink-0 min-h-[320px] ${featured.image ? '' : `bg-gradient-to-br ${featGradient}`}`}>
            {featured.image && (
              <img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" />
            )}
            <span className="absolute top-5 left-5 text-xs font-bold tracking-widest text-white/90 bg-black/30 px-3 py-1.5 rounded-full border border-white/20 z-10">
              FEATURED
            </span>
          </div>

          <div className="flex-1 p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                {featured.category && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {featured.category}
                  </span>
                )}
                {featured.difficulty && (
                  <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${DIFFICULTY_BADGE[featured.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                    {featured.difficulty}
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-snug">{featured.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 max-w-lg">{featured.description}</p>
            </div>

            <div className="flex items-center gap-5 mt-8">
              <a
                href={featured.url}
                target="_blank"
                rel="noreferrer"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
              >
                Open Resource ↗
              </a>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <ClockIcon />
                <span className="capitalize">{featured.type}</span>
                <span>·</span>
                <span>{timeAgo(featured.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section header */}
      <div className="flex items-center gap-4 mb-7">
        <h2 className="text-lg font-bold text-gray-900 whitespace-nowrap">
          {search ? `Results for "${search}"` : 'Latest Additions'}
        </h2>
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400 whitespace-nowrap">
          {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
        </span>

        <div className="flex items-center gap-2">
          {/* Filter */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => { setFilterOpen((v) => !v); setSortOpen(false); }}
              className={`flex items-center gap-1.5 border rounded-xl px-3 py-2 text-sm transition-colors ${
                activeCategory
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FilterIcon />
              {activeCategory || 'Filter'}
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 w-44 z-20">
                <button
                  onClick={() => { setActiveCategory(''); setFilterOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm ${!activeCategory ? 'text-indigo-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  All categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => { setActiveCategory(cat.name); setFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm ${activeCategory === cat.name ? 'text-indigo-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => { setSortOpen((v) => !v); setFilterOpen(false); }}
              className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <SortIcon />
              Sort
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 w-36 z-20">
                {[['newest', 'Newest first'], ['oldest', 'Oldest first'], ['az', 'A → Z']].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => { setSort(val); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm ${sort === val ? 'text-indigo-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      {gridResources.length === 0 && !featured && (
        <p className="text-center text-gray-400 py-20">No resources found.</p>
      )}
      {gridResources.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {gridResources.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;
