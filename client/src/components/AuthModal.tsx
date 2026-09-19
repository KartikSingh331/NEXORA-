import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, ShieldAlert } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIsRegister?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultIsRegister = false }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(defaultIsRegister);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isRegister) {
        await register(name, email, password, role);
        if (role === 'admin') {
          navigate('/admin');
        }
      } else {
        await login(email, password);
        if (email.toLowerCase() === 'admin@ecommerce.com') {
          navigate('/admin');
        }
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (targetRole: 'admin' | 'user') => {
    setError(null);
    setSubmitting(true);
    try {
      if (targetRole === 'admin') {
        await login('admin@ecommerce.com', 'admin123');
        onClose();
        navigate('/admin');
      } else {
        await login('user@ecommerce.com', 'user123');
        onClose();
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem', textAlign: 'center' }}>
          {isRegister ? 'Create Account' : 'Sign In'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          {isRegister
            ? 'Enter your details to register as a customer or admin'
            : 'Access your profile, orders, and delivery tracking'}
        </p>

        {error && (
          <div className="toast-alert toast-error">
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <UserIcon size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Rahul Verma"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Account Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                >
                  <option value="user">Customer Account</option>
                  <option value="admin">Store Administrator</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="email"
                required
                placeholder="user@ecommerce.com"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.8rem', padding: '0.8rem' }}
          >
            {submitting
              ? 'Authenticating...'
              : isRegister
              ? 'Register Account'
              : 'Sign In'}
          </button>
        </form>

        <div style={{ margin: '1.2rem 0', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.5px' }}>
            TEST ACCOUNT ONE-CLICK SIGN IN
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleQuickLogin('user')}
            disabled={submitting}
          >
            Customer Sign In
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleQuickLogin('admin')}
            disabled={submitting}
            style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}
          >
            Admin Sign In
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          {isRegister ? 'Already registered?' : "Don't have an account?"}{' '}
          <span
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            style={{ color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer' }}
          >
            {isRegister ? 'Sign In' : 'Create Account'}
          </span>
        </p>
      </div>
    </div>
  );
};
