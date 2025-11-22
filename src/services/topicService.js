import apiClient from "./axios.js";

export const topicService = {
  // Get all topics
  async getTopics() {
    try {
      const response = await apiClient.get("/api/v1/topics/");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch topics: ${error.message}`);
    }
  },

  // Get topics statistics
  async getTopicsStats() {
    try {
      const response = await apiClient.get("/api/v1/metrics/topics");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch topic statistics: ${error.message}`);
    }
  },
};
