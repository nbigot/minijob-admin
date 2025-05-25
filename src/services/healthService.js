import apiClient from './api.js';

export const healthService = {
  // Get health status
  async getHealthStatus() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch health status: ${error.message}`);
    }
  },

  // Get system info
  async getSystemInfo() {
    try {
      const response = await apiClient.get('/system/info');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch system info: ${error.message}`);
    }
  },

  // Get resource usage
  async getResourceUsage() {
    try {
      const response = await apiClient.get('/system/resources');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch resource usage: ${error.message}`);
    }
  },

  // Get metrics
  async getMetrics() {
    try {
      const response = await apiClient.get('/metrics');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch metrics: ${error.message}`);
    }
  },

  // Get Prometheus metrics
  async getPrometheusMetrics() {
    try {
      const response = await apiClient.get('/metrics/prometheus', {
        headers: {
          'Accept': 'text/plain'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Prometheus metrics: ${error.message}`);
    }
  },

  // Get job processing data
  async getJobProcessingData(timeRange = '24h') {
    try {
      const response = await apiClient.get('/metrics/job-processing', {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch job processing data: ${error.message}`);
    }
  }
};