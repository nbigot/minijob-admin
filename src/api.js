// Simple API client for MiniJob Admin
// This is a mock implementation for demonstration purposes

// Mock data
const mockJobs = [
  { id: "73b6a7e9-51e0-4982-a106-f54c4369271a", status: "running", created: new Date(Date.now() - 20 * 60 * 1000), type: "data-processing" },
  { id: "f56cf42d-8b8a-4b95-b088-ae42dd9c1b56", status: "queued", created: new Date(Date.now() - 45 * 60 * 1000), type: "email-notifications" },
  { id: "3a7f1e5c-d254-4071-beff-9fe72171c6b9", status: "failed", created: new Date(Date.now() - 3 * 60 * 60 * 1000), type: "report-generation" },
  { id: "2c8d69b4-a61f-4e0c-a2e6-791dd0f68991", status: "succeeded", created: new Date(Date.now() - 5 * 60 * 60 * 1000), type: "file-uploads" },
  { id: "9e7b3fee-84c5-4fd0-b8e6-8e735c7deca1", status: "created", created: new Date(Date.now() - 10 * 60 * 1000), type: "data-processing" },
];

const mockHealth = {
  status: "healthy",
  version: "1.2.3",
  uptime: "3d 4h 12m",
  lastChecked: new Date(),
};

const mockResources = [
  { id: 1, name: "database-connection", status: "locked", jobId: "73b6a7e9-51e0-4982-a106-f54c4369271a" },
  { id: 2, name: "file-system", status: "locked", jobId: "9e7b3fee-84c5-4fd0-b8e6-8e735c7deca1" },
  { id: 3, name: "api-key", status: "locked", jobId: "a8f2e357-1d2c-4b6e-9d0f-e5c7b3461d9a" },
  { id: 4, name: "email-sender", status: "available", jobId: "1e0b3fee-84c5-4fd0-b8e6-8e735c7deca2" },
  { id: 5, name: "report-generator", status: "available", jobId: "33ab3fee-84c5-4fd0-b8e6-8e735c7de321" },
];

// API client
const api = {
  // Get jobs with optional filtering
  getJobs: async ({ limit = 10, status = null } = {}) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredJobs = [...mockJobs];
    if (status) {
      filteredJobs = filteredJobs.filter((job) => job.status === status);
    }

    return {
      data: {
        items: filteredJobs.slice(0, limit),
        total: mockJobs.length,
      },
    };
  },

  // Get system health information
  getHealth: async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      data: mockHealth,
    };
  },

  // Get resources information
  getResources: async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      data: mockResources,
    };
  },
};

export default api;
