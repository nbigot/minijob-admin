import apiClient from "./axios.js";

export const dashboardService = {
  // Get dashboard data
  async getDashboardData() {
    try {
      // Fetch job stats (job counts by status)
      const responseJobStats = await apiClient.get("/api/v1/metrics/jobs/processing");
      const jobStats = responseJobStats.data.jobStats || {};

      // Fetch job activity metrics (cumulative event counts)
      const responseJobActivity = await apiClient.get("/api/v1/metrics/jobs/activity");
      const jobActivity = responseJobActivity.data.jobActivity || {};

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
        jobActivity,
        recentJobs,
        resources,
        jobsByTopic,
      };
    } catch (error) {
      throw new Error("Failed to fetch dashboard data");
    }
  },

  // Get Job Stats (current job counts by status) - Note: This duplicates getDashboardData's job stats fetch
  async getJobProcessingData() {
    try {
      const response = await apiClient.get("/api/v1/metrics/jobs/processing");
      return response.data.jobStats || {};
    } catch (error) {
      throw new Error("Failed to fetch job stats data");
    }
  },

  // Get Job Activity Metrics (cumulative event counts)
  async getJobActivityMetrics() {
    try {
      const response = await apiClient.get("/api/v1/metrics/jobs/activity");
      return response.data.jobActivity || {};
    } catch (error) {
      throw new Error("Failed to fetch job activity metrics");
    }
  },
};
