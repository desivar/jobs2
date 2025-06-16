// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient'; // Ensure this path is correct relative to this file

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Check for token on app load to keep user logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Validate token with backend and get user data
          const response = await apiClient.get('/users/me'); // Hits your backend's /api/users/me
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token validation failed or expired:', error);
          localStorage.removeItem('token'); // Clear bad token
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoadingAuth(false);
    };
    checkAuthStatus();
  }, []);

  // Login function to call your backend
  const login = async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials); // Hits your backend's /api/auth/login
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token); // Save token for future requests
      setUser(userData); // Save user data to state
      setIsAuthenticated(true);
      return true; // Indicate successful login
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw error for component to handle (e.g., display message)
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loadingAuth,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loadingAuth ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading authentication...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication state in any component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};