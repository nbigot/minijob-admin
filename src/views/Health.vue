<template>
  <main class="flex-1 p-4 md:p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
        Health &amp; Monitoring
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Monitor server health and performance metrics
      </p>
    </div>

    <!-- Health Status -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Health Status
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="border rounded-lg p-4">
          <div class="flex items-center">
            <div class="rounded-full bg-green-100 p-3">
              <font-awesome-icon
                :icon="['fas', 'server']"
                class="text-green-500"
              ></font-awesome-icon>
            </div>
            <div class="ml-4">
              <h4 class="text-gray-500 text-sm dark:text-gray-300">
                Server Status
              </h4>
              <div class="flex items-center">
                <span
                  class="h-3 w-3 rounded-full mr-2"
                  :class="getServerStatusColor(healthStatus.server.status)"
                ></span>
                <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {{ formatServerStatus(healthStatus.server.status) }}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div class="border rounded-lg p-4">
          <div class="flex items-center">
            <div class="rounded-full bg-blue-100 p-3">
              <font-awesome-icon
                :icon="['fas', 'tachometer-alt']"
                class="text-blue-500"
              ></font-awesome-icon>
            </div>
            <div class="ml-4">
              <h4 class="text-gray-500 text-sm dark:text-gray-300">
                Response Time
              </h4>
              <div class="flex items-center">
                <span
                  class="h-3 w-3 rounded-full mr-2"
                  :class="getServerResponseTimeColor(healthStatus.responseTime)"
                ></span>
                <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {{ healthStatus.responseTime }}ms
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div class="border rounded-lg p-4">
          <div class="flex items-center">
            <div class="rounded-full bg-purple-100 p-3">
              <font-awesome-icon
                :icon="['fas', 'clock']"
                class="text-purple-500"
              ></font-awesome-icon>
            </div>
            <div class="ml-4">
              <h4 class="text-gray-500 text-sm dark:text-gray-300">
                Last Checked
              </h4>
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">
                {{ formatLastChecked(healthStatus.lastChecked) }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- System Information -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        System Information
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-medium text-gray-800 mb-2 dark:text-gray-200">
            Server Details
          </h4>
          <div
            class="bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 p-4"
          >
            <table class="min-w-full">
              <tbody>
                <tr>
                  <td
                    class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Server Version
                  </td>
                  <td class="py-2 text-sm text-gray-900 dark:text-gray-300">
                    <a
                      href="https://github.com/nbigot/minijob"
                      target="_blank"
                      class="button github-button"
                      title="GitHub"
                    >
                      <font-awesome-icon
                        icon="fa-brands fa-github"
                        class="mr-2"
                      />MiniJob {{ systemInfo.version }}</a
                    >
                  </td>
                </tr>
                <tr>
                  <td
                    class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Uptime
                  </td>
                  <td class="py-2 text-sm text-gray-900 dark:text-gray-300">
                    {{ formatUptime(systemInfo.uptime) }}
                  </td>
                </tr>
                <tr>
                  <td
                    class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Host
                  </td>
                  <td class="py-2 text-sm text-gray-900 dark:text-gray-300">
                    {{ systemInfo.hostname }}
                  </td>
                </tr>
                <tr>
                  <td
                    class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Environment
                  </td>
                  <td class="py-2 text-sm text-gray-900 dark:text-gray-300">
                    {{ systemInfo.environment }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h4 class="font-medium text-gray-800 mb-2 dark:text-gray-200">
            Prometheus Metrics
          </h4>
          <div
            class="bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 p-4 flex flex-col justify-center"
          >
            <p class="text-gray-600 mb-4 dark:text-gray-400">
              Access Prometheus metrics for detailed monitoring and alerting.
            </p>
            <div class="flex flex-col gap-3">
              <a
                href="#"
                class="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 text-white dark:text-gray-300 font-bold py-2 px-4 rounded text-center"
                @click="openPrometheusDashboard"
              >
                <font-awesome-icon :icon="['fas', 'chart-line']" class="mr-2" />
                View Prometheus Dashboard
              </a>
              <a
                href="#"
                class="bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white dark:text-gray-300 font-bold py-2 px-4 rounded text-center"
                @click="openRawMetricsEndpoint"
              >
                <font-awesome-icon :icon="['fas', 'code']" class="mr-2" /> Raw
                Metrics Endpoint
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { healthService } from "../services/index.js";

export default {
  name: "HealthMonitor",
  components: {},
  data() {
    return {
      // Initialize with empty data, will be loaded from API/mocks
      systemInfo: {
        version: "",
        uptime: 0,
        hostname: "",
        environment: "",
      },
      healthStatus: {
        server: { status: "unknown" },
        responseTime: 0,
        lastChecked: 0,
      },
    };
  },
  async mounted() {
    // Load initial data
    await this.loadAllData();
  },
  methods: {
    formatServerStatus(status) {
      if (!status) return "Unknown";

      return status === "healthy"
        ? "Healthy"
        : status === "warning"
        ? "Warning"
        : status === "unhealthy"
        ? "Unhealthy"
        : status === "unreachable"
        ? "Unreachable"
        : "Unknown";
    },
    // Get server status color
    getServerStatusColor(status) {
      if (!status) return "bg-gray-500";

      return status === "healthy"
        ? "bg-green-500"
        : status === "warning"
        ? "bg-yellow-500"
        : status === "unhealthy"
        ? "bg-red-500"
        : "bg-gray-500";
    },
    // Get server response time color
    getServerResponseTimeColor(responseTime) {
      // Assuming response time is a integer in milliseconds
      if (!responseTime) return "bg-gray-500";

      return responseTime < 100
        ? "bg-blue-500"
        : responseTime < 300
        ? "bg-yellow-500"
        : responseTime >= 300
        ? "bg-red-500"
        : "bg-gray-500";
    },
    // Format server last checked time
    formatLastChecked(lastChecked) {
      // Assuming lastChecked is a Unix timestamp
      if (lastChecked === 0) return "Never";
      if (!lastChecked) return "Unknown";

      // Format as human-readable time
      const date = new Date(lastChecked * 1000);
      return date.toLocaleString();
    },
    // Format server uptime
    formatUptime(uptime) {
      // Assuming uptime is in seconds
      if (!uptime) return "Unknown";
      const days = Math.floor(uptime / (24 * 3600));
      const hours = Math.floor((uptime % (24 * 3600)) / 3600);
      const minutes = Math.floor(((uptime % (24 * 3600)) % 3600) / 60);
      return `${days} days, ${hours} hours, ${minutes} minutes`;
    },

    async loadHealthData() {
      try {
        const healthStatus = await healthService.getHealthStatus();
        this.healthStatus = {
          ...this.healthStatus,
          ...healthStatus,
        };
      } catch (error) {
        console.error("Error loading health status:", error);
        this.$notify({
          title: "Warning",
          text: "Failed to load health status",
          type: "warn",
        });
      }
    },

    async loadSystemInfo() {
      try {
        const systemInfo = await healthService.getSystemInfo();
        this.systemInfo = {
          ...this.systemInfo,
          ...systemInfo,
        };
      } catch (error) {
        console.error("Error loading system info:", error);
        this.$notify({
          title: "Warning",
          text: "Failed to load system information",
          type: "warn",
        });
      }
    },

    async loadAllData() {
      await Promise.allSettled([this.loadHealthData(), this.loadSystemInfo()]);
    },

    openPrometheusDashboard() {
      console.log("Opening Prometheus dashboard");
      // Open Prometheus dashboard in new tab
      const prometheusUrl =
        import.meta.env.VITE_PROMETHEUS_URL || "/prometheus";
      window.open(prometheusUrl, "_blank");
    },

    async openRawMetricsEndpoint() {
      try {
        console.log("Opening raw metrics endpoint");
        const metricsUrl = `${
          import.meta.env.VITE_API_BASE_URL || "/api"
        }/metrics/prometheus`;
        window.open(metricsUrl, "_blank");
      } catch (error) {
        console.error("Error opening metrics endpoint:", error);
        this.$notify({
          title: "Error",
          text: "Failed to open metrics endpoint",
          type: "error",
        });
      }
    },

    handleRefreshData() {
      //console.log("Refreshing health data");
      this.loadAllData && this.loadAllData();
    },
  },
};
</script>
