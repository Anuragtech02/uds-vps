import axios from 'axios';

const API = axios.create({
   baseURL: process.env.API_URL || 'http://127.0.0.1:1337',
   timeout: 10000,
});

// Request interceptor to append headers (e.g., authorization tokens)
API.interceptors.request.use(
   (config) => {
      // add application/json header
      config.headers['Content-Type'] = 'application/json';
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
         console.error('Unauthorized access - maybe redirect to login?');
      }
      return Promise.reject(error);
   },
);

export default API;
