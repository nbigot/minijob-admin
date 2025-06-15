import apiClient from "./axios.js";

export const systemService = {
  async restartServer() {
    try {
      const response = await apiClient.post("/api/v1/admin/server/restart");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to restart server: ${error.message}`);
    }
  },

  async shutdownServer() {
    try {
      const response = await apiClient.post("/api/v1/admin/server/shutdown");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to shutdown server: ${error.message}`);
    }
  },

  async deleteAllJobs() {
    try {
      const response = await apiClient.delete("/api/v1/jobs/");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete all jobs: ${error.message}`);
    }
  },

  async clearJobQueues() {
    try {
      const response = await apiClient.delete("/api/v1/jobs/queued");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to clear job queues: ${error.message}`);
    }
  },

  async unlockAllResources() {
    try {
      const response = await apiClient.post("/api/v1/resources/unlock");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to unlock all resources: ${error.message}`);
    }
  },
};
