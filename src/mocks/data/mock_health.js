import mock from "../mock.js";

// Mock data for system information
let systemInfoData = {
  code: 200,
  message: "success",
  systemInfo: {
    version: "v1.2.3",
    uptime: 1234567, // in seconds
    hostname: "minijob-mock.localhost",
    environment: "Simulation",
  },
};

// Mock data for health status
let healthStatusData = {};

// Functions to handle mock data requests
mock.onGet("/api/v1/system/health").reply(200, healthStatusData);
mock.onGet("/api/v1/system/info").reply(200, systemInfoData);
