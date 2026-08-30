import { createContext, useEffect, useState } from 'react';
import { getUser } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')));
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(localStorage.getItem('userType') || null);
  const [authLoading, setAuthLoading] = useState(Boolean(localStorage.getItem('token')));

  useEffect(() => {
    const syncSession = () => {
      const hasToken = Boolean(localStorage.getItem('token'));
      setIsLoggedIn(hasToken);
      setUserType(localStorage.getItem('userType') || null);
      if (!hasToken) setAuthLoading(false);
    };

    syncSession();
    window.addEventListener('storage', syncSession);
    return () => window.removeEventListener('storage', syncSession);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('nome');
    localStorage.removeItem('email');
    setUser(null);
    setUserType(null);
    setIsLoggedIn(false);
    setAuthLoading(false);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setUser(null);
      setAuthLoading(false);
      return undefined;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      logout();
      return undefined;
    }

    setAuthLoading(true);
    getUser(token)
      .then((data) => {
        const resolvedType = data.userType === 'admin' ? 'admin' : 'cliente';
        setUser(data);
        setUserType(resolvedType);
        localStorage.setItem('userType', resolvedType);
        if (data.nome) localStorage.setItem('userName', data.nome);
      })
      .catch(() => {
        logout();
      })
      .finally(() => setAuthLoading(false));

    return undefined;
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout, user, userType, setUserType, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
