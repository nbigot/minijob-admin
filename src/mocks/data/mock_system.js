import mock from "../mock.js"

// Mock data for system operations
let data = {
  serverStatus: {
    status: 'running',
    uptime: 3600000, // 1 hour in ms
    version: 'v1.2.3'
  }
};

// Functions to handle mock data requests
mock.onPost('/system/restart').reply(() => {
  // Simulate server restart
  data.serverStatus.uptime = 0;
  return [200, { success: true, message: 'Server restart initiated' }];
});

mock.onPost('/system/shutdown').reply(() => {
  // Simulate server shutdown
  data.serverStatus.status = 'shutting down';
  return [200, { success: true, message: 'Server shutdown initiated' }];
});

mock.onDelete('/system/jobs/all').reply(() => {
  // Simulate deleting all jobs
  return [200, { success: true, message: 'All jobs deleted successfully', deletedCount: 207 }];
});

mock.onPost('/system/queues/clear').reply(() => {
  // Simulate clearing job queues
  return [200, { success: true, message: 'Job queues cleared successfully', clearedCount: 24 }];
});

mock.onPost('/system/resources/unlock-all').reply(() => {
  // Simulate unlocking all resources
  return [200, { success: true, message: 'All resources unlocked successfully', unlockedCount: 7 }];
});

// Helper functions for generating dynamic mock data
export const mockDataHelpers = {
  getServerStatus() {
    return data.serverStatus;
  },
  
  updateServerStatus(newStatus) {
    data.serverStatus = { ...data.serverStatus, ...newStatus };
    return data.serverStatus;
  }
};