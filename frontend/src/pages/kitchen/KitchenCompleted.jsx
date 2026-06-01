import { useState, useEffect } from 'react';
import api from '../../axiosConfig';
import KitchenNavbar from '../../components/KitchenNavbar';

const KitchenCompleted = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompleted = async () => {
            try {
                const { data } = await api.get('/orders');
                const today = new Date().toDateString();
                setOrders(data.filter(o =>
                    o.status === 'completed' &&
                    new Date(o.updatedAt).toDateString() === today
                ));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCompleted();
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#111827' }}>
            <KitchenNavbar />
            <div style={{ padding: '1.5rem', maxWidth: '700px', margin: '0 auto' }}>
                <h1 style={{ color: 'white', marginBottom: '1.5rem' }}>
                    Completed Today
                    <span style={{ marginLeft: '0.75rem', background: '#374151', color: '#9ca3af', borderRadius: '12px', padding: '0.15rem 0.75rem', fontSize: '0.9rem' }}>
                        {orders.length}
                    </span>
                </h1>

                {loading ? (
                    <p style={{ color: '#9ca3af' }}>Loading...</p>
                ) : orders.length === 0 ? (
                    <p style={{ color: '#4b5563', fontStyle: 'italic' }}>No completed orders yet today.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {orders.map(order => (
                            <div key={order._id} style={{ background: '#1F2937', borderRadius: '10px', padding: '1rem', border: '1px solid #374151', borderLeft: '4px solid #16A34A' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'white', fontWeight: '700' }}>#{order.orderNumber}</span>
                                    <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                                        {new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                {order.items.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#d1d5db' }}>
                                        <span>{item.name}</span>
                                        <span style={{ color: '#9ca3af' }}>×{item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KitchenCompleted;