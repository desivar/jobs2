// src/api/users.js
import apiClient from './apiClient';

// --- Functions for general user management (keep these) ---

export const getAllUsers = async () => {
  try { // Added try-catch for better error handling, consistent with other functions
    const response = await apiClient.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user by ID (${id}):`, error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user by ID (${id}):`, error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user by ID (${id}):`, error);
    throw error;
  }
};

// --- NEW FUNCTIONS FOR AUTHENTICATED USER'S PROFILE ---

// Function to fetch the currently authenticated user's profile
// This typically hits an endpoint like /api/users/me on the backend
export const getUserProfile = async () => {
  try {
    // The backend uses a 'protect' middleware to identify the user from the token
    const response = await apiClient.get('/users/me'); // <-- Endpoint for current user's profile
    return response.data;
  } catch (error) {
    console.error('Error fetching current user profile:', error);
    throw error;
  }
};

// Function to update the currently authenticated user's profile
// This typically hits an endpoint like /api/users/me on the backend with a PUT request
export const updateUserProfile = async (profileData) => {
  try {
    // The backend uses a 'protect' middleware to identify the user from the token
    const response = await apiClient.put('/users/me', profileData); // <-- Endpoint for updating current user's profile
    return response.data;
  } catch (error) {
    console.error('Error updating current user profile:', error);
    throw error;
  }
};