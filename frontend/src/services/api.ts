import axios from 'axios';
import { User } from '../data/auth/types';

const API_BASE_URL = 'http://educlass.test/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post<LoginResponse>('/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    return response.data;
  },

  logout: async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await api.get<User>('/me');
    return response.data;
  },
};

export default api; 