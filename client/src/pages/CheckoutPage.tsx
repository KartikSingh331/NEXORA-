import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { RazorpayModal } from '../components/RazorpayModal';
import { UpiQrModal } from '../components/UpiQrModal';
import { MapPin, CreditCard, QrCode, Truck, ArrowRight, Lock, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cartItems,
    shippingAddress,
    saveShippingAddress,
    paymentMethod,
    savePaymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address || '742 Evergreen Terrace');
  const [city, setCity] = useState(shippingAddress.city || 'Springfield');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '97477');
  const [country, setCountry] = useState(shippingAddress.country || 'United States');
  const [selectedMethod, setSelectedMethod] = useState<'Razorpay' | 'UPI_QR' | 'COD'>('Razorpay');

  // Flipkart-style COD Captcha verification
  const [captchaCode, setCaptchaCode] = useState(() => Math.floor(100 + Math.random() * 900).toString());
  const [userCaptchaInput, setUserCaptchaInput] = useState('');

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [isUpiQrOpen, setIsUpiQrOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCaptcha = () => {
    setCaptchaCode(Math.floor(100 + Math.random() * 900).toString());
    setUserCaptchaInput('');
  };

  const handleCreateOrder = async (isPaidDirect: boolean = false, paymentResultObj?: any) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    if (!address || !city || !postalCode || !country) {
      setError('Please fill in all shipping address fields');
      return;
    }

    setSubmitting(true);
    setError(null);

    const fullShippingAddress = { address, city, postalCode, country };
    saveShippingAddress(fullShippingAddress);
    savePaymentMethod(selectedMethod);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
        })),
        shippingAddress: fullShippingAddress,
        paymentMethod: selectedMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid: isPaidDirect,
        paymentResult: paymentResultObj,
      };

      const { data } = await axios.post('/api/orders', orderData);
      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    if (selectedMethod === 'Razorpay') {
      setIsRazorpayOpen(true);
    } else if (selectedMethod === 'UPI_QR') {
      setIsUpiQrOpen(true);
    } else if (selectedMethod === 'COD') {
      if (userCaptchaInput.trim() !== captchaCode) {
        setError(`Security code mismatch. Please enter "${captchaCode}" to confirm COD order.`);
        return;
      }
      handleCreateOrder(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>Checkout & Order Review</h1>

      {!user && (
        <div className="glass-card" style={{ padding: '1.2rem 1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid var(--accent-primary)' }}>
          <div>
            <h4 style={{ fontWeight: 700 }}>Account Required</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Log in or register to complete your purchase and track order status.
            </p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setIsAuthOpen(true)}>
            Sign In / Register
          </button>
        </div>
      )}

      {error && (
        <div className="toast-alert toast-error" style={{ marginBottom: '1.5rem' }}>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Shipping Address Section */}
            <div className="glass-card" style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
                <MapPin size={20} style={{ color: 'var(--accent-primary)' }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>1. Delivery Address</h2>
              </div>

              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="123 Main St, Apt 4B"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Postal / ZIP Code</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="10001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="United States"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Flipkart-style Payment Method Selector */}
            <div className="glass-card" style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
                <CreditCard size={20} style={{ color: 'var(--accent-primary)' }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>2. Select Payment Option</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Razorpay Option */}
                <div
                  onClick={() => setSelectedMethod('Razorpay')}
                  style={{
                    padding: '1.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: selectedMethod === 'Razorpay' ? 'var(--accent-primary)' : 'var(--border-color)',
                    background: selectedMethod === 'Razorpay' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ background: '#2563eb', padding: '0.4rem 0.6rem', borderRadius: 6, color: '#fff', fontWeight: 900, fontSize: '0.85rem' }}>
                      Razorpay
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700 }}>Razorpay Secure Gateway</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Credit Card, Debit Card, Netbanking, VPA</p>
                    </div>
                  </div>
                  {selectedMethod === 'Razorpay' && <CheckCircle2 size={20} style={{ color: 'var(--accent-primary)' }} />}
                </div>

                {/* UPI QR Option */}
                <div
                  onClick={() => setSelectedMethod('UPI_QR')}
                  style={{
                    padding: '1.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: selectedMethod === 'UPI_QR' ? 'var(--accent-primary)' : 'var(--border-color)',
                    background: selectedMethod === 'UPI_QR' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <QrCode size={24} style={{ color: 'var(--accent-secondary)' }} />
                    <div>
                      <h4 style={{ fontWeight: 700 }}>UPI QR Code Scanner</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instant QR scan with GPay, PhonePe, Paytm</p>
                    </div>
                  </div>
                  {selectedMethod === 'UPI_QR' && <CheckCircle2 size={20} style={{ color: 'var(--accent-primary)' }} />}
                </div>

                {/* Flipkart Cash on Delivery Option */}
                <div
                  onClick={() => setSelectedMethod('COD')}
                  style={{
                    padding: '1.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: selectedMethod === 'COD' ? 'var(--accent-primary)' : 'var(--border-color)',
                    background: selectedMethod === 'COD' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <Truck size={24} style={{ color: 'var(--warning)' }} />
                      <div>
                        <h4 style={{ fontWeight: 700 }}>Cash on Delivery (COD)</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay cash upon order delivery</p>
                      </div>
                    </div>
                    {selectedMethod === 'COD' && <CheckCircle2 size={20} style={{ color: 'var(--accent-primary)' }} />}
                  </div>

                  {/* Flipkart Security CAPTCHA verification step */}
                  {selectedMethod === 'COD' && (
                    <div style={{ marginTop: '0.5rem', background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        Flipkart-Style Order Security Confirmation:
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{ background: '#f59e0b', color: '#000', fontWeight: 900, fontSize: '1.2rem', padding: '0.3rem 0.8rem', borderRadius: 4, letterSpacing: 3 }}>
                          {captchaCode}
                        </div>
                        <button type="button" onClick={refreshCaptcha} className="btn btn-secondary btn-sm" title="Refresh code">
                          <RefreshCw size={14} />
                        </button>
                        <input
                          type="text"
                          maxLength={3}
                          className="form-input"
                          placeholder="Enter 3-digit code"
                          style={{ width: 150, textTransform: 'uppercase', fontWeight: 700, textAlign: 'center' }}
                          value={userCaptchaInput}
                          onChange={(e) => setUserCaptchaInput(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Submit */}
          <div className="glass-card" style={{ padding: '1.8rem', height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.2rem' }}>Order Summary</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.2rem' }}>
              {cartItems.map((item) => (
                <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {item.qty}x {item.name}
                  </span>
                  <span style={{ fontWeight: 700 }}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: 'var(--border-color)', margin: '0.8rem 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Express Shipping</span>
                <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Tax</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, marginTop: '0.4rem' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--accent-primary)' }}>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', gap: '0.6rem' }}
            >
              {submitting ? (
                'Processing Order...'
              ) : selectedMethod === 'Razorpay' ? (
                <>
                  <Lock size={18} />
                  <span>Pay with Razorpay (${totalPrice.toFixed(2)})</span>
                </>
              ) : selectedMethod === 'UPI_QR' ? (
                <>
                  <QrCode size={18} />
                  <span>Scan UPI QR Code</span>
                </>
              ) : (
                <>
                  <Truck size={18} />
                  <span>Confirm COD Order (${totalPrice.toFixed(2)})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Razorpay Gateway Popup Modal */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        amount={totalPrice}
        onSuccess={(payId) =>
          handleCreateOrder(true, {
            id: payId,
            status: 'COMPLETED',
            update_time: new Date().toISOString(),
            email_address: user?.email,
          })
        }
      />

      {/* UPI QR Code Scanner Modal */}
      <UpiQrModal
        isOpen={isUpiQrOpen}
        onClose={() => setIsUpiQrOpen(false)}
        amount={totalPrice}
        onSuccess={(payId) =>
          handleCreateOrder(true, {
            id: payId,
            status: 'COMPLETED',
            update_time: new Date().toISOString(),
            email_address: user?.email,
          })
        }
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};
