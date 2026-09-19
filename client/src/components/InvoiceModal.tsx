import React from 'react';
import { Order } from '../types';
import { X, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNo = order.invoiceNumber || `INV-2026-${order._id.substring(0, 6).toUpperCase()}`;
  const userName = typeof order.user === 'object' ? order.user.name : 'Valued Customer';
  const userEmail = typeof order.user === 'object' ? order.user.email : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content invoice-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 750, width: '100%', padding: '2.5rem', background: '#ffffff', color: '#0f172a' }}
      >
        {/* Modal Controls (hidden during print) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#4f46e5' }}>
            <ShieldCheck size={20} />
            <span>OFFICIAL TAX INVOICE PREVIEW</span>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint} style={{ gap: '0.4rem' }}>
              <Printer size={16} /> Print / Download PDF
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Document */}
        <div id="printable-invoice">
          {/* Invoice Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #6366f1', paddingBottom: '1.2rem', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4f46e5', margin: 0 }}>NEXORA Retail Ltd.</h1>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
                Tech Park Phase II, Outer Ring Rd, Bengaluru, KA 560103<br />
                GSTIN: 29AABCA1234F1Z5 | CIN: U74999KA2026PTC087920
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.3rem 0.8rem', borderRadius: 4, fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                TAX INVOICE
              </span>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '0.5rem' }}>{invoiceNo}</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.8rem', background: '#f8fafc', padding: '1rem 1.2rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div>
              <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '0.4rem' }}>
                Billed & Shipped To:
              </h4>
              <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>{userName}</div>
              {userEmail && <div style={{ fontSize: '0.85rem', color: '#475569' }}>{userEmail}</div>}
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.3rem' }}>
                {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '0.4rem' }}>
                Order Details:
              </h4>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                <strong>Order ID:</strong> #{order._id}<br />
                <strong>Payment Method:</strong> {order.paymentMethod}<br />
                <strong>Payment Status:</strong>{' '}
                <span style={{ color: order.isPaid ? '#16a34a' : '#ea580c', fontWeight: 700 }}>
                  {order.isPaid ? 'PAID' : 'CASH ON DELIVERY / PENDING'}
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '0.6rem 0.8rem', fontWeight: 700 }}>Item Description</th>
                <th style={{ padding: '0.6rem 0.8rem', fontWeight: 700, textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '0.6rem 0.8rem', fontWeight: 700, textAlign: 'right' }}>Unit Price</th>
                <th style={{ padding: '0.6rem 0.8rem', fontWeight: 700, textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.8rem', fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: '0.8rem', textAlign: 'center' }}>{item.qty}</td>
                  <td style={{ padding: '0.8rem', textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                  <td style={{ padding: '0.8rem', textAlign: 'right', fontWeight: 700 }}>
                    ${(item.qty * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #e2e8f0', paddingTop: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontWeight: 700, fontSize: '0.88rem' }}>
                <CheckCircle2 size={16} /> Verified Authentic Invoice
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                Computer generated invoice. No signature required.
              </p>
            </div>

            <div style={{ width: 260, fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: '#64748b' }}>Items Subtotal:</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: '#64748b' }}>Shipping Charge:</span>
                <span>{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: '#64748b' }}>Tax (8%):</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #0f172a', paddingTop: '0.6rem', fontSize: '1.1rem', fontWeight: 800 }}>
                <span>Grand Total:</span>
                <span style={{ color: '#4f46e5' }}>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-modal-content, .invoice-modal-content * {
            visibility: visible;
          }
          .invoice-modal-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
