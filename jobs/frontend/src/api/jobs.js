// src/api/jobs.js
import { getAuthHeaders } from './auth';

const API_BASE_URL = 'http://localhost:5500';

// Get all jobs
export const getAllJobs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

// Get job by ID
export const getJobById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Job not found');
      }
      throw new Error('Failed to fetch job');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
};

// Create new job
export const createJob = async (jobData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create job');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

// Update job
export const updateJob = async (id, jobData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update job');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

// Delete job
export const deleteJob = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete job');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};