import apiClient from './axios.js';

export const resourceService = {
  // Get all resources
  async getResources() {
    try {
      const response = await apiClient.get('/resources');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch resources: ${error.message}`);
    }
  },

  // Get resource statistics
  async getResourceStats() {
    try {
      const response = await apiClient.get('/resources/stats');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch resource statistics: ${error.message}`);
    }
  },

  // Unlock a specific resource
  async unlockResource(resourceName) {
    try {
      const response = await apiClient.post(`/resources/${resourceName}/unlock`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to unlock resource ${resourceName}: ${error.message}`);
    }
  },

  // Unlock all resources
  async unlockAllResources() {
    try {
      const response = await apiClient.post('/resources/unlock-all');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to unlock all resources: ${error.message}`);
    }
  }
};
