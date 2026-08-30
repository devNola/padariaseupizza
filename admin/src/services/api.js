import axios from 'axios';

export const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:55000').replace(/\/$/, '');

export const api = axios.create({
  baseURL: API_URL,
  timeout: 12000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
