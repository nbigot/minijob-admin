import apiClient from "./axios.js";

export const healthService = {
  // Get health status
  async getHealthStatus() {
    const startTime = Date.now();

    try {
      const response = await apiClient.get("/api/v1/system/health");
      const responseTime = Date.now() - startTime;
      const lastChecked = Math.floor(Date.now() / 1000); // Unix timestamp

      if (response.status === 200) {
        return {
          server: {
            status: "healthy",
          },
          responseTime,
          lastChecked,
        };
      } else {
        return {
          server: {
            status: "unhealthy",
          },
          responseTime,
          lastChecked,
        };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;

      return {
        server: {
          status: "unreachable",
        },
        responseTime,
        lastChecked: null, // No successful check time for unreachable status
      };
    }
  },

  // Get system info
  async getSystemInfo() {
    try {
      const response = await apiClient.get("/api/v1/system/info");
      return response.data.systemInfo;
    } catch (error) {
      throw new Error("Failed to fetch system info");
    }
  },

  // Get metrics
  async getMetrics() {
    try {
      const response = await apiClient.get("/api/v1/metrics");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch metrics");
    }
  },

  // Get Prometheus metrics
  async getPrometheusMetrics() {
    try {
      const response = await apiClient.get("/api/v1/metrics/prometheus", {
        headers: { Accept: "text/plain" },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch Prometheus metrics");
    }
  },
};
