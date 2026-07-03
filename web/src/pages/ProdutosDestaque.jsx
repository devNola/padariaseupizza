import React, { useContext } from 'react';
import { CarrinhoContext } from '../context/CarrinhoContext';
import ProdutoItem from '../components/ProdutoItem';
import Titulo from '../components/Titulo';

const ProdutosDestaque = () => {
    const { produtos } = useContext(CarrinhoContext);

    // Filtra apenas os produtos em destaque
    const produtosDestaque = Array.isArray(produtos)
        ? produtos.filter((produto) => produto.destaque)
        : [];

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 px-4 py-8 max-w-6xl mx-auto w-full">
                <Titulo text1="Produtos" text2="em Destaque" />
                <div className="grid produtos-destaque-grid">
                    {produtosDestaque.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">
                            Não há produtos em destaque no momento.
                        </p>
                    ) : (
                        produtosDestaque.map(item => (
                            <ProdutoItem
                                key={item.id}
                                id={String(item.id)}
                                nome={item.nome}
                                preco={item.preco}
                                imagem={item.imagem}
                                descricao={item.descricao}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProdutosDestaque;