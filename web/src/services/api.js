import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:55000',
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
        const response = await api.post('/clientes', { nome, email, senha, admin: false });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Erro ao registrar usuário');
    }
};

export const getUser = async (token) => {
    try {
        const response = await api.get(`/clientes/${token}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Erro ao obter usuário');
    }
}