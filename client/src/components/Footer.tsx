import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, CreditCard, RotateCcw } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', marginTop: '4rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '3rem 1.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--accent-glow)', padding: '0.8rem', borderRadius: '50%', color: 'var(--accent-primary)' }}>
              <Truck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Express Shipping</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Free delivery on orders over $100</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--accent-glow)', padding: '0.8rem', borderRadius: '50%', color: 'var(--accent-primary)' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Admin Verified</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Guaranteed delivery & payment confirmation</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--accent-glow)', padding: '0.8rem', borderRadius: '50%', color: 'var(--accent-primary)' }}>
              <CreditCard size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Secure Checkout</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Razorpay, UPI & COD Verification</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--accent-glow)', padding: '0.8rem', borderRadius: '50%', color: 'var(--accent-primary)' }}>
              <RotateCcw size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Easy Returns</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>30-day money back guarantee</p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
            <ShoppingBag size={20} style={{ color: 'var(--accent-primary)' }} />
            <span>NEXORA E-Commerce</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            Developed by <strong>Kartik</strong> • B.Tech CSE Final Year Capstone Project
          </p>
        </div>
      </div>
    </footer>
  );
};
