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
    { name: "data-processing", rate: 92 },
    { name: "email-notifications", rate: 98 },
    { name: "report-generation", rate: 85 },
    { name: "file-uploads", rate: 78 },
    { name: "other", rate: 90 },
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
mock.onGet("/api/v1/topics").reply(200, data.topicsList);

mock.onGet("/api/v1/topics/stats").reply(200, {
  totalTopics: data.topicsList.length,
  totalJobs: data.topicsList.reduce((sum, topic) => sum + topic.totalJobs, 0),
  activeJobs: data.topicsList.reduce((sum, topic) => sum + topic.activeJobs, 0),
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
