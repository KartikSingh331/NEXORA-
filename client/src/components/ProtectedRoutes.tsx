import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface RouteProps {
  children: React.ReactNode;
}

// Protected Route for any logged in user
export const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem 0' }}>Verifying session...</div>;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Admin Route strictly for Admin users
export const AdminRoute: React.FC<RouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem 0' }}>Verifying admin authorization...</div>;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    return (
      <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: 540, margin: '3rem auto' }}>
        <ShieldAlert size={56} style={{ color: 'var(--danger)', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)', margin: '0.8rem 0 2rem' }}>
          You do not have administrator privileges to access this area.
        </p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
          <ArrowLeft size={16} /> Return to Storefront
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
