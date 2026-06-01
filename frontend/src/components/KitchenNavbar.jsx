import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const KitchenNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const links = [
        { label: 'Queue', path: '/kitchen/queue' },
        { label: 'Completed Today', path: '/kitchen/completed' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            background: '#1F2937',
            padding: '0 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '56px',
        }}>
            <span style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>🍳 Kitchen</span>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
                {links.map(link => (
                    <button
                        key={link.path}
                        onClick={() => navigate(link.path)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: location.pathname === link.path ? '#F5E6D3' : 'rgba(255,255,255,0.75)',
                            fontWeight: location.pathname === link.path ? '600' : '400',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            borderBottom: location.pathname === link.path ? '2px solid #F5E6D3' : '2px solid transparent',
                            paddingBottom: '2px',
                        }}>
                        {link.label}
                    </button>
                ))}
            </div>
            <button
                onClick={handleLogout}
                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.5)', color: 'white', padding: '0.3rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                Logout
            </button>
        </nav>
    );
};

export default KitchenNavbar;