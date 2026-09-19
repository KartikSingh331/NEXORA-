import React, { useState } from 'react';
import { ShieldCheck, X, CreditCard, Landmark, Smartphone, CheckCircle } from 'lucide-react';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: (paymentId: string) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({ isOpen, onClose, amount, onSuccess }) => {
  const [method, setMethod] = useState<'card' | 'netbanking' | 'upi'>('card');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
      setTimeout(() => {
        const generatedPayId = `pay_rzp_2026_${Math.floor(100000 + Math.random() * 900000)}`;
        onSuccess(generatedPayId);
        onClose();
        setCompleted(false);
      }, 1200);
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 460, padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}
      >
        {/* Razorpay Header Banner */}
        <div style={{ background: 'linear-gradient(135deg, #0c2340, #1d4ed8)', padding: '1.5rem', color: '#fff', position: 'relative' }}>
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', color: '#93c5fd' }}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <div style={{ background: '#2563eb', padding: '0.4rem 0.8rem', borderRadius: 6, fontWeight: 900, fontSize: '1rem', letterSpacing: '1px' }}>
              Razorpay
            </div>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: 12 }}>
              TEST GATEWAY
            </span>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#93c5fd' }}>Merchant: NEXORA Retail</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.2rem' }}>
            ₹{(amount * 83).toFixed(2)} <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>(${amount.toFixed(2)})</span>
          </div>
        </div>

        {/* Razorpay Body */}
        <div style={{ padding: '1.5rem' }}>
          {completed ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--success)' }}>
              <CheckCircle size={52} style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Payment Authorized!</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Redirecting to order confirmation...</p>
            </div>
          ) : (
            <form onSubmit={handlePay}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.2rem' }}>
                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`btn btn-sm ${method === 'card' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ gap: '0.3rem', fontSize: '0.78rem' }}
                >
                  <CreditCard size={14} /> Card
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  className={`btn btn-sm ${method === 'upi' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ gap: '0.3rem', fontSize: '0.78rem' }}
                >
                  <Smartphone size={14} /> UPI
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('netbanking')}
                  className={`btn btn-sm ${method === 'netbanking' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ gap: '0.3rem', fontSize: '0.78rem' }}
                >
                  <Landmark size={14} /> Netbanking
                </button>
              </div>

              {method === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <input type="text" className="form-input" placeholder="Card Number (4532 •••• •••• 8892)" defaultValue="4532 8821 9912 8892" required />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <input type="text" className="form-input" placeholder="MM/YY" defaultValue="12/28" required />
                    <input type="password" className="form-input" placeholder="CVV" defaultValue="789" required />
                  </div>
                </div>
              )}

              {method === 'upi' && (
                <div className="form-group">
                  <label className="form-label">Enter VPA / UPI ID</label>
                  <input type="text" className="form-input" placeholder="yourname@upi / phonepe / paytm" defaultValue="customer@upibank" required />
                </div>
              )}

              {method === 'netbanking' && (
                <div className="form-group">
                  <label className="form-label">Select Bank</label>
                  <select className="form-select" defaultValue="HDFC">
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="AXIS">Axis Bank</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '1.2rem', background: '#2563eb' }}
              >
                {processing ? 'Processing Razorpay Authorization...' : `Pay ₹${(amount * 83).toFixed(2)} via Razorpay`}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <ShieldCheck size={14} />
                <span>256-bit SSL Encrypted • Powered by Razorpay</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
