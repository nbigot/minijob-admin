import apiClient from './axios.js';

export const healthService = {
  // Get health status
  async getHealthStatus() {
    try {
      const response = await apiClient.get('/health/status');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch health status');
    }
  },

  // Get system info
  async getSystemInfo() {
    try {
      const response = await apiClient.get('/health/system/info');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch system info');
    }
  },

  // Get resource usage
  async getResourceUsage() {
    try {
      const response = await apiClient.get('/health/system/resources');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch resource usage');
    }
  },

  // Get metrics
  async getMetrics() {
    try {
      const response = await apiClient.get('/metrics');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch metrics');
    }
  },

  // Get Prometheus metrics
  async getPrometheusMetrics() {
    try {
      const response = await apiClient.get('/metrics/prometheus', {
        headers: { 'Accept': 'text/plain' }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch Prometheus metrics');
    }
  },

  // Get job processing data
  async getJobProcessingData(timeRange = '24h') {
    try {
      const response = await apiClient.get('/health/job-processing-data', {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch job processing data');
    }
  },

  // Get stalled jobs
  async getStalledJobs() {
    try {
      const response = await apiClient.get('/health/stalled-jobs');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch stalled jobs');
    }
  }
};
