import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../axiosConfig';
import StatusBadge from '../../components/StatusBadge';
import StaffNavbar from '../../components/StaffNavbar';

const ActiveOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders');
                // Staff sees only active (not completed/cancelled)
                setOrders(data.filter(o => !['completed', 'cancelled'].includes(o.status)));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
            <StaffNavbar />
            <div style={{ padding: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
                <h1 style={{ color: '#A0522D' }}>Active Orders</h1>
                {loading ? (
                    <p>Loading orders...</p>
                ) : orders.length === 0 ? (
                    <p style={{ color: '#6b7280' }}>No active orders.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                        {orders.map(order => (
                            <div
                                key={order._id}
                                onClick={() => navigate(`/staff/orders/${order._id}`)}
                                style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ margin: '0 0 0.25rem', fontWeight: '600' }}>Order #{order.orderNumber}</p>
                                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem' }}>
                                        {order.items.length} item{order.items.length !== 1 ? 's' : ''} · ${order.totalPrice.toFixed(2)}
                                    </p>
                                </div>
                                <StatusBadge status={order.status} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveOrders;