import { useState, useEffect, useContext, useCallback } from 'react';
import { CarrinhoContext } from '../context/CarrinhoContext';
import Titulo from '../components/Titulo';
import { Button, TextField, Snackbar, Backdrop, CircularProgress } from '@mui/material'; // Importação do Backdrop e CircularProgress
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Cart = () => {
  const { produtos, cartItems, updateCartItemQuantity, getCartTotal, removeFromCart, delivery_fee } = useContext(CarrinhoContext);
  const [cartData, setCartData] = useState([]);
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [mensagemDesconto, setMensagemDesconto] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o Backdrop
  const [descontoAtivo, setDescontoAtivo] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(AuthContext);

  useEffect(() => {
    const tempData = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          tempData.push({
            id: itemId,
            size: size,
            quantidade: cartItems[itemId][size],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  const handleIncreaseQuantity = (itemId, size) => {
    updateCartItemQuantity(itemId, size, 1);
  };

  const handleDecreaseQuantity = (itemId, size) => {
    if (cartItems[itemId][size] > 1) {
      updateCartItemQuantity(itemId, size, -1);
    } else {
      toast.info('A quantidade mínima é 1. Use o botão "Remover" para excluir o item.');
    }
  };

  const handleRemoveItem = (itemId, size) => {
    removeFromCart(itemId, size);
    toast.success('Item removido do carrinho!');
  };

  const handleApplyCep = useCallback((cep) => {
    if (cep.length === 9) {
      localStorage.setItem('cep', cep);
      fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.erro) {
            setEndereco(`${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);
            setMensagemDesconto(`Desconto realizado: R$ ${delivery_fee.toFixed(2)}`);
            setDescontoAtivo(true); // Ativa o desconto
          } else {
            setEndereco('');
            setMensagemDesconto('');
            setDescontoAtivo(false); // Remove o desconto
            toast.error('CEP não encontrado.');
          }
        })
        .catch(() => {
          setEndereco('');
          setMensagemDesconto('');
          setDescontoAtivo(false); // Remove o desconto
          toast.error('Erro ao buscar o CEP.');
        });
    } else {
      toast.error('Digite um CEP válido no formato 00000-000.');
    }
  }, [delivery_fee]);

  useEffect(() => {
    const savedCep = localStorage.getItem('cep');

    if (savedCep) {
      setCep(savedCep);
      handleApplyCep(savedCep);
    }
  }, [handleApplyCep]);

  const handleFinalizePurchase = async () => {
    if (!isLoggedIn) {
      navigate({
        pathname: '/login',
        search: `?redirect=${encodeURIComponent(window.location.pathname)}`
      })
      return;
    }

    const total = getCartTotal();
    const totalFinal = descontoAtivo ? total - delivery_fee : total;
    const produtosMensagem = cartData
      .map((item) => {
        const produto = produtos.find((p) => String(p.id) === String(item.id));
        if (!produto) return '';
        return `* ${produto.nome} (${item.quantidade}x) - R$ ${(produto.preco * item.quantidade).toFixed(2)}`;
      })
      .join('\n');

    // Monta array de produtos para a API
    const produtosParaApi = cartData.map((item) => {
      const produto = produtos.find((p) => String(p.id) === String(item.id));
      return {
        nome: produto ? produto.nome : 'Produto',
        qtd: item.quantidade,
        preco: produto ? produto.preco : 0
      };
    });

    setIsLoading(true);
    try {
      await api.post('/carrinho/finalizar', {
        usuario: localStorage.getItem('userName') || 'Visitante',
        produtos: produtosParaApi,
        precoFinal: totalFinal,
        endereco: endereco ? `CEP: ${cep}, ${endereco}` : `CEP: ${cep}`,
        nomeCliente: localStorage.getItem('userName') || 'Visitante',
      });
    } catch {
      setIsLoading(false);
      toast.error('Não foi possível registrar o pedido. Tente novamente.');
      return;
    }

    // Busca o nome do cliente logado do contexto, se disponível
    let nomeCliente = 'Visitante';
    if (user && user.nome) {
      nomeCliente = user.nome;
    } else if (localStorage.getItem('userName')) {
      nomeCliente = localStorage.getItem('userName');
    }

    setTimeout(() => {
      setIsLoading(false);
      // Monta mensagem sem linha em branco extra após "Itens do pedido:"
      let mensagemWhatsapp =
        `Olá, tudo bem? Me chamo ${nomeCliente} e gostaria de realizar um pedido:\n` +
        `Itens do pedido:\n${produtosMensagem}\n` +
        (descontoAtivo ? `\nDesconto aplicado: R$ ${delivery_fee.toFixed(2)}\n` : '') +
        `Total do pedido: R$ ${totalFinal.toFixed(2)}\n` +
        `Endereço de entrega: CEP: ${cep}${endereco ? `, ${endereco}` : ''}\n` +
        `\nAguardo a confirmação. Obrigado!`;
      window.open(`https://wa.me/53984881060?text=${encodeURIComponent(mensagemWhatsapp)}`, '_blank');
      setIsSnackbarOpen(true);
    }, 2000);
  };

  const handleCloseSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  const total = getCartTotal();
  const totalComDesconto = descontoAtivo ? total - delivery_fee : total;

  const handleCepChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      const formattedCep = value.replace(/(\d{5})(\d{3})/, '$1-$2');
      setCep(formattedCep);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="border-t pt-10 flex flex-col flex-grow">
        <div className="text-left px-4 sm:px-10 mb-6">
          <Titulo text1="Seu" text2="Carrinho" />
        </div>
        <div className="flex flex-col lg:flex-row gap-10 px-4 sm:px-10">
          {/* Lista de produtos */}
          <div className="flex-grow">
            {cartData.map((item, index) => {
              const produtoData = produtos.find((produto) => String(produto.id) === String(item.id));
              if (!produtoData) return null;

              const itemTotalPrice = (produtoData.preco || 0) * item.quantidade;

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-center border border-gray-200 mb-4"
                >
                  <img
                    className="w-32 h-32 object-cover rounded-md mb-4 sm:mb-0 sm:mr-4"
                    src={produtoData.imagem || 'https://via.placeholder.com/150'}
                    alt={produtoData.nome || 'Produto sem nome'}
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-lg text-orange-900">{produtoData.nome}</p>
                    <p className="text-sm text-gray-500 mt-1">{produtoData.descricao || 'Sem descrição.'}</p>
                    <p className="font-bold text-orange-700 text-lg mt-2">R$ {itemTotalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecreaseQuantity(item.id, item.size)}
                      className="w-8 h-8 rounded bg-orange-100 hover:bg-orange-200 text-orange-700 text-xl flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="mx-2 font-medium text-lg">{item.quantidade}</span>
                    <button
                      onClick={() => handleIncreaseQuantity(item.id, item.size)}
                      className="w-8 h-8 rounded bg-orange-100 hover:bg-orange-200 text-orange-700 text-xl flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id, item.size)}
                    className="mt-4 sm:mt-0 sm:ml-4 text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remover
                  </button>
                </div>
              );
            })}
            {cartData.length === 0 && (
              <p className="text-center text-gray-600 mt-4">Seu carrinho está vazio.</p>
            )}
          </div>

          {/* Resumo do pedido */}
          <div className="lg:w-1/3 bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">Total do Carrinho</h2>
            <div className="mb-4">
              <label htmlFor="cep" className="text-sm font-medium text-gray-700">
                CEP:
              </label>
              <div className="flex items-center gap-2 mt-2">
                <TextField
                  id="cep"
                  value={cep}
                  onChange={handleCepChange}
                  variant="outlined"
                  placeholder="Digite seu CEP"
                  size="small"
                  className="flex-grow"
                />
                <Button
                  onClick={() => handleApplyCep(cep)}
                  variant="contained"
                  style={{ backgroundColor: '#FFA500', color: '#fff' }}
                  size="small"
                >
                  Adicionar
                </Button>
              </div>
              {endereco && <p className="text-sm text-gray-500 mt-2">{endereco}</p>}
              {mensagemDesconto && <p className="text-sm text-green-600 mt-2">{mensagemDesconto}</p>}
            </div>
            <p className="text-lg font-semibold text-orange-700 text-center mb-4">
              R$ {totalComDesconto.toFixed(2)}
            </p>
            <Button
              onClick={handleFinalizePurchase}
              variant="contained"
              style={{ backgroundColor: '#FFA500', color: '#fff' }}
              fullWidth
              disabled={!cep || !endereco}
            >
              {isLoggedIn ? 'Finalizar Compra' : 'Fazer Login para Finalizar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Backdrop com indicador de carregamento */}
      <Backdrop open={isLoading} style={{ zIndex: 1300, color: '#fff' }}>
        <CircularProgress color="inherit" />
        <p style={{ marginLeft: '10px' }}>Encaminhando para o WhatsApp...</p>
      </Backdrop>

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Pedido finalizado com sucesso!"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </div>
  );
};

export default Cart;
