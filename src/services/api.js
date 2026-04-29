import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const isLAN = window.location.hostname.startsWith('192.168.') || 
              window.location.hostname.startsWith('10.') || 
              window.location.hostname.startsWith('172.') ||
              window.location.hostname.endsWith('.local');

const API_BASE = isLocalhost 
  ? 'http://localhost:5000/api' 
  : isLAN 
    ? `http://${window.location.hostname}:5000/api`
    : 'https://flexibond-backend-vkc0.onrender.com/api';

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
export const getProfile = () => api.get('/auth/me');

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
export const deleteUpload = (uploadId) => api.delete(`/upload/${uploadId}`);
export const purgeAllData = (type) => api.delete(`/upload/purge/${type}`);

// Dashboard
export const getDashboardSummary = (params) => api.get('/dashboard/summary', { params });
export const getRevenueTrend = (params) => api.get('/dashboard/revenue-trend', { params });
export const getTopProducts = (params) => api.get('/dashboard/top-products', { params });
export const getTopCustomers = (params) => api.get('/dashboard/top-customers', { params });
export const getCategoryBreakdown = (params) => api.get('/dashboard/category-breakdown', { params });
export const getGeographic = (params) => api.get('/dashboard/geographic', { params });
export const getColourAnalysis = (params) => api.get('/dashboard/colour-analysis', { params });
export const getSizeAnalysis = (params) => api.get('/dashboard/size-analysis', { params });
export const getFilters = () => api.get('/dashboard/filters');

// Salesperson
export const getSalespersonList = (params) => api.get('/salesperson/list', { params });
export const getSalespersonPerformance = (name, params) =>
  api.get(`/salesperson/${encodeURIComponent(name)}/performance`, { params });
export const getSalespersonComparison = (params) => api.get('/salesperson/compare/all', { params });

// Channel (B2B vs B2C)
export const getChannelSummary = (params) => api.get('/channel/summary', { params });
export const getChannelTrend = (params) => api.get('/channel/trend', { params });
export const getChannelTopCustomers = (params) => api.get('/channel/top-customers', { params });
export const getChannelStateBreakdown = (params) => api.get('/channel/state-breakdown', { params });
export const getChannelProductBreakdown = (params) => api.get('/channel/product-breakdown', { params });
export const getChannelCategoryBreakdown = (params) => api.get('/channel/category-breakdown', { params });

// Financials
export const getFinancialSummary = (params) => api.get('/financials/summary', { params });
export const getFinancialTaxTrend = (params) => api.get('/financials/tax-trend', { params });
export const getFinancialStateWiseTax = (params) => api.get('/financials/state-wise-tax', { params });
export const getFinancialGSTTypeSplit = (params) => api.get('/financials/gst-type-split', { params });
export const getFinancialInvoices = (params) => api.get('/financials/invoices', { params });
export const getFinancialFilters = () => api.get('/financials/filters');

// AI Insights
export const getAIInsights = (context, contextType) => api.post('/ai/insights', { context, contextType });

// User Management & Logs (Admin Only)
export const adminGetUsers = () => api.get('/auth/users');
export const adminCreateUser = (userData) => api.post('/auth/users', userData);
export const adminUpdateUser = (userId, userData) => api.put(`/auth/users/${userId}`, userData);
export const adminDeleteUser = (userId) => api.delete(`/auth/users/${userId}`);
export const adminGetLogs = () => api.get('/auth/logs');

export default api;
