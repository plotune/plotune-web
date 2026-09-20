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
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthRequest = /\/(login|register|auth\/)/.test(url);
    if (status === 401 && !isAuthRequest) {
      // Session expired on an authenticated request: clear the cookie and return to
      // login with a flag so the page can explain what happened (Postel/Zeigarnik —
      // never silently teleport the user or swallow the error).
      Cookies.remove('auth_token');
      window.location.href = '/login?expired=1';
    }
    // 401s on the auth endpoints themselves (e.g. wrong password) must reach the
    // caller's catch block so the form can show a real error message.
    return Promise.reject(error);
  }
);

export default api;