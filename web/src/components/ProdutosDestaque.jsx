import { useContext, useState } from "react";
import { CarrinhoContext } from "../context/CarrinhoContext";

const ProdutosDestaque = () => {
  const { produtos, addToCart } = useContext(CarrinhoContext);
  const [addedId, setAddedId] = useState(null);

  const produtosDestaque = Array.isArray(produtos)
    ? produtos.filter((produto) => produto.destaque)
    : [];

  const handleAddToCart = (id) => {
    addToCart(id);
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <div className="produtos-destaque-container py-8">
      <h2 className="text-4xl font-extrabold text-center text-orange-900 mb-8 relative">
        Produtos em Destaque
        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-10px] w-16 h-1 bg-orange-500 rounded"></span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full px-4">
        {produtosDestaque.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            Não há produtos em destaque no momento.
          </p>
        ) : (
          produtosDestaque.map((produto, index) => (
            <div
              key={produto.id}
              className="relative flex flex-col h-full bg-white rounded-xl border border-orange-100 shadow-md hover:shadow-lg transition p-4 items-stretch justify-between min-w-[220px] max-w-xs mx-auto"
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              <div className="flex flex-col items-center flex-1">
                {produto.imagem ? (
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-32 h-32 object-contain rounded-md mb-3 border border-gray-100 bg-gray-50"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-md mb-3 text-gray-400 text-xs border border-gray-200">
                    Sem imagem
                  </div>
                )}
                <div className="font-semibold text-base text-orange-900 text-center mb-1">
                  {produto.nome}
                </div>
                <div className="text-lg font-bold text-orange-500 mb-1">
                  R${" "}
                  {typeof produto.preco === "number"
                    ? produto.preco.toFixed(2)
                    : produto.preco}
                </div>
                <div className="text-xs text-gray-600 mb-2 text-center line-clamp-2 min-h-[32px]">
                  {produto.descricao || "\u00A0"}
                </div>
              </div>
              <div className="w-full flex justify-center mt-4 mb-6">
                <button
                  onClick={() => handleAddToCart(produto.id)}
                  className="mt-auto w-full py-2 rounded-full bg-orange-400 hover:bg-orange-500 text-white font-bold text-sm shadow transition focus:outline-none focus:ring-2 focus:ring-orange-300"
                  aria-label={`Adicionar ${produto.nome} ao carrinho`}
                >
                  Adicionar ao Carrinho
                </button>
              </div>
              {addedId === produto.id && (
                <span className="absolute top-2 right-2 bg-orange-500 text-white rounded px-3 py-1 text-xs font-semibold shadow z-20 animate-fade-in">
                  Adicionado!
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProdutosDestaque;
