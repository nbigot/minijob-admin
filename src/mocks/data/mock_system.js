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
  return [200, { success: true, message: "Server restart initiated" }];
});

mock.onPost("/api/v1/admin/server/shutdown").reply(() => {
  // Simulate server shutdown
  data.serverStatus.status = "shutting down";
  return [200, { success: true, message: "Server shutdown initiated" }];
});

mock.onDelete("/api/v1/jobs/").reply(() => {
  // Simulate deleting all jobs
  return [200, { success: true, message: "All jobs deleted successfully", deletedCount: 207 }];
});

mock.onDelete("/api/v1/jobs/queued").reply(() => {
  // Simulate clearing job queues
  return [200, { success: true, message: "Job queues cleared successfully", clearedCount: 24 }];
});

mock.onPost("/api/v1/resources/unlock").reply(() => {
  // Simulate unlocking all resources
  return [200, { success: true, message: "All resources unlocked successfully", unlockedCount: 7 }];
});

// Helper functions for generating dynamic mock data
export const mockDataHelpers = {
  getServerStatus() {
    return data.serverStatus;
  },

  updateServerStatus(newStatus) {
    data.serverStatus = { ...data.serverStatus, ...newStatus };
    return data.serverStatus;
  },
};
