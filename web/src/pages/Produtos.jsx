import React, { useContext, useState, useEffect } from 'react';
import { CarrinhoContext } from '../context/CarrinhoContext';
import ProdutoItem from '../components/ProdutoItem';
import Titulo from '../components/Titulo';
import { assets } from '../assets/assets';

const Produtos = () => {
  const { produtos, produtosLoading, produtosError } = useContext(CarrinhoContext);
  const [showFilter, setShowFilter] = useState(false);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [produtosParaExibir, setProdutosParaExibir] = useState(produtos);

  useEffect(() => {
    let produtosFiltrados = produtos;

    // filtrar por categoria
    if (categoriasSelecionadas.length > 0) {
      produtosFiltrados = produtos.filter(p =>
        categoriasSelecionadas.includes(p.categoria)
      );
    }

    // ordenação numérica
    if (sortType === 'low-high') {
      produtosFiltrados = [...produtosFiltrados].sort(
        (a, b) => Number(a.preco) - Number(b.preco)
      );
    } else if (sortType === 'high-low') {
      produtosFiltrados = [...produtosFiltrados].sort(
        (a, b) => Number(b.preco) - Number(a.preco)
      );
    }

    setProdutosParaExibir(produtosFiltrados);
  }, [produtos, categoriasSelecionadas, sortType]);

  const toggleCategoria = e => {
    const cat = e.target.value;
    setCategoriasSelecionadas(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t flex-grow'>
        {/* Filtro de Opções */}
        <div className='min-w-60'>
          <p className='my-2 text-xl flex items-center cursor-pointer gap-2' onClick={() => setShowFilter(!showFilter)}>
            Filtros
            <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="Dropdown icon" />
          </p>
          {/* Filtro de Categorias */}
          <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
            <p className='mb-3 text-sm font-medium'>Categorias</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
              <label className='flex gap-2'>
                <input
                  type="checkbox"
                  value="Salgados"                         // <-- plural
                  checked={categoriasSelecionadas.includes("Salgados")}
                  onChange={toggleCategoria}
                /> Salgados
              </label>
              <label className='flex gap-2'>
                <input
                  type="checkbox"
                  value="Doces"                            // <-- plural
                  checked={categoriasSelecionadas.includes("Doces")}
                  onChange={toggleCategoria}
                /> Doces
              </label>
              <label className='flex gap-2'>
                <input
                  type="checkbox"
                  value="Pães"
                  checked={categoriasSelecionadas.includes("Pães")}
                  onChange={toggleCategoria}
                /> Pães
              </label>
            </div>
          </div>
        </div>

        {/* Produtos */}
        <div className='flex-1'>
          <div className='flex justify-between text-base sm:text-2xl mb-4'>
            <Titulo text1="Nossos" text2="Produtos" />
            {/* Ordenação */}
            <select onChange={e => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
              <option value="relevant">Mais vendidos</option>
              <option value="low-high">Menor → Maior</option>
              <option value="high-low">Maior → Menor</option>
            </select>
          </div>

          {/* Lista de Produtos */}
          {produtosLoading && (
            <div className='rounded-2xl border border-orange-100 bg-orange-50/70 p-8 text-center text-stone-600'>Carregando os produtos fresquinhos do dia...</div>
          )}
          {!produtosLoading && produtosError && (
            <div className='rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-800'>
              <p className='font-semibold'>Não foi possível carregar o catálogo agora.</p>
              <p className='mt-1 text-sm'>Atualize a página ou fale conosco pelo telefone.</p>
            </div>
          )}
          {!produtosLoading && !produtosError && produtosParaExibir.length === 0 && (
            <div className='rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-8 text-center text-stone-600'>
              <p className='font-semibold'>Nenhum produto encontrado.</p>
              <p className='mt-1 text-sm'>Tente outra categoria ou limpe os filtros.</p>
            </div>
          )}
          {!produtosLoading && !produtosError && produtosParaExibir.length > 0 && (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
            {produtosParaExibir.map(item => (
              <ProdutoItem
                key={item.id}
                id={String(item.id)}
                nome={item.nome}
                preco={item.preco}
                imagem={item.imagem}
                descricao={item.descricao} // <-- Adiciona a descrição aqui
              />
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Produtos;
