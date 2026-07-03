import React, { useContext, useState, useCallback } from 'react';
import { CarrinhoContext } from '../context/CarrinhoContext';

const ProdutoItem = ({ id, imagem, nome, preco, descricao }) => {
    const { currency, addToCart } = useContext(CarrinhoContext);
    const [notification, setNotification] = useState(false);

    // Imagem com fallback
    const imagemSrc = imagem || 'https://via.placeholder.com/150';

    const handleAddToCart = useCallback(() => {
        addToCart(id, 'default');
        setNotification(true);
        setTimeout(() => setNotification(false), 1200);
    }, [addToCart, id]);

    return (
        <div className="relative flex flex-col h-full bg-white rounded-xl border border-orange-100 shadow-md hover:shadow-lg transition p-4 items-stretch justify-between min-w-[220px] max-w-xs mx-auto">
            <div className="flex flex-col items-center flex-1">
                <img
                    src={imagemSrc}
                    alt={nome}
                    className="w-32 h-32 object-contain rounded-md mb-3 border border-gray-100 bg-gray-50"
                    loading="lazy"
                />
                <div className="font-semibold text-base text-orange-900 text-center mb-1">{nome}</div>
                <div className="text-lg font-bold text-orange-500 mb-1">{currency || 'R$'}{Number(preco).toFixed(2)}</div>
                <div className="text-xs text-gray-600 mb-2 text-center line-clamp-2 min-h-[32px]">
                  {descricao ? descricao : '\u00A0'}
                </div>
            </div>
            <button
                className="mt-auto w-full py-2 rounded-full bg-orange-400 hover:bg-orange-500 text-white font-bold text-sm shadow transition focus:outline-none focus:ring-2 focus:ring-orange-300"
                onClick={handleAddToCart}
                aria-label={`Adicionar ${nome} ao carrinho`}
            >
                Adicionar ao Carrinho
            </button>
            {notification && (
                <span className="absolute top-2 right-2 bg-orange-500 text-white rounded px-3 py-1 text-xs font-semibold shadow z-20 animate-fade-in">
                    Adicionado!
                </span>
            )}
        </div>
    );
};

export default ProdutoItem;
