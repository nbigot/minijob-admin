import mock from "../mock.js";

// Mock data for health monitoring
let data = {
  systemInfo: {
    code: 200,
    message: "success",
    systemInfo: {
      version: "v1.2.3",
      uptime: 1234567, // in seconds
      hostname: "minijob-mock.localhost",
      environment: "Simulation",
    },
  },

  healthStatus: {
    server: {
      status: "healthy",
    },
    responseTime: 17,
    lastChecked: 1747464500, // Unix timestamp
  },
};

// Functions to handle mock data requests
mock.onGet("/api/v1/system/health").reply(200, data.healthStatus);
mock.onGet("/api/v1/system/info").reply(200, data.systemInfo);
