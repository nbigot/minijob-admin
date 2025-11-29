import apiClient from "./axios.js";

export const dashboardService = {
  // Get dashboard data
  async getDashboardData() {
    try {
      // Fetch job stats
      const responseJobStats = await apiClient.get("/api/v1/metrics/jobs/stats");
      const jobStats = responseJobStats.data.jobStats || {};

      // Fetch recent jobs (limit to first 5)
      const responseRecentJobs = await apiClient.get("/api/v1/metrics/jobs/recent");
      const recentJobs = (responseRecentJobs.data.jobs || []).slice(0, 5);

      // Fetch locked resources (limit to first 5)
      const responseResources = await apiClient.get("/api/v1/metrics/resources");
      const resources = (responseResources.data.resources || []).slice(0, 5);

      // Fetch jobs by topic (limit to first 5)
      const responseTopics = await apiClient.get("/api/v1/metrics/topics");
      const topicsData = (responseTopics.data.topics || []).slice(0, 5);
      const jobsByTopic = {};
      topicsData.forEach((topic) => {
        jobsByTopic[topic.topicName] = topic.totalJobs;
      });

      return {
        jobStats,
        recentJobs,
        resources,
        jobsByTopic,
      };
    } catch (error) {
      throw new Error("Failed to fetch dashboard data");
    }
  },

  // Get job statistics
  async getJobStats() {
    try {
      const response = await apiClient.get("/api/v1/metrics/jobs/stats");
      return response.data.jobStats;
    } catch (error) {
      throw new Error("Failed to fetch job statistics");
    }
  },

  // Get recent jobs
  async getRecentJobs() {
    try {
      const response = await apiClient.get("/api/v1/metrics/jobs/recent");
      return response.data.jobs;
    } catch (error) {
      throw new Error("Failed to fetch recent jobs");
    }
  },

  // Get locked resources
  async getLockedResources() {
    try {
      const response = await apiClient.get("/api/v1/metrics/resources");
      return response.data.resources;
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

  // Get job processing data
  async getJobProcessingData(timeRange = "24h") {
    try {
      const response = await apiClient.get("/api/v1/metrics/jobs/processing", {
        params: { timeRange },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch job processing data");
    }
  },
};
