import apiClient from "./axios.js";

export const resourceService = {
  // Get all resources
  async getResources() {
    try {
      const response = await apiClient.get("/api/v1/resources");
      return response.data.resources;
    } catch (error) {
      throw new Error(`Failed to fetch resources: ${error.message}`);
    }
  },

  // Get resource statistics
  async getResourceStats() {
    try {
      const response = await apiClient.get("/api/v1/metrics/resources");
      return response.data.resources;
    } catch (error) {
      throw new Error(`Failed to fetch resource statistics: ${error.message}`);
    }
  },

  // Unlock a specific resource
  async unlockResource(resourceName) {
    try {
      const response = await apiClient.post(`/api/v1/resources/${resourceName}/unlock`);
      if (response.status !== 200) {
        throw new Error(`Failed to unlock resource ${resourceName}: ${response.data.message}`);
      }
      return response.data;
    } catch (error) {
      throw new Error(`Failed to unlock resource ${resourceName}: ${error.message}`);
    }
  },

  // Unlock all resources
  async unlockAllResources() {
    try {
      const response = await apiClient.post("/api/v1/resources/unlock");
      if (response.status !== 200) {
        throw new Error(`Failed to unlock all resources: ${response.data.message}`);
      }
      return response.data;
    } catch (error) {
      throw new Error(`Failed to unlock all resources: ${error.message}`);
    }
  },
};
