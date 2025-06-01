import apiClient from './axios.js';

export const topicService = {
  // Get all topics
  async getTopics() {
    try {
      const response = await apiClient.get('/topics');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch topics: ${error.message}`);
    }
  },

  // Get topic statistics
  async getTopicStats() {
    try {
      const response = await apiClient.get('/topics/stats');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch topic statistics: ${error.message}`);
    }
  },

  // Get topic distribution
  async getTopicDistribution() {
    try {
      const response = await apiClient.get('/topics/distribution');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch topic distribution: ${error.message}`);
    }
  },

  // Get success rates by topic
  async getTopicSuccessRates() {
    try {
      const response = await apiClient.get('/topics/success-rates');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch topic success rates: ${error.message}`);
    }
  }
};
