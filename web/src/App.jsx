import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Produtos from './pages/Produtos';
import Contatos from './pages/Contatos';
import Sobre from './pages/Sobre';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Fazerpedido from './pages/Fazerpedido';
import Pedido from './pages/Pedido';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminApp from './admin/AdminApp';
import ProtectedAdminRoute from './admin/ProtectedAdminRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const location = useLocation();
  const isLoginRoute = location.pathname === '/login';
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      {!isLoginRoute && !isAdminRoute && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/produtos' element={<Produtos />} />
        <Route path='/sobre' element={<Sobre />} />
        <Route path='/contatos' element={<Contatos />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/fazerpedido' element={<Fazerpedido />} />
        <Route path='/pedido' element={<Pedido />} />
        <Route path='/admin/*' element={<ProtectedAdminRoute><AdminApp /></ProtectedAdminRoute>} />
      </Routes>

      {!isLoginRoute && !isAdminRoute && <Footer />}
    </div>
  );
};

export default App;
