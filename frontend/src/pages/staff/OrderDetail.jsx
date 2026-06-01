import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../axiosConfig';
import StatusBadge from '../../components/StatusBadge';
import StaffNavbar from '../../components/StaffNavbar';

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
    if (!order) return <div style={{ padding: '2rem' }}>Order not found.</div>;

    return (
        <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
            <StaffNavbar />
            <div style={{ padding: '1.5rem', maxWidth: '700px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/staff/orders')}
                    style={{ background: 'none', border: 'none', color: '#A0522D', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}>
                    ← Back to Orders
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h1 style={{ color: '#A0522D', margin: 0 }}>Order #{order.orderNumber}</h1>
                    <StatusBadge status={order.status} />
                </div>

                <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' }}>
                    <h3 style={{ margin: '0 0 1rem', color: '#374151' }}>Items</h3>
                    {order.items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: i < order.items.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                            <span>{item.name} × {item.quantity}</span>
                            <span style={{ color: '#A0522D', fontWeight: '600' }}>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '2px solid #f3f4f6', fontWeight: '700' }}>
                        <span>Total</span>
                        <span style={{ color: '#A0522D' }}>${order.totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                {order.notes && (
                    <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem' }}>
                        <h3 style={{ margin: '0 0 0.5rem', color: '#374151' }}>Notes</h3>
                        <p style={{ margin: 0, color: '#6b7280' }}>{order.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetail;