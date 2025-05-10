<template>
  <main class="flex-1 p-4 md:p-6">
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Create New Job</h2>
        <p class="text-gray-600 dark:text-gray-400">Fill out the form to create a new job</p>
      </div>
      <div class="mt-4 md:mt-0">
        <button @click="navigateBackToJobs" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
          <i class="fas fa-arrow-left mr-2"></i> Back to Jobs
        </button>
      </div>
    </div>

    <!-- Job Creation Form -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <form @submit.prevent="submitJob">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Topic Selection -->
          <div>
            <label for="topic" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic</label>
            <select id="topic" v-model="job.topic" required class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50">
              <option value="" disabled>Select a topic</option>
              <option value="data-processing">data-processing</option>
              <option value="email-notifications">email-notifications</option>
              <option value="report-generation">report-generation</option>
              <option value="file-uploads">file-uploads</option>
            </select>
          </div>

          <!-- Priority -->
          <div>
            <label for="priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
            <select id="priority" v-model="job.priority" required class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <!-- Content -->
          <div class="md:col-span-2">
            <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Content</label>
            <textarea id="content" v-model="job.content" rows="6" placeholder="Enter job content in JSON format..." required class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 font-mono text-sm"></textarea>
          </div>

          <!-- Schedule -->
          <div>
            <label for="schedule" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Schedule</label>
            <select id="schedule" v-model="job.schedule" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50">
              <option value="immediate">Run Immediately</option>
              <option value="scheduled">Schedule for Later</option>
            </select>
          </div>

          <!-- Schedule Time (conditional) -->
          <div v-if="job.schedule === 'scheduled'">
            <label for="scheduleTime" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Schedule Time</label>
            <input type="datetime-local" id="scheduleTime" v-model="job.scheduleTime" required class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50">
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button type="button" @click="navigateBackToJobs" class="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium py-2 px-4 rounded mr-2">
            Cancel
          </button>
          <button type="submit" class="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">
            <i class="fas fa-save mr-2"></i> Create Job
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
export default {
  name: 'CreateJob',
  data() {
    return {
      job: {
        topic: '',
        priority: 'medium',
        content: '',
        schedule: 'immediate',
        scheduleTime: null
      }
    };
  },
  methods: {
    submitJob() {
      // In a real app, this would send the job data to an API
      console.log('Submitting job:', this.job);
      // After successful submission, navigate back to jobs list
      this.$router.push('/jobs');
    },
    navigateBackToJobs() {
      this.$router.push('/jobs');
    }
  }
};
</script>