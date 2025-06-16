// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient'; // Make sure this path is correct relative to this file

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Effect to check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // This endpoint on your backend should return the authenticated user's data
          // It corresponds to your backend's /api/users/me route handled by getMe
          const response = await apiClient.get('/users/me');
          setUser(response.data); // Assuming your backend returns the user object directly
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token validation failed or expired:', error);
          localStorage.removeItem('token'); // Remove invalid token
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoadingAuth(false);
    };
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials); // Your login endpoint
      const { token, ...userData } = response.data; // Assuming your backend returns token and user data
      localStorage.setItem('token', token);
      setUser(userData); // Store user data (excluding token) in state
      setIsAuthenticated(true);
      return true; // Indicate success
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw to be handled by the login component
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    // Optionally, redirect to login page here (e.g., using navigate from react-router-dom)
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
      {/* Optionally, show a loading spinner while checking auth status */}
      {loadingAuth ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading authentication...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};