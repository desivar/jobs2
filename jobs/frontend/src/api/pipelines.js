// frontend/src/api/pipelines.js
// Complete API Integration for Pipelines

import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

//=============================================================================
// API HELPER FUNCTIONS
//=============================================================================

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

//=============================================================================
// PIPELINES API FUNCTIONS
//=============================================================================

// GET all pipelines
export const getAllPipelines = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/pipelines`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching pipelines:', error);
    throw error;
  }
};

// GET single pipeline by ID
export const getPipelineById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pipelines/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error fetching pipeline ${id}:`, error);
    throw error;
  }
};

// POST create new pipeline
export const createPipeline = async (pipelineData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pipelines`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(pipelineData)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating pipeline:', error);
    throw error;
  }
};

// PUT update pipeline
export const updatePipeline = async (id, pipelineData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pipelines/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(pipelineData)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error updating pipeline ${id}:`, error);
    throw error;
  }
};

// DELETE pipeline
export const deletePipeline = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pipelines/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error deleting pipeline ${id}:`, error);
    throw error;
  }
};

//=============================================================================
// ADVANCED PIPELINE OPERATIONS (Optional - enhance your backend routes)
//=============================================================================

// Get pipelines with jobs (if your backend supports this)
export const getPipelinesWithJobs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/pipelines?include=jobs`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching pipelines with jobs:', error);
    throw error;
  }
};

// Update pipeline stages/order
export const updatePipelineStages = async (id, stages) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pipelines/${id}/stages`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ stages })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error updating pipeline stages ${id}:`, error);
    throw error;
  }
};

//=============================================================================
// REACT HOOK FOR PIPELINES (Custom Hook)
//=============================================================================

// Custom hook for managing pipelines state
export const usePipelines = () => {
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all pipelines
  const fetchPipelines = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPipelines();
      setPipelines(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create pipeline
  const createNewPipeline = async (pipelineData) => {
    setLoading(true);
    setError(null);
    try {
      const newPipeline = await createPipeline(pipelineData);
      setPipelines(prev => [...prev, newPipeline]);
      return newPipeline;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update pipeline
  const updateExistingPipeline = async (id, pipelineData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPipeline = await updatePipeline(id, pipelineData);
      setPipelines(prev => 
        prev.map(pipeline => 
          pipeline._id === id ? updatedPipeline : pipeline
        )
      );
      return updatedPipeline;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete pipeline
  const deleteExistingPipeline = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deletePipeline(id);
      setPipelines(prev => prev.filter(pipeline => pipeline._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load pipelines on mount
  useEffect(() => {
    fetchPipelines();
  }, []);

  return {
    pipelines,
    loading,
    error,
    fetchPipelines,
    createNewPipeline,
    updateExistingPipeline,
    deleteExistingPipeline
  };
};

//=============================================================================
// PIPELINE DATA TYPES (TypeScript-style comments for reference)
//=============================================================================

/*
Example Pipeline Data Structure:

const pipelineData = {
  name: "Software Engineering Pipeline",
  description: "Pipeline for software engineering positions",
  stages: [
    { id: 1, name: "Applied", order: 1 },
    { id: 2, name: "Phone Screen", order: 2 },
    { id: 3, name: "Technical Interview", order: 3 },
    { id: 4, name: "Final Interview", order: 4 },
    { id: 5, name: "Offer", order: 5 }
  ],
  color: "#3B82F6",
  isActive: true,
  createdBy: "user_id",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
};
*/

//=============================================================================
// EXPORT ALL FUNCTIONS
//=============================================================================

export default {
  getAllPipelines,
  getPipelineById,
  createPipeline,
  updatePipeline,
  deletePipeline,
  getPipelinesWithJobs,
  updatePipelineStages,
  usePipelines
};