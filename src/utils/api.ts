import axios from 'axios';
import { getCookie } from './cookies';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => 
{
  const token = getCookie('token');
  
  if (token) 
    config.headers.Authorization = `Bearer ${token}`;

  return config;
}, (error) => 
{
  return Promise.reject(error);
});


export default api;