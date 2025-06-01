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
              <font-awesome-icon :icon="['fas', 'server']" class="text-green-500"></font-awesome-icon>
            </div>
            <div class="ml-4">
              <h4 class="text-gray-500 text-sm dark:text-gray-300">Server Status</h4>
              <div class="flex items-center">
                <span class="h-3 w-3 rounded-full mr-2" :class="getServerStatusColor(healthStatus.server.status)"></span>
                <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">{{ formatServerStatus(healthStatus.server.status) }}</h3>
              </div>
            </div>
          </div>
        </div>

        <div class="border rounded-lg p-4">
          <div class="flex items-center">
            <div class="rounded-full bg-blue-100 p-3">
              <font-awesome-icon :icon="['fas', 'tachometer-alt']" class="text-blue-500"></font-awesome-icon>
            </div>
            <div class="ml-4">
              <h4 class="text-gray-500 text-sm dark:text-gray-300">Response Time</h4>
              <div class="flex items-center">
                <span class="h-3 w-3 rounded-full mr-2" :class="getServerResponseTimeColor(healthStatus.responseTime)"></span>
                <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">{{ healthStatus.responseTime }}ms</h3>
              </div>
            </div>
          </div>
        </div>

        <div class="border rounded-lg p-4">
          <div class="flex items-center">
            <div class="rounded-full bg-purple-100 p-3">
              <font-awesome-icon :icon="['fas', 'clock']" class="text-purple-500"></font-awesome-icon>
            </div>
            <div class="ml-4">
              <h4 class="text-gray-500 text-sm dark:text-gray-300">Last Checked</h4>
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">{{ formatLastChecked(healthStatus.lastChecked) }}</h3>
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
          <div class="h-64 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 p-4">
            <JobProcessingChart :job-data="jobProcessingData" />
          </div>
        </div>
        <div>
          <h4 class="font-medium text-gray-800 mb-2 dark:text-gray-200">Resource Usage</h4>
          <div class="h-64 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 p-4 flex items-center justify-center">
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
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusClass(job.status)">{{ job.status }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ job.created }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ job.duration }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <div class="flex space-x-2">
                  <button class="text-primary-600 hover:text-primary-900" title="View Details" @click="viewJobDetails(job.id)">
                    <font-awesome-icon :icon="['fas', 'eye']" />
                  </button>
                  <button class="text-red-600 hover:text-red-900" title="Cancel" @click="cancelJob(job.id)">
                    <font-awesome-icon :icon="['fas', 'stop']" />
                  </button>
                  <button class="text-red-600 hover:text-red-900" title="Delete" @click="deleteJob(job.id)">
                    <font-awesome-icon :icon="['fas', 'trash']" />
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
                  <font-awesome-icon icon="fa-brands fa-github" class="mr-2" />MiniJob {{ systemInfo.version }}</a></td>
              </tr>
              <tr>
                <td class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Uptime</td>
                <td class="py-2 text-sm text-gray-900 dark:text-gray-300">{{ formatUptime(systemInfo.uptime) }}</td>
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
          <font-awesome-icon :icon="['fas', 'chart-line']" class="mr-2" /> View Prometheus Dashboard
        </a>
        <a href="#" class="bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white dark:text-gray-300 font-bold py-2 px-4 rounded" @click="openRawMetricsEndpoint">
          <font-awesome-icon :icon="['fas', 'code']" class="mr-2" /> Raw Metrics Endpoint
        </a>
      </div>
    </div>

  </main>
</template>

<script>
import JobProcessingChart from '../components/JobProcessingChart.vue';
import { jobService, healthService } from '../services/index.js';
import { getStatusClass } from '../utils/statusClass.js';

export default {
  name: 'Health',
  components: {
    JobProcessingChart
  },
  data() {
    return {
      // Initialize with empty data, will be loaded from API/mocks
      systemInfo: {
        version: '',
        uptime: 0,
        host: '',
        environment: ''
      },
      resourceUsage: {
        memory: { label: 'Memory Usage', value: 0 },
        disk: { label: 'Disk Usage', value: 0 },
        network: { label: 'Network I/O', value: 0 }
      },
      healthStatus: {
        server: { status: 'unknown' },
        responseTime: 0,
        lastChecked: 0
      },
      stalledJobs: [],
      jobProcessingData: {
        labels: [],
        succeeded: [],
        failed: [],
        pending: []
      },
      simulationInterval: null
    }
  },
  methods: {
    getStatusClass,
    // Job processing simulation methods
    startJobProcessingSimulation() {
      this.simulationInterval = setInterval(() => {
        // Only simulate if we have existing data
        if (this.jobProcessingData.labels.length === 0) return;

        // Simulate new data point by removing first point and adding a new one
        const lastLabel = this.jobProcessingData.labels[this.jobProcessingData.labels.length - 1];
        const newLabel = this.getNextHourLabel(lastLabel);

        // Create new arrays instead of manipulating the existing ones for reactivity
        const newLabels = [...this.jobProcessingData.labels.slice(1), newLabel];
        const newSucceeded = [...this.jobProcessingData.succeeded.slice(1), this.getRandomInt(15, 35)];
        const newFailed = [...this.jobProcessingData.failed.slice(1), this.getRandomInt(0, 5)];
        const newPending = [...this.jobProcessingData.pending.slice(1), this.getRandomInt(3, 10)];

        // Update data - using Object.assign to ensure reactivity
        this.jobProcessingData = {
          labels: newLabels,
          succeeded: newSucceeded,
          failed: newFailed,
          pending: newPending
        };
      }, 5000); // Update every 5 seconds
    },

    stopJobProcessingSimulation() {
      if (this.simulationInterval) {
        clearInterval(this.simulationInterval);
      }
    },

    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getNextHourLabel(lastLabel) {
      const [hour, minute] = lastLabel.split(':').map(Number);
      const nextHour = (hour + 1) % 24;
      return `${nextHour}:${minute < 10 ? '0' + minute : minute}`;
    },

    formatServerStatus(status) {
      if (!status) return 'Unknown';

      return status === 'healthy' ? 'Healthy' :
             status === 'warning' ? 'Warning' :
             status === 'unhealthy' ? 'Unhealthy' : 'Unknown';
    },
    // Get server status color
    getServerStatusColor(status) {
      if (!status) return 'bg-gray-500';

      return status === 'healthy' ? 'bg-green-500' :
             status === 'warning' ? 'bg-yellow-500' :
             status === 'unhealthy' ? 'bg-red-500' : 'bg-gray-500';
    },
    // Get server response time color
    getServerResponseTimeColor(responseTime) {
      // Assuming response time is a integer in milliseconds
      if (!responseTime) return 'bg-gray-500';

      return responseTime < 100 ? 'bg-blue-500' :
             responseTime < 300 ? 'bg-yellow-500' :
             responseTime >= 300 ? 'bg-red-500' : 'bg-gray-500';
    },
    // Format server last checked time
    formatLastChecked(lastChecked) {
      // Assuming lastChecked is a Unix timestamp
      if (!lastChecked) return 'Unknown';
      if (lastChecked === 0) return 'Never';

      // Compare with current time
      const now = Math.floor(Date.now() / 1000);
      const diff = now - lastChecked;
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
      return `${Math.floor(diff / 86400)} days ago`;
    },
    // Format server uptime
    formatUptime(uptime) {
      // Assuming uptime is in seconds
      if (!uptime) return 'Unknown';
      const days = Math.floor(uptime / (24 * 3600));
      const hours = Math.floor((uptime % (24 * 3600)) / 3600);
      const minutes = Math.floor((uptime % (24 * 3600)) % 3600 / 60);
      return `${days} days, ${hours} hours, ${minutes} minutes`;
    },
    viewJobDetails(jobId) {
      console.log(`Viewing details for job: ${jobId}`)
      // TODO: Navigate to job details page or open modal
    },

    async cancelJob(jobId) {
      if (confirm(`Are you sure you want to cancel job ${jobId}?`)) {
        try {
          await jobService.cancelJob(jobId);

          // Update job status in the list
          const job = this.stalledJobs.find(j => j.id === jobId);
          if (job) {
            job.status = 'Cancelled';
          }

          this.$notify({
            title: 'Success',
            text: `Job ${jobId} was cancelled successfully`,
            type: 'success'
          });
        } catch (error) {
          console.error('Error cancelling job:', error);
          this.$notify({
            title: 'Error',
            text: error.message,
            type: 'error'
          });
        }
      }
    },

    async deleteJob(jobId) {
      if (confirm(`Are you sure you want to delete job ${jobId}? This action cannot be undone.`)) {
        try {
          await jobService.deleteJob(jobId);

          // Remove the job from the stalled jobs list
          this.stalledJobs = this.stalledJobs.filter(job => job.id !== jobId);

          this.$notify({
            title: 'Success',
            text: `Job ${jobId} was deleted successfully`,
            type: 'success'
          });
        } catch (error) {
          console.error('Error deleting job:', error);
          this.$notify({
            title: 'Error',
            text: error.message,
            type: 'error'
          });
        }
      }
    },

    async loadHealthData() {
      try {
        const healthStatus = await healthService.getHealthStatus();
        this.healthStatus = {
          ...this.healthStatus,
          ...healthStatus
        };
      } catch (error) {
        console.error('Error loading health status:', error);
        this.$notify({
          title: 'Warning',
          text: 'Failed to load health status',
          type: 'warn'
        });
      }
    },

    async loadSystemInfo() {
      try {
        const systemInfo = await healthService.getSystemInfo();
        this.systemInfo = {
          ...this.systemInfo,
          ...systemInfo
        };
      } catch (error) {
        console.error('Error loading system info:', error);
        this.$notify({
          title: 'Warning',
          text: 'Failed to load system information',
          type: 'warn'
        });
      }
    },

    async loadResourceUsage() {
      try {
        const resourceUsage = await healthService.getResourceUsage();
        this.resourceUsage = {
          ...this.resourceUsage,
          ...resourceUsage
        };
      } catch (error) {
        console.error('Error loading resource usage:', error);
        this.$notify({
          title: 'Warning',
          text: 'Failed to load resource usage',
          type: 'warn'
        });
      }
    },

    async loadStalledJobs() {
      try {
        const stalledJobs = await healthService.getStalledJobs();
        this.stalledJobs = stalledJobs;
      } catch (error) {
        console.error('Error loading stalled jobs:', error);
        this.$notify({
          title: 'Warning',
          text: 'Failed to load stalled jobs',
          type: 'warn'
        });
      }
    },

    async loadJobProcessingData() {
      try {
        const jobProcessingData = await healthService.getJobProcessingData();
        this.jobProcessingData = {
          ...this.jobProcessingData,
          ...jobProcessingData
        };
      } catch (error) {
        console.error('Error loading job processing data:', error);
        // Keep simulation if API fails
        console.log('Falling back to simulation data');
      }
    },

    async loadAllData() {
      await Promise.allSettled([
        this.loadHealthData(),
        this.loadSystemInfo(),
        this.loadResourceUsage(),
        this.loadStalledJobs(),
        this.loadJobProcessingData()
      ]);
    },

    openPrometheusDashboard() {
      console.log('Opening Prometheus dashboard');
      // Open Prometheus dashboard in new tab
      const prometheusUrl = import.meta.env.VITE_PROMETHEUS_URL || '/prometheus';
      window.open(prometheusUrl, '_blank');
    },

    async openRawMetricsEndpoint() {
      try {
        console.log('Opening raw metrics endpoint');
        const metricsUrl = `${import.meta.env.VITE_API_BASE_URL || '/api'}/metrics/prometheus`;
        window.open(metricsUrl, '_blank');
      } catch (error) {
        console.error('Error opening metrics endpoint:', error);
        this.$notify({
          title: 'Error',
          text: 'Failed to open metrics endpoint',
          type: 'error'
        });
      }
    }
  },
  async mounted() {
    // Initialize health monitoring
    console.log('Health monitoring initialized');
    this.startJobProcessingSimulation();

    // Load initial data
    await this.loadAllData();
  },
  beforeUnmount() {
    this.stopJobProcessingSimulation();
  }
}
</script>
