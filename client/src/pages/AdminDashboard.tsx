import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Order, Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShieldCheck,
  Package,
  DollarSign,
  Truck,
  CheckCircle,
  Plus,
  Trash2,
  Edit,
  X,
  Search,
  AlertTriangle,
  RefreshCw,
  LogOut,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'analytics'>('orders');

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Add / Edit Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [countInStock, setCountInStock] = useState('15');
  const [isFeatured, setIsFeatured] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        axios.get('/api/orders'),
        axios.get('/api/products'),
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdminLogout = () => {
    clearCart();
    logout();
    navigate('/', { replace: true });
  };

  // Admin Actions: Confirm Payment & Approve Delivery
  const handleConfirmPayment = async (orderId: string) => {
    try {
      const { data } = await axios.put(`/api/orders/${orderId}/confirm-payment`);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data : o)));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to confirm payment');
    }
  };

  const handleApproveDelivery = async (orderId: string) => {
    try {
      const { data } = await axios.put(`/api/orders/${orderId}/deliver`);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data : o)));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to approve delivery');
    }
  };

  // Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setName('');
    setPrice('99.99');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800');
    setCategory('Electronics');
    setCountInStock('20');
    setIsFeatured(false);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setPrice(prod.price.toString());
    setDescription(prod.description);
    setImage(prod.image);
    setCategory(prod.category);
    setCountInStock(prod.countInStock.toString());
    setIsFeatured(Boolean(prod.isFeatured));
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/api/products/${prodId}`);
      setProducts((prev) => prev.filter((p) => p._id !== prodId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const productPayload = {
        name,
        price: parseFloat(price),
        description,
        image,
        category,
        countInStock: parseInt(countInStock, 10),
        isFeatured,
      };

      if (editingProduct) {
        const { data } = await axios.put(`/api/products/${editingProduct._id}`, productPayload);
        setProducts((prev) => prev.map((p) => (p._id === data._id ? data : p)));
      } else {
        const { data } = await axios.post('/api/products', productPayload);
        setProducts((prev) => [data, ...prev]);
      }

      setIsProductModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSavingProduct(false);
    }
  };

  // Calculate Metrics
  const totalRevenue = orders.reduce((acc, o) => (o.isPaid ? acc + o.totalPrice : acc), 0);
  const pendingDeliveries = orders.filter((o) => !o.isDelivered).length;
  const pendingPayments = orders.filter((o) => !o.isPaid).length;

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (typeof order.user === 'object' && order.user?.email.toLowerCase().includes(orderSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === 'PendingPayment') return !order.isPaid;
    if (statusFilter === 'PendingDelivery') return !order.isDelivered;
    if (statusFilter === 'Completed') return order.isPaid && order.isDelivered;
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
            <ShieldCheck size={18} />
            <span>ADMINISTRATOR CONTROL CENTER</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Store Management Dashboard
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Logged in as <strong>{user?.name || 'Admin'}</strong> ({user?.email})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <button className="btn btn-secondary btn-sm" onClick={fetchData} style={{ gap: '0.4rem' }}>
            <RefreshCw size={14} /> Refresh Data
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleAdminLogout} style={{ gap: '0.4rem' }}>
            <LogOut size={14} /> Sign Out Admin
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Revenue</span>
            <DollarSign size={22} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)' }}>
            ${totalRevenue.toFixed(2)}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Orders</span>
            <Package size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{orders.length}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pending Deliveries</span>
            <Truck size={22} style={{ color: 'var(--warning)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--warning)' }}>
            {pendingDeliveries}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pending Payments</span>
            <AlertTriangle size={22} style={{ color: 'var(--danger)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--danger)' }}>
            {pendingPayments}
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', gap: '0.8rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.8rem', paddingBottom: '0.8rem' }}>
        <button
          onClick={() => setActiveTab('orders')}
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Products Inventory ({products.length})
        </button>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '3rem 0' }}>Loading dashboard contents...</div>}

      {error && (
        <div className="toast-alert toast-error" style={{ marginBottom: '1.5rem' }}>
          <span>{error}</span>
        </div>
      )}

      {/* TAB 1: ORDERS MANAGEMENT */}
      {!loading && activeTab === 'orders' && (
        <div>
          {/* Order Search & Filter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ maxWidth: 360 }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Filter by Order ID or User email..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setStatusFilter('All')}
                className={`btn btn-sm ${statusFilter === 'All' ? 'btn-primary' : 'btn-secondary'}`}
              >
                All Orders
              </button>
              <button
                onClick={() => setStatusFilter('PendingPayment')}
                className={`btn btn-sm ${statusFilter === 'PendingPayment' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Unpaid
              </button>
              <button
                onClick={() => setStatusFilter('PendingDelivery')}
                className={`btn btn-sm ${statusFilter === 'PendingDelivery' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Undelivered
              </button>
              <button
                onClick={() => setStatusFilter('Completed')}
                className={`btn btn-sm ${statusFilter === 'Completed' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Completed
              </button>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <h3>No matching orders found</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="glass-card"
                  style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Order #{order._id}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Customer:{' '}
                        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                          {typeof order.user === 'object' ? `${order.user.name} (${order.user.email})` : 'User'}
                        </span>{' '}
                        • Placed {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-pending'}`}>
                        {order.isPaid ? 'PAID' : 'UNPAID'}
                      </span>
                      <span className={`badge ${order.isDelivered ? 'badge-success' : 'badge-info'}`}>
                        {order.isDelivered ? 'DELIVERED' : 'PENDING DELIVERY'}
                      </span>
                      <div style={{ fontWeight: 800, fontSize: '1.2rem', marginLeft: '0.8rem' }}>
                        ${order.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
                    {order.orderItems.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: 'var(--bg-input)',
                          padding: '0.4rem 0.8rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.82rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <img src={item.image} alt={item.name} style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'cover' }} />
                        <span>
                          {item.qty}x {item.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Admin Action Control Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem' }}>
                    {!order.isPaid ? (
                      <button
                        onClick={() => handleConfirmPayment(order._id)}
                        className="btn btn-success btn-sm"
                        style={{ gap: '0.4rem' }}
                      >
                        <CheckCircle size={16} /> Confirm Payment (Admin)
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.82rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}>
                        <CheckCircle size={14} /> Payment Confirmed
                      </span>
                    )}

                    {!order.isDelivered ? (
                      <button
                        onClick={() => handleApproveDelivery(order._id)}
                        className="btn btn-primary btn-sm"
                        style={{ gap: '0.4rem' }}
                      >
                        <Truck size={16} /> Approve & Mark Delivered
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.82rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}>
                        <Truck size={14} /> Delivery Approved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS INVENTORY */}
      {!loading && activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Store Inventory</h2>
            <button className="btn btn-primary" onClick={handleOpenAddProduct} style={{ gap: '0.5rem' }}>
              <Plus size={18} /> Add New Product
            </button>
          </div>

          <div className="product-grid">
            {products.map((prod) => (
              <div key={prod._id} className="glass-card product-card">
                <div className="product-img-wrapper">
                  <img src={prod.image} alt={prod.name} className="product-img" />
                  <span className={`badge ${prod.countInStock > 0 ? 'badge-success' : 'badge-danger'}`} style={{ position: 'absolute', top: 10, right: 10 }}>
                    Stock: {prod.countInStock}
                  </span>
                </div>

                <div className="product-info">
                  <span className="badge badge-info" style={{ width: 'fit-content', marginBottom: '0.4rem' }}>
                    {prod.category}
                  </span>
                  <h3 className="product-title">{prod.name}</h3>
                  <div className="product-price">${prod.price.toFixed(2)}</div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      onClick={() => handleOpenEditProduct(prod)}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, gap: '0.4rem' }}
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod._id)}
                      className="btn btn-danger btn-sm"
                      style={{ gap: '0.4rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="modal-overlay" onClick={() => setIsProductModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <button
              onClick={() => setIsProductModalOpen(false)}
              style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.2rem' }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="form-input"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Fashion">Fashion</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Count In Stock</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  required
                  className="form-input"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  required
                  className="form-input"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <label htmlFor="featuredCheck" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                  Mark as Featured Product on Homepage
                </label>
              </div>

              <button
                type="submit"
                disabled={savingProduct}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                {savingProduct ? 'Saving Product...' : editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
