import axios from 'axios';

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:55000').replace(/\/$/, '');

const api = axios.create({
    baseURL: API_URL,
    timeout: 12000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const loginUser = async (email, senha) => {
    try {
        const response = await api.post('/login', { email, senha });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.erro || 'Erro ao fazer login');
    }
};

export const registerUser = async (nome, email, senha) => {
    try {
        const response = await api.post('/clientes', { nome, email, senha });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.response?.data?.msg || 'Erro ao registrar usuário');
    }
};

export const getUser = async (token) => {
    try {
        const response = await api.get(`/clientes/${encodeURIComponent(token)}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Erro ao obter usuário');
    }
};

export default api;
