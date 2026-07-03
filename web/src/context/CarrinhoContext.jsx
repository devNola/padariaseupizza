import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const CarrinhoContext = createContext();

const CarrinhoContextProvider = (props) => {
    const currency = 'R$';
    const delivery_fee = 5;
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        
        if (!savedCart) return {};

        try {
            const parsedCart = JSON.parse(savedCart);
            return parsedCart;
        } catch (error) {
            console.error("Erro ao analisar o carrinho do localStorage:", error);
            return {};
        }
    });
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems])

    // Fetch products from API
    useEffect(() => {
        fetch('http://localhost:55000/api/padaria')
            .then(response => response.json())
            .then(data => {
                setProdutos(data);
            })
            .catch(error => console.error("Erro ao buscar produtos:", error));
    }, []);

    useEffect(() => {
        console.log("cartItems mudou:", cartItems);
    }, [cartItems]);

    useEffect(() => {
        console.log("PRODUTOS CARREGADOS DO BACKEND:", produtos);
    }, [produtos]);

    const addToCart = (itemId, size = 'default') => {
        const idStr = String(itemId);
        setCartItems(prevCartItems => {
            const updatedCart = { ...prevCartItems };

            if (!updatedCart[idStr]) {
                updatedCart[idStr] = { [size]: 1 };
            } else if (!updatedCart[idStr][size]) {
                updatedCart[idStr][size] = 1;
            } else {
                updatedCart[idStr][size] += 1;
            }

            return updatedCart;
        });

        toast.success('Produto Adicionado ao Carrinho');

        // Envia log para a API
        const produto = produtos.find(p => String(p.id) === String(itemId));
        if (produto) {
            fetch('http://localhost:55000/carrinho/adicionar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario: localStorage.getItem('userName') || 'Visitante',
                    nomeProduto: produto.nome
                })
            }).catch(() => { });
        }
    };

    const updateCartItemQuantity = (itemId, size, quantity) => {
        console.log("updateCartItemQuantity chamado com:", itemId, size, quantity);
        setCartItems(prevCartItems => {
            const updatedCart = { ...prevCartItems };

            if (updatedCart[itemId] && updatedCart[itemId][size] !== undefined) {
                updatedCart[itemId][size] += quantity;

                if (updatedCart[itemId][size] <= 0) {
                    delete updatedCart[itemId][size];

                    if (Object.keys(updatedCart[itemId]).length === 0) {
                        delete updatedCart[itemId];
                    }
                }
            }

            console.log("Novo estado do carrinho após updateCartItemQuantity:", updatedCart);
            return updatedCart;
        });
    };

    const removeFromCart = (itemId, size = 'default') => {
        const idStr = String(itemId);
        setCartItems(prevCartItems => {
            const updatedCart = { ...prevCartItems };
            if (updatedCart[idStr] && updatedCart[idStr][size] !== undefined) {
                delete updatedCart[idStr][size];
                if (Object.keys(updatedCart[idStr]).length === 0) {
                    delete updatedCart[idStr];
                }
            }
            return updatedCart;
        });
    };

    const getCartTotal = () => {
        let total = 0;

        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                const quantidade = cartItems[itemId][size];
                const produto = produtos.find(p => String(p.id) === String(itemId)); // <-- ajuste aqui

                if (produto && quantidade > 0) {
                    total += quantidade * produto.preco;
                }
            }
        }
        return total;
    };

    const getCartQuantity = () => {
        let quantity = 0;
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                quantity += cartItems[itemId][size];
            }
        }
        return quantity;
    };

    const value = {
        produtos,
        currency,
        delivery_fee,
        setProdutos,
        cartItems,
        addToCart,
        updateCartItemQuantity,
        getCartTotal,
        getCartQuantity, 
        removeFromCart
    };

    return (
        <CarrinhoContext.Provider value={value}>
            {props.children}
        </CarrinhoContext.Provider>
    );
};

export default CarrinhoContextProvider;
