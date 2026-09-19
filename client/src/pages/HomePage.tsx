import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { Star, ShoppingCart, Check, Sparkles, Filter } from 'lucide-react';

export const HomePage: React.FC<{ searchKeyword?: string }> = ({ searchKeyword = '' }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [addedIds, setAddedIds] = useState<{ [key: string]: boolean }>({});
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();

  const categories = ['All', 'Audio', 'Wearables', 'Electronics', 'Accessories', 'Gaming', 'Fashion'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams();
        if (searchKeyword) query.append('keyword', searchKeyword);
        if (selectedCategory !== 'All') query.append('category', selectedCategory);
        if (sortBy) query.append('sort', sortBy);

        const { data } = await axios.get(`/api/products?${query.toString()}`);
        setProducts(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchKeyword, selectedCategory, sortBy]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    // REQUIRE LOGIN BEFORE BUYING / ADDING TO CART
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product._id]: false }));
    }, 1500);
  };

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="glass-card"
        style={{
          padding: '3rem 2.5rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(236, 72, 153, 0.15))',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ maxWidth: 600 }}>
          <div
            className="badge badge-info"
            style={{ marginBottom: '0.8rem', padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
          >
            <Sparkles size={14} /> NEW SEASON ARRIVALS 2026
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
            Elevate Your Tech & Lifestyle Experience
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '1.8rem' }}>
            Discover top-tier acoustics, smart wearables, and premium gaming gear backed by fast delivery and verified order confirmation.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#catalog" className="btn btn-primary btn-lg">
              Explore Collection
            </a>
          </div>
        </div>
      </div>

      {/* Catalog Filters Bar */}
      <div id="catalog" style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          {/* Categories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Filter size={16} style={{ color: 'var(--text-dim)' }} />
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sort:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.88rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>Loading product catalog...</div>
        </div>
      )}

      {error && (
        <div className="toast-alert toast-error" style={{ marginBottom: '2rem' }}>
          <span>{error}</span>
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <h3>No products found</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Try adjusting your search query or selected category filter.
              </p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} style={{ textDecoration: 'none' }}>
                  <div className="glass-card product-card">
                    <div className="product-img-wrapper">
                      <img src={product.image} alt={product.name} className="product-img" />
                      {product.isFeatured && (
                        <span
                          className="badge badge-info"
                          style={{ position: 'absolute', top: 12, left: 12, backdropFilter: 'blur(8px)' }}
                        >
                          Featured
                        </span>
                      )}
                      <span
                        className={`badge ${product.countInStock > 0 ? 'badge-success' : 'badge-danger'}`}
                        style={{ position: 'absolute', top: 12, right: 12, backdropFilter: 'blur(8px)' }}
                      >
                        {product.countInStock > 0 ? `${product.countInStock} In Stock` : 'Out of Stock'}
                      </span>
                    </div>

                    <div className="product-info">
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.8rem',
                          color: 'var(--warning)',
                          marginBottom: '0.4rem',
                        }}
                      >
                        <Star size={14} fill="var(--warning)" />
                        <span style={{ fontWeight: 700 }}>{product.rating}</span>
                        <span style={{ color: 'var(--text-dim)' }}>({product.numReviews})</span>
                      </div>

                      <h3 className="product-title">{product.name}</h3>
                      <p
                        style={{
                          fontSize: '0.82rem',
                          color: 'var(--text-muted)',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          display: '-webkit-box',
                          overflow: 'hidden',
                          marginBottom: '0.8rem',
                        }}
                      >
                        {product.description}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 'auto',
                        }}
                      >
                        <span className="product-price">${product.price.toFixed(2)}</span>

                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={product.countInStock === 0}
                          className={`btn ${addedIds[product._id] ? 'btn-success' : 'btn-primary'} btn-sm`}
                          style={{ gap: '0.4rem' }}
                        >
                          {addedIds[product._id] ? (
                            <>
                              <Check size={16} /> Added
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={16} /> Add
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* Auth Modal for Login Requirement */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};
