// src/api/apiClient.js
import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  // **IMPORTANT: Set your actual backend API URL here.**
  // If your backend is running locally on port 5000, this is common.
  // Example: 'http://localhost:5000/api'
  baseURL: 'YOUR_BACKEND_API_BASE_URL', // <<<--- REPLACE THIS PLACEHOLDER!
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add a request interceptor to include the authorization token
// This automatically attaches the token to every request made using apiClient
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming you store your token in localStorage after login
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