import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (pathname === '/login' || pathname === '/register') return null;

  const handleLogout = () => { logout(); navigate('/login'); };
  const initial = user?.name?.[0]?.toUpperCase() ?? 'U';

  const linkClass = (path) =>
    `text-sm transition-colors ${
      pathname === path
        ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5'
        : 'text-gray-600 hover:text-gray-900'
    }`;

  return (
    <nav className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between sticky top-0 z-10">
      <Link to="/resources" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-sm" />
        </div>
        <span className="font-bold text-gray-900 text-lg">LearnLib</span>
      </Link>

      <div className="flex items-center gap-8">
        <Link to="/resources" className={linkClass('/resources')}>Browse</Link>
        <Link to="/bookmarks" className={linkClass('/bookmarks')}>My Bookmarks</Link>
        <Link to="/about" className={linkClass('/about')}>About</Link>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Logout
            </button>
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {initial}
            </div>
          </>
        ) : (
          <Link to="/login" className="text-sm border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
