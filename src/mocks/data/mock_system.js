import mock from "../mock.js";

// Mock data for system operations
let data = {
  serverStatus: {
    status: "running",
    uptime: 3600000, // 1 hour in ms
    version: "v1.2.3",
  },
};

// Functions to handle mock data requests
mock.onPost("/api/v1/admin/server/restart").reply(() => {
  // Simulate server restart
  data.serverStatus.uptime = 0;
  return [200, { code: 200, message: "success" }];
});

mock.onPost("/api/v1/admin/server/shutdown").reply(() => {
  // Simulate server shutdown
  data.serverStatus.status = "shutting down";
  return [200, { code: 200, message: "success" }];
});
