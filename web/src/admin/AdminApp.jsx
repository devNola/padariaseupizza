import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './pages/Home';
import Produtos from './pages/Produtos';
import './App.css';

const adminTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#c65a2e', contrastText: '#fffaf4' },
    secondary: { main: '#e8a33c' },
    background: { default: '#f8f3ec', paper: '#fffdf9' },
    text: { primary: '#39231b', secondary: '#795548' },
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: { fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 },
    h5: { fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 999, fontWeight: 700 } } },
    MuiCard: { styleOverrides: { root: { border: '1px solid rgba(121, 85, 72, 0.10)', boxShadow: '0 18px 50px rgba(78, 48, 32, 0.08)' } } },
  },
});

export default function AdminApp() {
  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <Routes>
        <Route index element={<Home />} />
        <Route path="produtos" element={<Produtos />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
