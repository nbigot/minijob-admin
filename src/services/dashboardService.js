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
