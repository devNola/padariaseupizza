import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { loginUser, registerUser } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

// Animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5 }
    }
};

const buttonVariants = {
    hover: { scale: 1.03 },
    tap: { scale: 0.98 },
    loading: { scale: 0.98 }
};

function Login() {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(AuthContext);
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarsenha: '',
    });
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams()

    const isLoggedIn = !!localStorage.getItem('token');

    const nome = localStorage.getItem('nome');
    const email = localStorage.getItem('email'); // se quiser usar também

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const login = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const { email, senha } = formData;
            console.log({ email, senha }); // Verifique os dados enviados
            const data = await loginUser(email, senha);
            toast.success('Login realizado com sucesso!');
            localStorage.setItem('token', data.token);
            setIsLoggedIn(true);
            const redirect = searchParams.get('redirect') || '/';
            navigate(redirect, { replace: true });
        } catch (error) {
            console.error(error.response?.data || error.message); // Verifique o erro retornado
            toast.error(error.response?.data?.erro || 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    // Validação de senha forte
    const senhaValida = (senha) => {
        // Pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 símbolo
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        // Lista de senhas comuns
        const comuns = ['123456', 'senha', 'password', '12345678', 'abc123'];
        if (comuns.includes(senha.toLowerCase())) return false;
        return regex.test(senha);
    };

    const register = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const { nome, email, senha, confirmarsenha } = formData;
            if (senha !== confirmarsenha) {
                toast.error('As senhas não coincidem.');
                setLoading(false);
                return;
            }
            if (!senhaValida(senha)) {
                toast.error('A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número, símbolo e não pode ser comum.');
                setLoading(false);
                return;
            }
            await registerUser(nome, email, senha);
            toast.success('Conta criada com sucesso! Faça login para continuar.');
            setIsLoginForm(true); // Volta para o formulário de login
            setFormData({
                ...formData,
                senha: '',
                confirmarsenha: ''
            }); // Mantém o email preenchido
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleForm = () => {
        setIsLoginForm(!isLoginForm);
        setFormData({ nome: '', email: '', senha: '', confirmarsenha: '' });
    };

    // Form variants agora dentro do componente para acessar o estado isLoginForm
    const formVariants = {
        hidden: { x: isLoginForm ? -50 : 50, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 10
            }
        },
        exit: {
            x: isLoginForm ? 50 : -50,
            opacity: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <motion.div
            className="login-page"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <AnimatePresence mode='wait'>
                <motion.div
                    key={isLoginForm ? 'login' : 'register'}
                    className="form"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {isLoginForm ? (
                        <form onSubmit={login}>
                            <motion.img
                                src={assets.logo}
                                alt="Logo"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="logo"
                            />
                            <motion.input
                                type="email"
                                name="email"
                                placeholder="E-mail"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="password"
                                name="senha"
                                placeholder="Senha"
                                value={formData.senha}
                                onChange={handleChange}
                                required
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.button
                                type="submit"
                                disabled={loading}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                animate={loading ? "loading" : ""}
                            >
                                {loading ? (
                                    <span className="loading-dots">
                                        <span>.</span>
                                        <span>.</span>
                                        <span>.</span>
                                    </span>
                                ) : 'Login'}
                            </motion.button>
                            <motion.p
                                className="message"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                Não tem uma conta?{' '}
                                <motion.a
                                    href="#"
                                    onClick={toggleForm}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Criar conta!
                                </motion.a>
                            </motion.p>
                        </form>
                    ) : (
                        <form onSubmit={register}>
                            <motion.img
                                src={assets.logo}
                                alt="Logo"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="logo"
                            />
                            <motion.input
                                type="text"
                                name="nome"
                                placeholder="Nome *"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="email"
                                name="email"
                                placeholder="E-mail *"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="password"
                                name="senha"
                                placeholder="Senha *"
                                value={formData.senha}
                                onChange={handleChange}
                                required
                                whileFocus={{ scale: 1.02 }}
                            />
                            {!senhaValida(formData.senha) && formData.senha.length > 0 && (
                                <div style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>
                                    A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo, e não pode ser comum.
                                </div>
                            )}
                            <motion.input
                                type="password"
                                name="confirmarsenha"
                                placeholder="Confirmar Senha *"
                                value={formData.confirmarsenha}
                                onChange={handleChange}
                                required
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.button
                                type="submit"
                                disabled={loading}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                animate={loading ? "loading" : ""}
                            >
                                {loading ? (
                                    <span className="loading-dots">
                                        <span>.</span>
                                        <span>.</span>
                                        <span>.</span>
                                    </span>
                                ) : 'Registrar'}
                            </motion.button>
                            <motion.p
                                className="message"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                Já tem uma conta?{' '}
                                <motion.a
                                    href="#"
                                    onClick={toggleForm}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Login
                                </motion.a>
                            </motion.p>
                        </form>
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}

export default Login;