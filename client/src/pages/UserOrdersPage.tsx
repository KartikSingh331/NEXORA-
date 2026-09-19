import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Order } from '../types';
import { Package, ArrowRight } from 'lucide-react';

export const UserOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get('/api/orders/myorders');
        setOrders(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load order history');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem 0' }}>Loading your order history...</div>;
  }

  if (error) {
    return (
      <div className="toast-alert toast-error" style={{ maxWidth: 600, margin: '2rem auto' }}>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>My Order History</h1>

      {orders.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <Package size={56} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>No Orders Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.8rem 0 1.8rem' }}>
            You haven't placed any orders yet. Explore our catalog and grab your favorite gear!
          </p>
          <Link to="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {orders.map((order) => (
            <div
              key={order._id}
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.2rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Order #{order._id}</span>
                  <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-pending'}`}>
                    {order.isPaid ? 'PAID' : 'UNPAID'}
                  </span>
                  <span className={`badge ${order.isDelivered ? 'badge-success' : 'badge-info'}`}>
                    {order.isDelivered ? 'DELIVERED' : 'IN TRANSIT'}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.orderItems.length} item(s)
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent-primary)' }}>
                    ${order.totalPrice.toFixed(2)}
                  </div>
                </div>

                <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                  <span>View Details</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
