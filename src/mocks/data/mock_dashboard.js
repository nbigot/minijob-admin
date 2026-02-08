import mock from "../mock.js";

// Mock data for dashboard
let data = {
  jobStats: {
    createdJobs: 24,
    queuedJobs: 12,
    runningJobs: 8,
    succeededJobs: 156,
    failedJobs: 7,
  },

  newlyActiveJobs: [
    {
      id: "73b6a7e9-51e0-4982-a106-f54c4369271a",
      topic: "data-processing",
      state: "Running",
      created: "2023-05-15 14:30:45",
      updated: "2023-05-15 14:35:12",
    },
    {
      id: "f56cf42d-8b8a-4b95-b088-ae42dd9c1b56",
      topic: "email-notifications",
      state: "Succeeded",
      created: "2023-05-15 14:20:33",
      updated: "2023-05-15 14:25:47",
    },
    {
      id: "3a7f1e5c-d254-4071-beff-9fe72171c6b9",
      topic: "report-generation",
      state: "Failed",
      created: "2023-05-15 14:10:22",
      updated: "2023-05-15 14:15:36",
    },
  ],

  lockedResources: [
    {
      resourceName: "database-connection",
      jobUuid: "73b6a7e9-51e0-4982-a106-f54c4369271a",
      topic: "data-processing",
      startTime: Math.floor(Date.now() / 1000) - 5 * 60, // 5 minutes ago in seconds
      lockDuration: 5 * 60, // 5 minutes in seconds
    },
    {
      resourceName: "file-system",
      jobUuid: "9e7b3fee-84c5-4fd0-b8e6-8e735c7deca1",
      topic: "file-uploads",
      startTime: Math.floor(Date.now() / 1000) - 25 * 60, // 25 minutes ago in seconds
      lockDuration: 25 * 60, // 25 minutes in seconds
    },
    {
      resourceName: "api-key",
      jobUuid: "a8f2e357-1d2c-4b6e-9d0f-e5c7b3461d9a",
      topic: "email-notifications",
      startTime: Math.floor(Date.now() / 1000) - 35 * 60, // 35 minutes ago in seconds
      lockDuration: 35 * 60, // 35 minutes in seconds
    },
  ],

  jobsByTopic: {
    "data-processing": 87,
    "email-notifications": 56,
    "report-generation": 34,
    "file-uploads": 22,
    other: 8,
  },

  stalledJobs: [
    {
      id: "a8f2e357-1d2c-4b6e-9d0f-e5c7b3461d9a",
      topic: "data-processing",
      state: "running",
      created: "2024-11-20 10:30:45",
      duration: "1d 14h 25m",
    },
    {
      id: "bd93c8e2-4f57-49e7-b5d8-1a2b3c4d5e6f",
      topic: "report-generation",
      state: "running",
      created: "2024-11-20 08:15:22",
      duration: "1d 16h 40m",
    },
    {
      id: "c5d4e9f1-2a3b-4c5d-6e7f-8a9b0c1d2e3f",
      topic: "email-notification",
      state: "running",
      created: "2024-11-21 15:45:10",
      duration: "9h 20m",
    },
    {
      id: "d7e8f9a0-3b4c-5d6e-7f8a-9b0c1d2e3f4a",
      topic: "data-export",
      state: "queued",
      created: "2024-11-21 18:30:00",
      duration: "6h 35m",
    },
    {
      id: "e9f0a1b2-4c5d-6e7f-8a9b-0c1d2e3f4a5b",
      topic: "backup-job",
      state: "running",
      created: "2024-11-19 22:00:00",
      duration: "2d 3h 5m",
    },
  ],

  jobProcessingData: {
    labels: ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
    succeeded: [12, 19, 15, 21, 25, 31, 28, 24],
    failed: [2, 4, 1, 3, 2, 0, 2, 1],
    pending: [5, 8, 3, 4, 6, 9, 5, 7],
  },
};

// Functions to handle mock data requests
// Note: Dashboard routes have been migrated to /api/v1/metrics/* endpoints
// See mock_jobs.js for /api/v1/metrics/jobs/* routes
// See mock_resources.js for /api/v1/metrics/resources route
// See mock_topics.js for /api/v1/metrics/topics route

// Helper functions for generating dynamic mock data
export const mockDataHelpers = {
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  getNextHourLabel(lastLabel) {
    const [hour, minute] = lastLabel.split(":").map(Number);
    const nextHour = (hour + 1) % 24;
    return `${nextHour}:${minute < 10 ? "0" + minute : minute}`;
  },

  generateRandomJobProcessingData(labels) {
    return {
      labels: [...labels],
      succeeded: labels.map(() => this.getRandomInt(15, 35)),
      failed: labels.map(() => this.getRandomInt(0, 5)),
      pending: labels.map(() => this.getRandomInt(3, 10)),
    };
  },

  updateJobStats() {
    // Simulate changing job statistics
    data.jobStats = {
      createdJobs: this.getRandomInt(20, 30),
      queuedJobs: this.getRandomInt(8, 15),
      runningJobs: this.getRandomInt(5, 12),
      succeededJobs: this.getRandomInt(140, 170),
      failedJobs: this.getRandomInt(3, 10),
    };
    return data.jobStats;
  },
};
