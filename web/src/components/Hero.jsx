import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

export const Hero = () => {
    return (
        <section className="hero-shell relative overflow-hidden border-b border-amber-200 bg-gradient-to-b from-orange-50 to-white">
            {/* Imagem principal */}
            <div className="w-full relative">
                <img
                    className="w-full h-[220px] sm:h-[400px] md:h-[320px] lg:h-[400px] xl:h-[600px] object-cover object-center rounded-b-3xl shadow-lg"
                    src={assets.foto_padaria}
                    alt="Padaria artesanal com variedade de pães frescos"
                />

                {/* Overlay com gradiente duplo */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-100/10 via-transparent to-transparent"></div>
                </div>

                {/* Conteúdo do carrossel */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4 max-w-4xl">
                        {/* Elementos decorativos animados */}
                        <div className="flex justify-center gap-6 mb-6 opacity-90 animate-pulse">
                            <span className="text-amber-300 text-2xl drop-shadow-lg">•</span>
                            <span className="text-rose-300 text-2xl drop-shadow-lg">•</span>
                            <span className="text-green-300 text-2xl drop-shadow-lg">•</span>
                        </div>

                        {/* Título principal */}
                                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 font-serif leading-tight drop-shadow-xl">

                            <span className="text-amber-300">Pães Artesanais</span> Feitos com Tradição
                        </h1>

                        {/* Subtítulo */}
                        <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed text-amber-50 drop-shadow">
                            Pães, doces e salgados preparados diariamente para deixar seu dia mais gostoso.
                        </p>

                        {/* Botão de ação */}
                        <Link
                            to="/produtos"
                            className="inline-block bg-amber-400 hover:bg-amber-500 text-brown-900 font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-200 text-lg"
                        >
                            Ver Produtos
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};