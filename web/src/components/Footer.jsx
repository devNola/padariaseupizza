import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Footer = ({ className }) => {
    return (
        <footer className={className}>
            <div className='container mx-auto px-6 flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14'>

                {/* Logo e descrição */}
                <div>
                    <img src={assets.logo} className='mb-6 w-31' alt="Logo da Padaria" />
                    <p className='w-full md:w-2/3'>
                        Desde o início, nossa padaria se dedicou a criar pães e doces com
                        sabor autêntico e ingredientes selecionados. Com um toque artesanal e
                        uma paixão por qualidade, buscamos oferecer experiências que
                        encantam a cada mordida.
                    </p>
                </div>

                {/* Links rápidos */}
                <div>
                    <p className='text-xl font-semibold mb-5'>Padaria</p>
                    <ul className='flex flex-col gap-2'>
                        <li>
                            <Link to="/" className='hover:text-gray-200 transition-colors'>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/produtos" className='hover:text-gray-200 transition-colors'>
                                Produtos
                            </Link>
                        </li>
                        <li>
                            <Link to="/sobre" className='hover:text-gray-200 transition-colors'>
                                Sobre
                            </Link>
                        </li>
                        <li>
                            <Link to="/contatos" className='hover:text-gray-200 transition-colors'>
                                Contatos
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contatos */}
                <div>
                    <p className='text-xl font-semibold mb-5'>Contatos</p>
                    <ul className='flex flex-col gap-2'>
                        <li>
                            <FontAwesomeIcon icon={faWhatsapp} style={{ color: '#25D366' }} />{' '}
                            <span className='font-medium'>Telefone 1:</span> (53) 9 8488-1060
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faWhatsapp} style={{ color: '#25D366' }} />{' '}
                            <span className='font-medium'>Telefone 2:</span> (53) 9 8458-4818
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faEnvelope} style={{ color: '#333' }} />{' '}
                            <span className='font-medium'>Email:</span> padariaseupizza@gmail.com
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
