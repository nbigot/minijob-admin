import mock from "../mock.js"

// Mock data for dashboard
let data = {
  jobStats: {
    createdJobs: 24,
    queuedJobs: 12,
    runningJobs: 8,
    succeededJobs: 156,
    failedJobs: 7
  },
  
  recentJobs: [
    {
      id: '73b6a7e9-51e0-4982-a106-f54c4369271a',
      topic: 'data-processing',
      status: 'Running',
      created: '2023-05-15 14:30:45',
      updated: '2023-05-15 14:35:12'
    },
    {
      id: 'f56cf42d-8b8a-4b95-b088-ae42dd9c1b56',
      topic: 'email-notifications',
      status: 'Succeeded',
      created: '2023-05-15 14:20:33',
      updated: '2023-05-15 14:25:47'
    },
    {
      id: '3a7f1e5c-d254-4071-beff-9fe72171c6b9',
      topic: 'report-generation',
      status: 'Failed',
      created: '2023-05-15 14:10:22',
      updated: '2023-05-15 14:15:36'
    }
  ],
  
  lockedResources: [
    { 
      id: 1, 
      name: 'database-connection', 
      jobId: '73b6a7e9-51e0-4982-a106-f54c4369271a', 
      lockedSince: new Date(Date.now() - 5 * 60 * 1000) 
    },
    { 
      id: 2, 
      name: 'file-system', 
      jobId: '9e7b3fee-84c5-4fd0-b8e6-8e735c7deca1', 
      lockedSince: new Date(Date.now() - 25 * 60 * 1000) 
    },
    { 
      id: 3, 
      name: 'api-key', 
      jobId: 'a8f2e357-1d2c-4b6e-9d0f-e5c7b3461d9a', 
      lockedSince: new Date(Date.now() - 35 * 60 * 1000) 
    }
  ],
  
  jobsByTopic: {
    'data-processing': 87,
    'email-notifications': 56,
    'report-generation': 34,
    'file-uploads': 22,
    'other': 8
  }
};

// Functions to handle mock data requests
mock.onGet('/dashboard').reply(200, {
  jobStats: data.jobStats,
  recentJobs: data.recentJobs,
  lockedResources: data.lockedResources,
  jobsByTopic: data.jobsByTopic
});

mock.onGet('/dashboard/job-stats').reply(200, data.jobStats);
mock.onGet('/dashboard/recent-jobs').reply(200, data.recentJobs);
mock.onGet('/dashboard/locked-resources').reply(200, data.lockedResources);

// Helper functions for generating dynamic mock data
export const mockDataHelpers = {
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  updateJobStats() {
    // Simulate changing job statistics
    data.jobStats = {
      createdJobs: this.getRandomInt(20, 30),
      queuedJobs: this.getRandomInt(8, 15),
      runningJobs: this.getRandomInt(5, 12),
      succeededJobs: this.getRandomInt(140, 170),
      failedJobs: this.getRandomInt(3, 10)
    };
    return data.jobStats;
  }
};