<template>
  <main class="flex-1 p-4 md:p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Topics</h2>
      <p class="text-gray-600 dark:text-gray-400">Browse and manage jobs by topic</p>
    </div>

    <!-- Topics Overview -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Topics Overview</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Job Distribution by Topic</h4>
          <div class="space-y-4">
            <div v-for="topic in topicDistribution" :key="topic.name">
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-400">{{ topic.name }}</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-400">{{ topic.count }} ({{ topic.percentage }}%)</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div class="h-2.5 rounded-full" :class="topic.color" :style="{ width: topic.percentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Success Rate by Topic</h4>
          <div class="space-y-4">
            <div v-for="topic in successRates" :key="topic.name">
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-400">{{ topic.name }}</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-400">{{ topic.rate }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div class="bg-green-500 dark:bg-green-700 h-2.5 rounded-full" :style="{ width: topic.rate + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Topics List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="p-4 border-b">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Topics List</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Topic</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Total Jobs</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Active Jobs</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Success Rate</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            <tr v-for="topic in topicsList" :key="topic.name">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-400">{{ topic.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ topic.totalJobs }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ topic.activeJobs }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center">
                  <div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                    <div class="bg-green-500 dark:bg-green-700 h-2.5 rounded-full" :style="{ width: topic.successRate + '%' }"></div>
                  </div>
                  <span>{{ topic.successRate }}%</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <a @click="viewTopicJobs(topic.name)" class="text-primary-600 hover:text-primary-900 cursor-pointer">
                  <font-awesome-icon :icon="['fas', 'eye']" class="mr-1" /> View Jobs
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script>
import { topicService } from '../services/index.js';

export default {
  name: 'Topics',
  data() {
    return {
      loading: false,
      topicDistribution: [],
      successRates: [],
      topicsList: []
    }
  },
  methods: {
    async loadTopicsData() {
      this.loading = true;
      try {
        const [topicsResponse, distributionResponse, successRatesResponse] = await Promise.all([
          topicService.getTopics(),
          topicService.getTopicDistribution(),
          topicService.getTopicSuccessRates()
        ]);

        this.topicsList = topicsResponse;
        this.topicDistribution = distributionResponse;
        this.successRates = successRatesResponse;
      } catch (error) {
        console.error('Error loading topics data:', error);
        this.$notify({
          title: 'Error',
          text: 'Failed to load topics data',
          type: 'error'
        });
      } finally {
        this.loading = false;
      }
    },

    viewTopicJobs(topic) {
      console.log(`Viewing jobs for topic: ${topic}`);
      // Navigate to jobs view filtered by topic
      this.$router.push({ name: 'Jobs', query: { topic } });
    }
  },

  async mounted() {
    await this.loadTopicsData();
  }
}
</script>
