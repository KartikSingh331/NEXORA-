import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { InvoiceModal } from '../components/InvoiceModal';
import { RazorpayModal } from '../components/RazorpayModal';
import {
  PackageCheck,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  ShieldCheck,
  MapPin,
  ArrowLeft,
  DollarSign,
  FileText,
  Calendar,
} from 'lucide-react';

export const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`/api/orders/${id}`);
      setOrder(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handlePaySuccess = async (payId: string) => {
    try {
      const { data } = await axios.put(`/api/orders/${id}/pay`, {
        id: payId,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: user?.email,
      });
      setOrder(data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Payment update failed');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem 0' }}>Loading order receipt...</div>;
  }

  if (error || !order) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: 600, margin: '2rem auto' }}>
        <h2>Order Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>{error}</p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>
    );
  }

  const invoiceNo = order.invoiceNumber || `INV-2026-${order._id.substring(0, 6).toUpperCase()}`;

  // Flipkart 5-Stage Step tracker logic
  const isStageReached = (stage: number) => {
    if (stage === 1) return true; // Placed
    if (stage === 2) return order.isPaid || order.status !== 'Pending'; // Confirmed
    if (stage === 3) return order.status === 'Processing' || order.status === 'Out for Delivery' || order.isDelivered; // Packed & Shipped
    if (stage === 4) return order.status === 'Out for Delivery' || order.isDelivered; // Out for Delivery
    if (stage === 5) return order.isDelivered; // Delivered
    return false;
  };

  const formattedEstDate = order.estimatedDeliveryDate
    ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : 'In 3-5 Business Days';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/orders" className="btn btn-secondary btn-sm" style={{ marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to My Orders
          </Link>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Order #{order._id}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Invoice: <strong style={{ color: 'var(--accent-primary)' }}>{invoiceNo}</strong> • Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button className="btn btn-primary" onClick={() => setIsInvoiceOpen(true)} style={{ gap: '0.5rem' }}>
            <FileText size={18} /> Download Tax Invoice
          </button>
        </div>
      </div>

      {/* Flipkart-Style Delivery Banner */}
      <div
        className="glass-card"
        style={{
          padding: '1.2rem 1.8rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(99, 102, 241, 0.15))',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Calendar size={24} style={{ color: 'var(--success)' }} />
          <div>
            <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>
              {order.isDelivered ? 'Item Delivered Successfully' : `Estimated Delivery by ${formattedEstDate}`}
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Shipping Courier: Express Logistics • AWB: 984210982
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-pending'}`} style={{ padding: '0.5rem 0.9rem' }}>
            {order.isPaid ? 'PAID VERIFIED' : 'COD / UNPAID'}
          </span>
          <span className={`badge ${order.isDelivered ? 'badge-success' : 'badge-info'}`} style={{ padding: '0.5rem 0.9rem' }}>
            {order.isDelivered ? 'DELIVERED' : 'IN TRANSIT'}
          </span>
        </div>
      </div>

      {/* 5-Stage Flipkart Delivery Progress Timeline Bar */}
      <div className="glass-card" style={{ padding: '2rem 1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.8rem' }}>
          Flipkart-Style Live Order Tracker
        </h3>
        <div className="timeline">
          <div className={`timeline-step ${isStageReached(1) ? 'completed' : ''}`}>
            <div className="timeline-circle">1</div>
            <span className="timeline-label">Order Placed</span>
          </div>

          <div className={`timeline-step ${isStageReached(2) ? 'completed' : ''}`}>
            <div className="timeline-circle">2</div>
            <span className="timeline-label">Confirmed</span>
          </div>

          <div className={`timeline-step ${isStageReached(3) ? 'completed' : ''}`}>
            <div className="timeline-circle">3</div>
            <span className="timeline-label">Shipped</span>
          </div>

          <div className={`timeline-step ${isStageReached(4) ? 'completed' : ''}`}>
            <div className="timeline-circle">4</div>
            <span className="timeline-label">Out for Delivery</span>
          </div>

          <div className={`timeline-step ${isStageReached(5) ? 'completed' : ''}`}>
            <div className="timeline-circle">5</div>
            <span className="timeline-label">Delivered</span>
          </div>
        </div>
      </div>

      {/* Main Order Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Order Items */}
          <div className="glass-card" style={{ padding: '1.8rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <PackageCheck size={20} style={{ color: 'var(--accent-primary)' }} />
              Items in Order
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {order.orderItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
                  <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {item.qty} x ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                    ${(item.qty * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="glass-card" style={{ padding: '1.8rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <MapPin size={20} style={{ color: 'var(--accent-primary)' }} />
              Shipping Address
            </h2>
            <p style={{ fontWeight: 700 }}>{typeof order.user === 'object' ? order.user.name : 'Customer'}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Payment Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.8rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CreditCard size={20} style={{ color: 'var(--accent-primary)' }} />
              Price Details
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.2rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Mode</span>
                <span style={{ fontWeight: 700 }}>{order.paymentMethod}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Express Delivery</span>
                <span>{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tax</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div style={{ height: 1, background: 'var(--border-color)', margin: '0.4rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800 }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--accent-primary)' }}>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment & Admin status badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
              {order.isPaid ? (
                <div className="toast-alert toast-success" style={{ margin: 0 }}>
                  <CheckCircle size={18} />
                  <div>
                    <div>Payment Verified ({new Date(order.paidAt!).toLocaleDateString()})</div>
                    {order.paymentConfirmedByAdmin && (
                      <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>
                        <ShieldCheck size={12} style={{ display: 'inline', marginRight: 4 }} />
                        Confirmed by Admin
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => setIsPayModalOpen(true)}
                  style={{ width: '100%', gap: '0.6rem' }}
                >
                  <DollarSign size={20} />
                  <span>Pay Now (${order.totalPrice.toFixed(2)})</span>
                </button>
              )}

              {order.isDelivered ? (
                <div className="toast-alert toast-success" style={{ margin: 0 }}>
                  <Truck size={18} />
                  <span>Delivered on {new Date(order.deliveredAt!).toLocaleDateString()}</span>
                </div>
              ) : (
                <div className="toast-alert" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(99, 102, 241, 0.3)', margin: 0 }}>
                  <Clock size={18} />
                  <span>Awaiting Admin Delivery Approval</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tax Invoice Modal */}
      <InvoiceModal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} order={order} />

      {/* Razorpay Gateway Modal */}
      <RazorpayModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        amount={order.totalPrice}
        onSuccess={handlePaySuccess}
      />
    </div>
  );
};
