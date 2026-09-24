import axios from 'axios';

// 1. Creamos la instancia base
const api = axios.create({
  baseURL: 'http://localhost:3000', 
});

// 2. EL INTERCEPTOR 
api.interceptors.request.use(
  (config) => {
    // Buscamos el token
    const token = localStorage.getItem('token');
    
    // Si existe, se lo inyectamos a los Headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;