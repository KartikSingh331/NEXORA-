import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { Trash2, ArrowLeft, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleProceedToCheckout = () => {
    // REQUIRE LOGIN BEFORE BUYING / CHECKOUT
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: 600, margin: '2rem auto' }}>
        <ShoppingBag size={56} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Your Shopping Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', margin: '0.8rem 0 2rem' }}>
          Looks like you haven't added any premium products to your cart yet.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          <ArrowLeft size={18} /> Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Shopping Cart ({cartItems.length} items)</h1>
        <button onClick={clearCart} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)' }}>
          <Trash2 size={16} /> Clear Cart
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        {/* Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="glass-card"
              style={{
                padding: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.2rem',
                justifyContent: 'space-between',
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
              />

              <div style={{ flex: 1 }}>
                <Link
                  to={`/product/${item.product}`}
                  style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}
                >
                  {item.name}
                </Link>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  ${item.price.toFixed(2)} each
                </div>
              </div>

              {/* Quantity modifier */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                <button
                  className="btn"
                  style={{ padding: '0.3rem 0.6rem' }}
                  onClick={() => updateQuantity(item.product, item.qty - 1)}
                >
                  -
                </button>
                <span style={{ padding: '0 0.8rem', fontWeight: 700, fontSize: '0.9rem' }}>{item.qty}</span>
                <button
                  className="btn"
                  style={{ padding: '0.3rem 0.6rem' }}
                  onClick={() => updateQuantity(item.product, item.qty + 1)}
                >
                  +
                </button>
              </div>

              <div style={{ fontWeight: 800, fontSize: '1.1rem', minWidth: 90, textAlign: 'right' }}>
                ${(item.price * item.qty).toFixed(2)}
              </div>

              <button
                onClick={() => removeFromCart(item.product)}
                className="btn"
                style={{ color: 'var(--text-dim)' }}
                title="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="glass-card" style={{ padding: '1.8rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.2rem' }}>Order Summary</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
              <span style={{ fontWeight: 700 }}>${itemsPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
              <span style={{ fontWeight: 700 }}>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Tax (8%)</span>
              <span style={{ fontWeight: 700 }}>${taxPrice.toFixed(2)}</span>
            </div>
            <div style={{ height: 1, background: 'var(--border-color)', margin: '0.4rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800 }}>
              <span>Total Price</span>
              <span style={{ color: 'var(--accent-primary)' }}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', gap: '0.6rem' }}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            <ShieldCheck size={14} />
            <span>Simulated & Secure Payment Verification</span>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};
