<template>
  <main class="flex-1 p-4 md:p-6">
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <div class="flex items-center">
          <a href="#" @click.prevent="goBack" class="text-primary-600 hover:text-primary-800 mr-2">
            <font-awesome-icon :icon="['fas', 'arrow-left']" />
          </a>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Job Detail: {{ jobId }}</h2>
        </div>
        <p class="text-gray-600 dark:text-gray-400">View and manage job details</p>
      </div>
      <div class="mt-4 md:mt-0 flex flex-wrap gap-2">
        <button class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
          <font-awesome-icon :icon="['fas', 'copy']" class="mr-2" /> Clone
        </button>
        <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          <font-awesome-icon :icon="['fas', 'stop']" class="mr-2" /> Cancel
        </button>
        <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          <font-awesome-icon :icon="['fas', 'trash']" class="mr-2" /> Delete
        </button>
      </div>
    </div>

    <!-- Job Status -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div class="flex items-center mb-4 md:mb-0">
          <div class="rounded-full bg-green-100 p-3 mr-4">
            <font-awesome-icon :icon="['fas', 'play']" class="text-green-500" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">Running</h3>
            <p class="text-gray-500 dark:text-gray-400">Started 5 minutes ago</p>
          </div>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center mb-2">
            <span class="text-gray-500 dark:text-gray-400 w-32">Created:</span>
            <span class="font-medium text-gray-800 dark:text-gray-200">2023-05-15 14:30:45</span>
          </div>
          <div class="flex items-center mb-2">
            <span class="text-gray-500 dark:text-gray-400 w-32">Updated:</span>
            <span class="font-medium text-gray-800 dark:text-gray-200">2023-05-15 14:35:12</span>
          </div>
          <div class="flex items-center">
            <span class="text-gray-500 dark:text-gray-400 w-32">Duration:</span>
            <span class="font-medium text-gray-800 dark:text-gray-200">5 minutes</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Job Details Tabs -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
      <div class="border-b">
        <nav class="flex -mb-px">
          <a href="#" @click.prevent="activeTab = 'details'" :class="[activeTab === 'details' ? 'text-primary-600 border-primary-500 border-b-2' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 border-b border-transparent', 'whitespace-nowrap py-4 px-6 font-medium text-sm']">
            Details
          </a>
          <a href="#" @click.prevent="activeTab = 'history'" :class="[activeTab === 'history' ? 'text-primary-600 border-primary-500 border-b-2' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 border-b border-transparent', 'whitespace-nowrap py-4 px-6 font-medium text-sm']">
            History
          </a>
          <a href="#" @click.prevent="activeTab = 'resources'" :class="[activeTab === 'resources' ? 'text-primary-600 border-primary-500 border-b-2' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 border-b border-transparent', 'whitespace-nowrap py-4 px-6 font-medium text-sm']">
            Resources
          </a>
          <a href="#" @click.prevent="activeTab = 'logs'" :class="[activeTab === 'logs' ? 'text-primary-600 border-primary-500 border-b-2' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 border-b border-transparent', 'whitespace-nowrap py-4 px-6 font-medium text-sm']">
            Logs
          </a>
        </nav>
      </div>
      <div class="p-6">
        <div v-if="activeTab === 'details'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Job Properties</h3>
            <table class="min-w-full">
              <tbody>
                <tr>
                  <td class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">ID</td>
                  <td class="py-2 text-sm text-gray-900 dark:text-gray-300">{{ jobId }}</td>
                </tr>
                <tr>
                  <td class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Topic</td>
                  <td class="py-2 text-sm text-gray-900 dark:text-gray-300">data-processing</td>
                </tr>
                <tr>
                  <td class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Status</td>
                  <td class="py-2 text-sm text-gray-900 dark:text-gray-300">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Running</span>
                  </td>
                </tr>
                <tr>
                  <td class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Priority</td>
                  <td class="py-2 text-sm text-gray-900 dark:text-gray-300">High</td>
                </tr>
                <tr>
                  <td class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Visibility Timeout</td>
                  <td class="py-2 text-sm text-gray-900 dark:text-gray-300">30 minutes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Job Data</h3>
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <pre class="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{{ jobData }}</pre>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'resources'" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-600">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resource Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Locked Since</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">database-connection</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">5 min ago</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <button class="text-red-600 hover:text-red-900">
                    <font-awesome-icon :icon="['fas', 'unlock']" class="mr-1" /> Unlock
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="activeTab === 'history'" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-600">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timestamp</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(event, index) in jobHistory" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ event.timestamp }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{{ event.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ event.details }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="activeTab === 'logs'" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <pre class="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
[14:30:45] INFO: Job 73b6a7e9-51e0-4982-a106-f54c4369271a created
[14:31:30] INFO: Job 73b6a7e9-51e0-4982-a106-f54c4369271a moved to queue
[14:32:45] INFO: Locked resource: database-connection
[14:35:12] INFO: Started processing data
[14:36:25] INFO: Processing batch 1/10
[14:37:10] INFO: Processing batch 2/10
          </pre>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "JobDetail",
  props: {
    jobId: {
      type: String,
      default: '73b6a7e9-51e0-4982-a106-f54c4369271a'
    }
  },
  data() {
    return {
      activeTab: 'details',
      jobData: JSON.stringify({
        "type": "data-processing",
        "source": "database-01",
        "destination": "analytics-service",
        "parameters": {
          "batchSize": 1000,
          "filters": {
            "startDate": "2023-05-01",
            "endDate": "2023-05-15"
          }
        },
        "options": {
          "retryCount": 3,
          "timeout": 1800
        }
      }, null, 2),
      jobHistory: [
        {
          timestamp: '2023-05-15 14:35:12',
          name: 'Started Processing',
          details: 'Job started processing data'
        },
        {
          timestamp: '2023-05-15 14:32:45',
          name: 'Resource Locked',
          details: 'Locked resource: database-connection'
        },
        {
          timestamp: '2023-05-15 14:31:30',
          name: 'Queued',
          details: 'Job moved to queue'
        },
        {
          timestamp: '2023-05-15 14:30:45',
          name: 'Created',
          details: 'Job created'
        }
      ]
    }
  },
  methods: {
    goBack() {
      this.$router.push('/jobs');
    }
  }
}
</script>
