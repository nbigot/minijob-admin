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
                  <i class="fas fa-eye mr-1"></i> View Jobs
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
export default {
  name: 'Topics',
  data() {
    return {
      topicDistribution: [
        { name: 'data-processing', count: 87, percentage: 42, color: 'bg-purple-500' },
        { name: 'email-notifications', count: 56, percentage: 27, color: 'bg-pink-500' },
        { name: 'report-generation', count: 34, percentage: 16, color: 'bg-cyan-500' },
        { name: 'file-uploads', count: 22, percentage: 11, color: 'bg-orange-500' },
        { name: 'other', count: 8, percentage: 4, color: 'bg-gray-500' }
      ],
      successRates: [
        { name: 'data-processing', rate: 92 },
        { name: 'email-notifications', rate: 98 },
        { name: 'report-generation', rate: 85 },
        { name: 'file-uploads', rate: 78 },
        { name: 'other', rate: 90 }
      ],
      topicsList: [
        { name: 'data-processing', totalJobs: 87, activeJobs: 12, successRate: 92 },
        { name: 'email-notifications', totalJobs: 56, activeJobs: 8, successRate: 98 },
        { name: 'report-generation', totalJobs: 34, activeJobs: 5, successRate: 85 },
        { name: 'file-uploads', totalJobs: 22, activeJobs: 3, successRate: 78 },
        { name: 'other', totalJobs: 8, activeJobs: 1, successRate: 90 }
      ]
    }
  },
  methods: {
    viewTopicJobs(topic) {
      console.log(`Viewing jobs for topic: ${topic}`)
      // In a real application, navigate to jobs view filtered by topic
      // this.$router.push({ name: 'jobs', query: { topic } });
    }
  }
}
</script>