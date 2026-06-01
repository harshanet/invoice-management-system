import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StaffNavbar from '../../components/StaffNavbar';

const StaffDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
            <StaffNavbar />
            <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                <h1 style={{ color: '#A0522D' }}>Welcome back, {user?.name} 👋</h1>
                <p style={{ color: '#6b7280' }}>What would you like to do?</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button
                        onClick={() => navigate('/staff/menu')}
                        style={{ background: '#A0522D', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }}>
                        + New Order
                    </button>
                    <button
                        onClick={() => navigate('/staff/orders')}
                        style={{ background: 'white', color: '#A0522D', border: '1px solid #A0522D', padding: '1rem 2rem', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }}>
                        View Active Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;