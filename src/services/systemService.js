import apiClient from './axios.js';

export const systemService = {
  // Server control operations
  async restartServer() {
    try {
      const response = await apiClient.post('/system/restart');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to restart server: ${error.message}`);
    }
  },

  async shutdownServer() {
    try {
      const response = await apiClient.post('/system/shutdown');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to shutdown server: ${error.message}`);
    }
  },

  // Bulk operations
  async deleteAllJobs() {
    try {
      const response = await apiClient.delete('/system/jobs/all');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete all jobs: ${error.message}`);
    }
  },

  async clearJobQueues() {
    try {
      const response = await apiClient.post('/system/queues/clear');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to clear job queues: ${error.message}`);
    }
  },

  async unlockAllResources() {
    try {
      const response = await apiClient.post('/system/resources/unlock-all');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to unlock all resources: ${error.message}`);
    }
  }
};
