import React, { useState, useEffect } from 'react';
import { X, QrCode, ShieldCheck, CheckCircle, Smartphone } from 'lucide-react';

// YOUR REAL UPI PAYMENTS CONFIGURATION
export const MY_UPI_ID = 'ks0332790@okicici';
export const MY_STORE_NAME = 'NEXORA Retail';

interface UpiQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: (paymentId: string) => void;
}

export const UpiQrModal: React.FC<UpiQrModalProps> = ({ isOpen, onClose, amount, onSuccess }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(300);
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setSuccess(true);
      setTimeout(() => {
        const payId = `UPI-SCAN-${Date.now()}`;
        onSuccess(payId);
        onClose();
        setSuccess(false);
      }, 1200);
    }, 1500);
  };

  // Dynamic UPI Payment Link (Encodes your real UPI ID and order total in INR ₹)
  const upiPayUrl = `upi://pay?pa=${MY_UPI_ID}&pn=${encodeURIComponent(MY_STORE_NAME)}&am=${(amount * 83).toFixed(2)}&cu=INR`;
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiPayUrl)}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 420, padding: '2rem', textAlign: 'center' }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        {success ? (
          <div style={{ color: 'var(--success)', padding: '2rem 0' }}>
            <CheckCircle size={56} style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>UPI Payment Authorized!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Confirming order details...</p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.4rem' }}>
              <QrCode size={22} />
              <span>SCAN & PAY VIA UPI</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
              Scan QR code using PhonePe, GPay, Paytm, or BHIM UPI app
            </p>

            {/* Generated QR Box for ks0332790@okicici */}
            <div style={{ background: '#ffffff', padding: '1.2rem', borderRadius: 'var(--radius-md)', display: 'inline-block', boxShadow: 'var(--shadow-md)', marginBottom: '1rem' }}>
              <img
                src={qrImageSrc}
                alt={`UPI QR Code for ${MY_UPI_ID}`}
                style={{ width: 190, height: 190, display: 'block' }}
              />
            </div>

            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.4rem' }}>
              ₹{(amount * 83).toFixed(2)} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>(${amount.toFixed(2)})</span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1.2rem' }}>
              Payee UPI ID: <strong style={{ color: 'var(--accent-primary)', fontSize: '0.95rem' }}>{MY_UPI_ID}</strong>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--warning)', fontWeight: 700, marginBottom: '1.2rem' }}>
              QR Code expires in {formatTime(timeLeft)}
            </div>

            <button
              onClick={handleSimulateScan}
              disabled={scanning}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', gap: '0.5rem' }}
            >
              <Smartphone size={18} />
              <span>{scanning ? 'Verifying Scan...' : 'Simulate Scan & Authorize Payment'}</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              <ShieldCheck size={14} />
              <span>Direct Transfer to {MY_UPI_ID}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
