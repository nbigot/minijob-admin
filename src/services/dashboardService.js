import apiClient from "./axios.js";

export const dashboardService = {
  // Get dashboard data
  async getDashboardData() {
    try {
      const response = await apiClient.get("/api/v1/dashboard");
      var data = response.data;
      const responseResources = await apiClient.get("/api/v1/metrics/resources");
      if (responseResources.status === 200) {
        data.resources = responseResources.data.resources;
      } else {
        data.resources = [];
      }
      return data;
    } catch (error) {
      throw new Error("Failed to fetch dashboard data");
    }
  },

  // Get job statistics
  async getJobStats() {
    try {
      const response = await apiClient.get("/api/v1/dashboard/job-stats");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch job statistics");
    }
  },

  // Get recent jobs
  async getRecentJobs() {
    try {
      const response = await apiClient.get("/api/v1/dashboard/recent-jobs");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch recent jobs");
    }
  },

  // Get locked resources
  async getLockedResources() {
    try {
      const response = await apiClient.get("/api/v1/dashboard/locked-resources");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch locked resources");
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
};
