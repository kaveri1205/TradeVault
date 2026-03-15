import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tradevault-en2r.onrender.com/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // We don't use window.location.href here to avoid hard reloads. 
      // The AuthContext and ProtectedRoutes will handle the state change.
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

export const stockAPI = {
  getStockPrice: (symbol) => api.get(`/stocks/search/${symbol}`),
};

export const tradingAPI = {
  buyStock: (tradeData) => api.post('/trading/buy', tradeData),
  sellStock: (tradeData) => api.post('/trading/sell', tradeData),
  getPortfolio: () => api.get('/trading/portfolio'),
  getTransactions: () => api.get('/trading/transactions'),
  getSummary: () => api.get('/trading/summary'),
};

export const leaderboardAPI = {
  getLeaderboard: () => api.get('/leaderboard'),
};

export default api;
