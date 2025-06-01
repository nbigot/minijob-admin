import apiClient from './axios.js';

export const dashboardService = {
  // Get dashboard data
  async getDashboardData() {
    try {
      const response = await apiClient.get('/dashboard');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch dashboard data');
    }
  },

  // Get job statistics
  async getJobStats() {
    try {
      const response = await apiClient.get('/dashboard/job-stats');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch job statistics');
    }
  },

  // Get recent jobs
  async getRecentJobs() {
    try {
      const response = await apiClient.get('/dashboard/recent-jobs');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch recent jobs');
    }
  },

  // Get locked resources
  async getLockedResources() {
    try {
      const response = await apiClient.get('/dashboard/locked-resources');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch locked resources');
    }
  }
};