import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { Star, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw, Check } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    // REQUIRE LOGIN BEFORE BUYING / ADDING TO CART
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    if (product) {
      addToCart(product, qty);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    // REQUIRE LOGIN BEFORE BUYING
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    if (product) {
      addToCart(product, qty);
      navigate('/cart');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem 0' }}>Loading product details...</div>;
  }

  if (error || !product) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: 600, margin: '2rem auto' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>{error}</p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/"
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center' }}
      >
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {/* Image */}
          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-input)' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', maxHeight: 450 }}
            />
          </div>

          {/* Product Details */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.8rem' }}>
              <span className="badge badge-info">{product.category}</span>
              <span className={`badge ${product.countInStock > 0 ? 'badge-success' : 'badge-danger'}`}>
                {product.countInStock > 0 ? `${product.countInStock} Available` : 'Out of Stock'}
              </span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.8rem' }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', color: 'var(--warning)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.floor(product.rating) ? 'var(--warning)' : 'none'}
                    stroke="var(--warning)"
                  />
                ))}
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{product.rating}</span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>({product.numReviews} customer reviews)</span>
            </div>

            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '1.2rem' }}>
              ${product.price.toFixed(2)}
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            {/* Quantity Selector */}
            {product.countInStock > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.8rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Quantity:</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  <button
                    className="btn"
                    style={{ padding: '0.5rem 0.8rem' }}
                    onClick={() => setQty(Math.max(1, qty - 1))}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 1rem', fontWeight: 700 }}>{qty}</span>
                  <button
                    className="btn"
                    style={{ padding: '0.5rem 0.8rem' }}
                    onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <button
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className={`btn ${isAdded ? 'btn-success' : 'btn-primary'} btn-lg`}
                style={{ flex: 1, minWidth: 180 }}
              >
                {isAdded ? (
                  <>
                    <Check size={20} /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.countInStock === 0}
                className="btn btn-secondary btn-lg"
                style={{ flex: 1, minWidth: 180 }}
              >
                Buy Now
              </button>
            </div>

            {/* Guarantees */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <Truck size={18} style={{ color: 'var(--accent-primary)' }} />
                <span>Free express delivery on orders over $100</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={18} style={{ color: 'var(--success)' }} />
                <span>Admin delivery approval & order verification</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <RotateCcw size={18} style={{ color: 'var(--warning)' }} />
                <span>30-day effortless return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};
