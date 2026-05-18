import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const nav = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/resources', label: 'Resources' },
    { to: '/admin/categories', label: 'Categories' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/settings', label: 'Settings' },
];

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/login'); };
    const initial = user?.name?.[0]?.toUpperCase() ?? 'A';

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Dark sidebar */}
            <aside className="w-48 bg-[#1a1a2e] fixed h-full z-20 flex flex-col">
                <div className="px-5 pt-6 pb-5 border-b border-white/10">
                    <p className="text-white font-bold text-base leading-tight">LearnLib</p>
                    <p className="text-gray-400 text-xs mt-0.5">Admin Panel</p>
                </div>

                <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
                    {nav.map(({ to, label }) => {
                        const active = pathname === to || (to !== '/admin/dashboard' && pathname.startsWith(to));
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    active
                                        ? 'bg-white/10 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main */}
            <div className="flex-1 ml-48 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-end sticky top-0 z-10">
                    <div className="relative" onMouseDown={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setProfileOpen((v) => !v)}
                            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                            {user?.name ?? 'Admin'}
                            <span className="text-gray-400">▾</span>
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-600 ml-1">
                                {initial}
                            </div>
                        </button>
                        {profileOpen && (
                            <div
                                className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg py-1 w-36 z-30"
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <Link to="/resources" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    User View
                                </Link>
                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
