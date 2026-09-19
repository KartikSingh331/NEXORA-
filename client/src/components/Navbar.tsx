import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { AuthModal } from './AuthModal';
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  PackageCheck,
  Sun,
  Moon,
} from 'lucide-react';

interface NavbarProps {
  onSearch?: (term: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const { itemCount, clearCart } = useCart();
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = () => {
    setShowDropdown(false);
    clearCart();
    logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="brand-logo">
            <ShoppingBag size={26} style={{ color: 'var(--accent-primary)' }} />
            <span>NEXORA</span>
          </Link>

          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Search headphones, smartwatches, gear..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </form>

          <div className="nav-actions">
            <button
              onClick={toggleTheme}
              className="btn btn-secondary btn-sm"
              title="Toggle theme"
              style={{ borderRadius: '50%', width: 38, height: 38, padding: 0 }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link to="/cart" className="cart-link">
              <ShoppingCart size={22} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Cart</span>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>

            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ gap: '0.5rem' }}
                >
                  <UserIcon size={18} />
                  <span>{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
                      ADMIN
                    </span>
                  )}
                </button>

                {showDropdown && (
                  <div
                    className="glass-card"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '110%',
                      width: 220,
                      padding: '0.6rem',
                      zIndex: 200,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem',
                    }}
                    onClick={() => setShowDropdown(false)}
                  >
                    <Link
                      to="/orders"
                      style={{
                        padding: '0.6rem 0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}
                    >
                      <PackageCheck size={18} />
                      <span>My Orders</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        style={{
                          padding: '0.6rem 0.8rem',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: 'var(--accent-primary)',
                          background: 'rgba(99, 102, 241, 0.1)',
                        }}
                      >
                        <ShieldCheck size={18} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div style={{ height: 1, background: 'var(--border-color)', margin: '0.3rem 0' }} />

                    <button
                      onClick={handleLogout}
                      style={{
                        padding: '0.6rem 0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--danger)',
                        width: '100%',
                        textAlign: 'left',
                      }}
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn btn-primary" onClick={() => setIsAuthOpen(true)}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};
