import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedAdminRoute({ children }) {
  const location = useLocation();
  const { isLoggedIn, userType, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-orange-50 px-6 text-center text-stone-700">
        Validando acesso ao painel...
      </main>
    );
  }

  if (!isLoggedIn || userType !== 'admin') {
    const redirect = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />;
  }

  return children;
}
