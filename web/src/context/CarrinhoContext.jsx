import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

export const CarrinhoContext = createContext();

const CarrinhoContextProvider = ({ children }) => {
    const currency = 'R$';
    const delivery_fee = 5;
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        if (!savedCart) return {};

        try {
            const parsedCart = JSON.parse(savedCart);
            return parsedCart && typeof parsedCart === 'object' ? parsedCart : {};
        } catch {
            return {};
        }
    });
    const [produtos, setProdutos] = useState([]);
    const [produtosLoading, setProdutosLoading] = useState(true);
    const [produtosError, setProdutosError] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        let active = true;

        const fetchProdutos = async () => {
            setProdutosLoading(true);
            setProdutosError(false);
            try {
                const response = await api.get('/api/padaria');
                if (active) setProdutos(Array.isArray(response.data) ? response.data : []);
            } catch {
                if (active) setProdutosError(true);
            } finally {
                if (active) setProdutosLoading(false);
            }
        };

        fetchProdutos();
        return () => { active = false; };
    }, []);

    const addToCart = (itemId, size = 'default') => {
        const idStr = String(itemId);
        setCartItems((prevCartItems) => {
            const updatedCart = { ...prevCartItems };
            if (!updatedCart[idStr]) updatedCart[idStr] = { [size]: 1 };
            else if (!updatedCart[idStr][size]) updatedCart[idStr][size] = 1;
            else updatedCart[idStr][size] += 1;
            return updatedCart;
        });

        toast.success('Produto adicionado ao carrinho');
        const produto = produtos.find((item) => String(item.id) === idStr);
        if (produto) {
            api.post('/carrinho/adicionar', {
                usuario: localStorage.getItem('userName') || 'Visitante',
                nomeProduto: produto.nome,
            }).catch(() => undefined);
        }
    };

    const updateCartItemQuantity = (itemId, size, quantity) => {
        const idStr = String(itemId);
        setCartItems((prevCartItems) => {
            const updatedCart = { ...prevCartItems };
            if (updatedCart[idStr]?.[size] !== undefined) {
                updatedCart[idStr][size] += quantity;
                if (updatedCart[idStr][size] <= 0) {
                    delete updatedCart[idStr][size];
                    if (Object.keys(updatedCart[idStr]).length === 0) delete updatedCart[idStr];
                }
            }
            return updatedCart;
        });
    };

    const removeFromCart = (itemId, size = 'default') => {
        const idStr = String(itemId);
        setCartItems((prevCartItems) => {
            const updatedCart = { ...prevCartItems };
            if (updatedCart[idStr]?.[size] !== undefined) {
                delete updatedCart[idStr][size];
                if (Object.keys(updatedCart[idStr]).length === 0) delete updatedCart[idStr];
            }
            return updatedCart;
        });
    };

    const getCartTotal = () => Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
        const produto = produtos.find((item) => String(item.id) === String(itemId));
        if (!produto) return total;
        const quantity = Object.values(sizes).reduce((sum, value) => sum + Number(value || 0), 0);
        return total + quantity * Number(produto.preco || 0);
    }, 0);

    const getCartQuantity = () => Object.values(cartItems).reduce(
        (total, sizes) => total + Object.values(sizes).reduce((sum, value) => sum + Number(value || 0), 0),
        0,
    );

    const value = {
        produtos,
        produtosLoading,
        produtosError,
        currency,
        delivery_fee,
        setProdutos,
        cartItems,
        addToCart,
        updateCartItemQuantity,
        getCartTotal,
        getCartQuantity,
        removeFromCart,
    };

    return <CarrinhoContext.Provider value={value}>{children}</CarrinhoContext.Provider>;
};

export default CarrinhoContextProvider;
