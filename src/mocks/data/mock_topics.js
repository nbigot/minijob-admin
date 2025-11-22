import mock from "../mock.js";

// Mock data for topics
let data = {
  topicDistribution: [
    { name: "data-processing", count: 87, percentage: 42, color: "bg-purple-500" },
    { name: "email-notifications", count: 56, percentage: 27, color: "bg-pink-500" },
    { name: "report-generation", count: 34, percentage: 16, color: "bg-cyan-500" },
    { name: "file-uploads", count: 22, percentage: 11, color: "bg-orange-500" },
    { name: "other", count: 8, percentage: 4, color: "bg-gray-500" },
  ],

  successRates: [
    { name: "data-processing", successRate: 92 },
    { name: "email-notifications", successRate: 98 },
    { name: "report-generation", successRate: 85 },
    { name: "file-uploads", successRate: 78 },
    { name: "other", successRate: 90 },
  ],

  topicsList: [
    { name: "data-processing", totalJobs: 87, activeJobs: 12, successRate: 92 },
    { name: "email-notifications", totalJobs: 56, activeJobs: 8, successRate: 98 },
    { name: "report-generation", totalJobs: 34, activeJobs: 5, successRate: 85 },
    { name: "file-uploads", totalJobs: 22, activeJobs: 3, successRate: 78 },
    { name: "other", totalJobs: 8, activeJobs: 1, successRate: 90 },
  ],
};

// Functions to handle mock data requests
mock.onGet("/api/v1/topics/").reply(200, {
  code: 200,
  message: "success",
  topics: ["mock-data-processing", "mock-report-generation", "mock-data-backup", "mock-file-uploads", "mock-email-notifications"],
});

mock.onGet("/api/v1/metrics/topics").reply(200, {
  code: 200,
  message: "success",
  topics: [
    { topicName: "mock-data-processing", totalJobs: 87, activeJobs: 12, percentJobs: 42, successRate: 0.92, averageDuration: 0.015 },
    { topicName: "mock-email-notifications", totalJobs: 56, activeJobs: 8, percentJobs: 27, successRate: 0.98, averageDuration: 0.8 },
    { topicName: "mock-report-generation", totalJobs: 34, activeJobs: 5, percentJobs: 16, successRate: 0.85, averageDuration: 62.46 },
    { topicName: "mock-file-uploads", totalJobs: 22, activeJobs: 3, percentJobs: 11, successRate: 0.78, averageDuration: 123.34 },
    { topicName: "mock-data-backup", totalJobs: 8, activeJobs: 1, percentJobs: 4, successRate: 0.9, averageDuration: 0 },
  ],
});

mock.onGet("/api/v1/topics/distribution").reply(200, data.topicDistribution);

mock.onGet("/api/v1/topics/success-rates").reply(200, data.successRates);

// Helper functions for generating dynamic mock data
export const mockDataHelpers = {
  getTopicByName(topicName) {
    return data.topicsList.find((topic) => topic.name === topicName);
  },

  updateTopicStats(topicName, updates) {
    const topic = this.getTopicByName(topicName);
    if (topic) {
      Object.assign(topic, updates);
      return topic;
    }
    return null;
  },
};
