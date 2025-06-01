import apiClient from './axios.js';

export const jobService = {
  // Get all jobs
  async getJobs(params = {}) {
    try {
      const response = await apiClient.get('/jobs', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch jobs: ${error.message}`);
    }
  },

  // Get job by ID
  async getJobById(jobId) {
    try {
      const response = await apiClient.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch job ${jobId}: ${error.message}`);
    }
  },

  // Get stalled jobs
  async getStalledJobs() {
    try {
      const response = await apiClient.get('/jobs/stalled');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch stalled jobs: ${error.message}`);
    }
  },

  // Delete job
  async deleteJob(jobId) {
    try {
      const response = await apiClient.delete(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete job ${jobId}: ${error.message}`);
    }
  },

  // Cancel job
  async cancelJob(jobId) {
    try {
      const response = await apiClient.post(`/jobs/${jobId}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to cancel job ${jobId}: ${error.message}`);
    }
  },

  // Retry job
  async retryJob(jobId) {
    try {
      const response = await apiClient.post(`/jobs/${jobId}/retry`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to retry job ${jobId}: ${error.message}`);
    }
  }
};
