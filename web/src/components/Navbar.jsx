import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CarrinhoContext } from '../context/CarrinhoContext';
import { assets } from '../assets/assets';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const { getCartQuantity } = useContext(CarrinhoContext);
    const { logout, isLoggedIn, user } = useContext(AuthContext)

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };

    return (
        <div className='flex items-center justify-between py-5 font-medium'>
            {/* Logo */}
            <Link to='/'>
                <img src={assets?.logo} className='w-16' alt="Logo" onError={(e) => { e.target.onerror = null; e.target.src = 'caminho/para/imagem/default.png'; }} />
            </Link>

            {/* Links de navegação */}
            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
                {['Home', 'Produtos', 'Sobre', 'Contatos'].map((item, index) => (
                    item === 'Home' ? (
                        <Link
                            key={index}
                            to='/'
                            className='flex flex-col items-center gap-1 transition-transform transform hover:scale-110'
                        >
                            <p>{item}</p>
                        </Link>
                    ) : (
                        <NavLink
                            key={index}
                            to={`/${item.toLowerCase()}`}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 transition-transform transform hover:scale-110 ${isActive ? 'active' : ''}`
                            }
                        >
                            <p>{item}</p>
                        </NavLink>
                    )
                ))}
            </ul>

            {/* Ícones de busca, perfil, carrinho e menu */}
            <div className='flex items-center gap-6'>
                {/* Ícone de perfil */}
                <div className='group relative flex items-center gap-4'>
                    {isLoggedIn && user && (
                        <span className='hidden sm:block text-sm text-gray-700'>
                            {user.nome}
                        </span>
                    )}

                    <img
                        className='w-5 cursor-pointer transition-transform transform hover:scale-110'
                        src={assets?.profile_icon}
                        alt="Profile"
                        onClick={toggleProfileDropdown}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'caminho/para/imagem/default.png'; }}
                    />
                    {profileDropdownOpen && (
                        <div className='absolute right-0 mt-16 w-40 bg-white shadow-lg rounded-md border border-gray-200 z-10'>
                            {!isLoggedIn ? (
                                <Link
                                    to='/login'
                                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200'
                                    onClick={() => setProfileDropdownOpen(false)}
                                >
                                    Entrar
                                </Link>
                            ) : (
                                <a
                                    href="#"
                                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200'
                                    onClick={() => {
                                        logout();
                                        setProfileDropdownOpen(false);
                                    }}
                                >
                                    Sair
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Ícone de carrinho */}
                <Link to='/cart' className='relative'>
                    <img
                        src={assets?.cart_icon}
                        className='w-5 min-w-5 transition-transform transform hover:scale-110'
                        alt="Cart"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'caminho/para/imagem/default.png'; }}
                    />
                    <p className='absolute right-[5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartQuantity()}</p>
                </Link>

                {/* Ícone de menu para mobile */}
                <img
                    onClick={() => setVisible(true)}
                    src={assets?.menu_icon}
                    className='w-5 cursor-pointer sm:hidden'
                    alt="Menu"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'caminho/para/imagem/default.png'; }}
                />
            </div>

            {/* Sidebar menu */}
            <div className={`fixed top-0 right-0 bottom-0 bg-white shadow-lg transition-transform duration-300 ${visible ? 'translate-x-0' : 'translate-x-full'} w-64 z-50`}>
                <div className='flex flex-col h-full text-gray-700'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-4 cursor-pointer border-b border-gray-200'>
                        <img className='h-5 rotate-180' src={assets?.dropdown_icon} alt="Voltar" onError={(e) => { e.target.onerror = null; e.target.src = 'caminho/para/imagem/default.png'; }} />
                        <p className='text-lg font-semibold'>Voltar</p>
                    </div>
                    <ul className='flex flex-col mt-4 space-y-2 px-6'>
                        {['Home', 'Produtos', 'Sobre', 'Contatos'].map((item, index) => (
                            <NavLink
                                key={index}
                                onClick={() => setVisible(false)}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className={({ isActive }) =>
                                    `block py-2 px-4 rounded-md text-lg font-medium transition-colors duration-200 ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-orange-100 hover:text-orange-500'}`
                                }
                            >
                                {item}
                            </NavLink>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Navbar;