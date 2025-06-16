// src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  // This is the base URL for your backend API, as seen in your server.js
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the authorization token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming you store your token in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;