import { useState, useEffect, useCallback } from 'react';
import api from '../../axiosConfig';
import KitchenNavbar from '../../components/KitchenNavbar';
import StatusBadge from '../../components/StatusBadge';

const COLUMNS = [
    { status: 'queued',    label: 'Queued',    accent: '#2563EB' },
    { status: 'preparing', label: 'Preparing', accent: '#B45309' },
    { status: 'ready',     label: 'Ready',     accent: '#16A34A' },
];

const getElapsedMinutes = (createdAt) => {
    return Math.floor((Date.now() - new Date(createdAt)) / 60000);
};

const KitchenQueue = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data.filter(o => ['queued', 'preparing', 'ready'].includes(o.status)));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Poll every 30 seconds for new orders
    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, [fetchOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            await fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    const getNextStatus = (current) => {
        const map = { queued: 'preparing', preparing: 'ready' };
        return map[current];
    };

    const getActionLabel = (status) => {
        const map = { queued: 'Start Preparing', preparing: 'Mark Ready' };
        return map[status];
    };

    const ordersForColumn = (status) => orders.filter(o => o.status === status);

    return (
        <div style={{ minHeight: '100vh', background: '#111827' }}>
            <KitchenNavbar />
            <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h1 style={{ color: 'white', margin: 0 }}>Kitchen Queue</h1>
                    <button
                        onClick={fetchOrders}
                        style={{ background: 'none', border: '1px solid #4b5563', color: '#9ca3af', padding: '0.4rem 0.9rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                        ↻ Refresh
                    </button>
                </div>

                {loading ? (
                    <p style={{ color: '#9ca3af' }}>Loading orders...</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {COLUMNS.map(col => (
                            <div key={col.status}>
                                {/* Column header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                    <span style={{ color: col.accent, fontWeight: '700', fontSize: '1rem' }}>{col.label}</span>
                                    <span style={{ background: '#374151', color: '#9ca3af', borderRadius: '12px', padding: '0.1rem 0.6rem', fontSize: '0.8rem' }}>
                                        {ordersForColumn(col.status).length}
                                    </span>
                                </div>

                                {/* Order cards */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {ordersForColumn(col.status).length === 0 ? (
                                        <p style={{ color: '#4b5563', fontSize: '0.85rem', fontStyle: 'italic' }}>No orders</p>
                                    ) : (
                                        ordersForColumn(col.status).map(order => {
                                            const elapsed = getElapsedMinutes(order.createdAt);
                                            const isUrgent = elapsed >= 15;

                                            return (
                                                <div key={order._id} style={{
                                                    background: '#1F2937',
                                                    borderRadius: '10px',
                                                    overflow: 'hidden',
                                                    border: '1px solid #374151',
                                                    borderLeft: `4px solid ${isUrgent ? '#DC2626' : col.accent}`,
                                                }}>
                                                    <div style={{ padding: '1rem' }}>
                                                        {/* Header */}
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                            <span style={{ color: 'white', fontWeight: '700' }}>#{order.orderNumber}</span>
                                                            <span style={{
                                                                fontSize: '0.75rem',
                                                                color: isUrgent ? '#DC2626' : '#9ca3af',
                                                                fontWeight: isUrgent ? '700' : '400',
                                                            }}>
                                                                {elapsed}m ago {isUrgent ? '⚠️' : ''}
                                                            </span>
                                                        </div>

                                                        {/* Items */}
                                                        {order.items.map((item, i) => (
                                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#d1d5db', marginBottom: '0.25rem' }}>
                                                                <span>{item.name}</span>
                                                                <span style={{ color: '#9ca3af' }}>×{item.quantity}</span>
                                                            </div>
                                                        ))}

                                                        {/* Notes */}
                                                        {order.notes && (
                                                            <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: '#F59E0B', fontStyle: 'italic' }}>
                                                                📝 {order.notes}
                                                            </p>
                                                        )}

                                                        {/* Action button */}
                                                        {getNextStatus(order.status) && (
                                                            <button
                                                                onClick={() => handleStatusChange(order._id, getNextStatus(order.status))}
                                                                style={{
                                                                    marginTop: '0.75rem',
                                                                    width: '100%',
                                                                    background: col.accent,
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    padding: '0.5rem',
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer',
                                                                    fontWeight: '600',
                                                                    fontSize: '0.85rem',
                                                                }}>
                                                                {getActionLabel(order.status)}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KitchenQueue;