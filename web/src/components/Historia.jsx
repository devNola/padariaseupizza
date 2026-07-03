import React from 'react';
import { assets } from '../assets/assets';
import Mapa from './Mapa';

const Historia = () => {
    return (
        <div className="bg-white py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
                    {/* Texto à esquerda - versão profissional */}
                    <div className="lg:w-1/2 w-full">
                        <div className="mb-2">
                            <span className="inline-block w-12 h-1 bg-amber-600 mb-2"></span>
                            <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wider">Nossa Tradição</h3>
                        </div>

                        <h2 className="text-xl md:text-4xl font-bold text-gray-900 mb-6">
                            A História da <span className="text-amber-700">Padaria Seu Pizza</span>
                        </h2>

                        <div className="prose max-w-none text-gray-700 space-y-4">
                            <p className="text-lg leading-relaxed">
                                Desde o início, nossa padaria se dedicou a criar pães e doces com
                                sabor autêntico e ingredientes selecionados. Com um toque artesanal e
                                uma paixão por qualidade, buscamos oferecer experiências que
                                encantam a cada mordida.
                            </p>

                            <p className="text-lg leading-relaxed">
                                Cada produto que sai de nossos fornos carrega não apenas qualidade, mas toda uma herança
                                familiar. Utilizamos técnicas centenárias aliadas a rigorosos padrões de higiene e
                                controle de qualidade.
                            </p>

                            <div className="mt-6 border-l-4 border-amber-200 pl-4">
                                <p className="text-gray-600 italic">
                                    "O segredo está na paciência - um bom pão precisa de tempo,
                                    assim como boas histórias precisam ser contadas."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Imagem à direita - versão profissional */}
                    <div className="lg:w-1/2 w-full">
                        <div className="relative">
                            <img
                                src={assets.historiafoto}
                                alt="Interior profissional da padaria"
                                className="w-full h-auto max-w-md mx-auto rounded-lg shadow-md object-cover"
                            />
                            <div className="absolute -bottom-4 -right-4 bg-white px-6 py-3 shadow-lg rounded-lg border border-gray-100">
                                <p className="text-sm font-medium text-gray-800">Padaria Seu Pizza • Desde 2021</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Mapa />
        </div>
    );
}

export default Historia;