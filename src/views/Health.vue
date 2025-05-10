<template>
  <main class="flex-1 p-4 md:p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Health &amp; Monitoring</h2>
      <p class="text-gray-600 dark:text-gray-400">Monitor server health and performance metrics</p>
    </div>

    <!-- Health Status -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Health Status</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="border rounded-lg p-4">
          <div class="flex items-center">
            <div class="rounded-full bg-green-100 p-3">
              <i class="fas fa-server text-green-500"></i>
            </div>
            <div class="ml-4">
              <h4 class="text-gray-500 text-sm dark:text-gray-300">Server Status</h4>
              <div class="flex items-center">
                <span class="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">{{ healthStatus.server.status }}</h3>
              </div>
            </div>
          </div>
        </div>
        
        <div class="border rounded-lg p-4">
          <div class="flex items-center">
            <div class="rounded-full bg-blue-100 p-3">
              <i class="fas fa-tachometer-alt text-blue-500"></i>
            </div>
            <div class="ml-4">
              <h4 class="text-gray-500 text-sm dark:text-gray-300">Response Time</h4>
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">{{ healthStatus.responseTime }}</h3>
            </div>
          </div>
        </div>
        
        <div class="border rounded-lg p-4">
          <div class="flex items-center">
            <div class="rounded-full bg-purple-100 p-3">
              <i class="fas fa-clock text-purple-500"></i>
            </div>
            <div class="ml-4">
              <h4 class="text-gray-500 text-sm dark:text-gray-300">Last Checked</h4>
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">{{ healthStatus.lastChecked }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Performance Metrics</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-medium text-gray-800 mb-2 dark:text-gray-200">Job Processing Rate</h4>
          <div class="h-64 bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center justify-center">
            <p class="text-gray-500 dark:text-gray-300">Job Processing Rate Chart</p>
          </div>
        </div>
        <div>
          <h4 class="font-medium text-gray-800 mb-2 dark:text-gray-200">Resource Usage</h4>
          <div class="h-64 bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center justify-center">
            <p class="text-gray-500 dark:text-gray-300">Resource Usage Chart</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stalled Jobs -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Stalled Jobs</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Topic</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Created</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Duration</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            <tr v-for="job in stalledJobs" :key="job.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{{ job.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ job.topic }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">{{ job.status }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ job.created }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ job.duration }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <div class="flex space-x-2">
                  <button class="text-primary-600 hover:text-primary-900" title="View Details" @click="viewJobDetails(job.id)">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="text-red-600 hover:text-red-900" title="Cancel" @click="cancelJob(job.id)">
                    <i class="fas fa-stop"></i>
                  </button>
                  <button class="text-red-600 hover:text-red-900" title="Delete" @click="deleteJob(job.id)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


    <!-- System Information -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">System Information</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Server Details</h4>
          <table class="min-w-full">
            <tbody>
              <tr>
                <td class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Server Version</td>
                <td class="py-2 text-sm text-gray-900 dark:text-gray-300"><a href="https://github.com/nbigot/minijob" target="_blank" class="button github-button" title="GitHub">
                  <font-awesome-icon icon="fa-brands fa-github" class="mr-2" />{{ systemInfo.version }}</a></td>
              </tr>
              <tr>
                <td class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Uptime</td>
                <td class="py-2 text-sm text-gray-900 dark:text-gray-300">{{ systemInfo.uptime }}</td>
              </tr>
              <tr>
                <td class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Host</td>
                <td class="py-2 text-sm text-gray-900 dark:text-gray-300">{{ systemInfo.host }}</td>
              </tr>
              <tr>
                <td class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Environment</td>
                <td class="py-2 text-sm text-gray-900 dark:text-gray-300">{{ systemInfo.environment }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Resource Usage</h4>
          <table class="min-w-full">
            <tbody>
              <tr v-for="(usage, key) in resourceUsage" :key="key">
                <td class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">{{ usage.label }}</td>
                <td class="py-2 text-sm text-gray-900 dark:text-gray-300">
                  <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div class="bg-blue-500 h-2.5 rounded-full" :style="{ width: usage.value + '%' }"></div>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ usage.value }}%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Prometheus Metrics -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Prometheus Metrics</h3>
      <p class="text-gray-600 mb-4 dark:text-gray-400">Access Prometheus metrics for detailed monitoring and alerting.</p>
      <div class="flex flex-wrap gap-4">
        <a href="#" class="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 text-white dark:text-gray-300 font-bold py-2 px-4 rounded" @click="openPrometheusDashboard">
          <i class="fas fa-chart-line mr-2"></i> View Prometheus Dashboard
        </a>
        <a href="#" class="bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white dark:text-gray-300 font-bold py-2 px-4 rounded" @click="openRawMetricsEndpoint">
          <i class="fas fa-code mr-2"></i> Raw Metrics Endpoint
        </a>
      </div>
    </div>

  </main>
</template>

<script>
export default {
  name: 'Health',
  data() {
    return {
      systemInfo: {
        version: 'MiniJob v1.2.3',
        uptime: '3 days, 7 hours, 22 minutes',
        host: 'minijob-server-01',
        environment: 'Production'
      },
      resourceUsage: {
        memory: { label: 'Memory Usage', value: 42 },
        disk: { label: 'Disk Usage', value: 28 },
        network: { label: 'Network I/O', value: 15 }
      },
      healthStatus: {
        server: {
          status: 'Healthy'
        },
        responseTime: '124ms',
        lastChecked: 'Just now'
      },
      stalledJobs: [
        {
          id: 'job-117',
          topic: 'data-processing',
          status: 'Stalled',
          created: '2023-05-14 10:30:45',
          duration: '1d 4h 25m'
        },
        {
          id: 'job-112',
          topic: 'report-generation',
          status: 'Stalled',
          created: '2023-05-14 08:15:22',
          duration: '1d 6h 40m'
        }
      ]
    }
  },
  methods: {
    viewJobDetails(jobId) {
      console.log(`Viewing details for job: ${jobId}`)
      // Implement view job details logic
    },
    cancelJob(jobId) {
      if (confirm(`Are you sure you want to cancel job ${jobId}?`)) {
        console.log(`Cancelling job: ${jobId}`)
        // Implement cancel job logic
      }
    },
    deleteJob(jobId) {
      if (confirm(`Are you sure you want to delete job ${jobId}? This action cannot be undone.`)) {
        console.log(`Deleting job: ${jobId}`)
        // Implement delete job logic
      }
    },
    openPrometheusDashboard() {
      console.log('Opening Prometheus dashboard')
      // Implement opening Prometheus dashboard logic
    },
    openRawMetricsEndpoint() {
      console.log('Opening raw metrics endpoint')
      // Implement opening raw metrics endpoint logic
    }
  },
  mounted() {
    // Initialize health monitoring
    console.log('Health monitoring initialized')
    // Add real-time monitoring logic here
  }
}
</script>