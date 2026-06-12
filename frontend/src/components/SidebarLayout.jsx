import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import FeedbackModal from './FeedbackModal';

const BrowseIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const BookmarkIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SupportIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const AdminIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SidebarLayout = () => {
  const { user, logout } = useAuth();
  const { pathname, search: locationSearch } = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(locationSearch);
    setSearchQuery(params.get('search') || '');
  }, [locationSearch]);

  useEffect(() => {
    const close = () => setProfileOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const initial = user?.name?.[0]?.toUpperCase() ?? 'U';

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const q = searchQuery.trim();
      navigate(`/resources${q ? `?search=${encodeURIComponent(q)}` : ''}`);
    }
  };

  const navItem = (to, label, Icon) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          active
            ? 'bg-indigo-600 text-white'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
        }`}
      >
        <Icon />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-52 bg-white border-r border-gray-100 fixed h-full z-20 flex flex-col">
        <div className="px-5 pt-5 pb-4 border-b border-gray-100">
          <Link to="/resources" className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="w-3 h-3 bg-white rounded-sm" />
            </div>
            <span className="font-bold text-gray-900 text-base">LearnLib</span>
          </Link>
          <p className="text-xs font-semibold text-gray-700 leading-tight">Resource Library</p>
          <p className="text-xs text-gray-400">Educational Hub</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItem('/resources', 'Browse', BrowseIcon)}
          {navItem('/bookmarks', 'My Bookmarks', BookmarkIcon)}
        </nav>

        <div className="px-3 pb-5 pt-2 border-t border-gray-100 flex flex-col gap-1">
          {navItem('/settings', 'Settings', SettingsIcon)}
          <button
            onClick={() => setFeedbackOpen(true)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors w-full text-left"
          >
            <SupportIcon />
            Feedback
          </button>
          <Link to="/about" className="mt-2 w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors text-center">
            About
          </Link>
        </div>
      </aside>

      {/* Right panel */}
      <div className="flex-1 ml-52 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 flex-1 max-w-md">
            <SearchIcon />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search resources..."
              className="flex-1 text-sm bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <BellIcon />
            </button>
            {user ? (
              <div className="relative" onMouseDown={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm"
                >
                  {initial}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg py-1 w-44 z-30">
                    <Link to="/settings" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50">
                        <AdminIcon />
                        Admin Console
                      </Link>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-sm border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                Sign in
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
    </div>
  );
};

export default SidebarLayout;
