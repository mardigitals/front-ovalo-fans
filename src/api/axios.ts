import axios from 'axios';

const api = axios.create({
  // VITE_API_URL debe estar en tu archivo .env
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;