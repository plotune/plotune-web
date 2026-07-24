import axios from 'axios';
import Cookies from 'js-cookie';

// Main API instance for backend
const api = axios.create({
  baseURL: 'https://api.plotune.net',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Stream API instance for direct stream service calls
export const streamApi = axios.create({
  baseURL: 'https://stream.plotune.net',
});

// Add request interceptor to handle authentication from cookies
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear cookie and redirect to login
      Cookies.remove('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;