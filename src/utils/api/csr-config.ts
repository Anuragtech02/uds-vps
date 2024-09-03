// utils/api/csr-config.ts

import axios from 'axios';
import Cookies from 'js-cookie';

const API = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337',
   timeout: 10000,
});

// Request interceptor to append headers (e.g., authorization tokens)
API.interceptors.request.use(
   (config) => {
      // Extract the token from cookies during CSR
      const token = Cookies.get('token');
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   },
);

// Response interceptor to handle errors
API.interceptors.response.use(
   (response) => response,
   (error) => {
      if (error.response?.status === 401) {
         // Handle unauthorized access
         console.error('Unauthorized access - maybe redirect to login?');
      }
      return Promise.reject(error);
   },
);

export default API;
