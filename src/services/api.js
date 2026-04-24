import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('flexibond_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('flexibond_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (username, password) =>
  api.post('/auth/login', { username, password });

// Upload
export const uploadFile = (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
  });
};
export const getUploadHistory = () => api.get('/upload/history');

// Dashboard
export const getDashboardSummary = (params) => api.get('/dashboard/summary', { params });
export const getRevenueTrend = (params) => api.get('/dashboard/revenue-trend', { params });
export const getTopProducts = (params) => api.get('/dashboard/top-products', { params });
export const getTopCustomers = (params) => api.get('/dashboard/top-customers', { params });
export const getCategoryBreakdown = () => api.get('/dashboard/category-breakdown');
export const getGeographic = (params) => api.get('/dashboard/geographic', { params });
export const getColourAnalysis = (params) => api.get('/dashboard/colour-analysis', { params });
export const getFilters = () => api.get('/dashboard/filters');

// Salesperson
export const getSalespersonList = (params) => api.get('/salesperson/list', { params });
export const getSalespersonPerformance = (name, params) =>
  api.get(`/salesperson/${encodeURIComponent(name)}/performance`, { params });
export const getSalespersonComparison = (params) => api.get('/salesperson/compare/all', { params });

export default api;
