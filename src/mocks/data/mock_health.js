import mock from "../mock.js"

// Mock data for health monitoring
let data = {
  systemInfo: {
    version: 'v1.2.3',
    uptime: 1234567, // in seconds
    host: 'minijob-server-01',
    environment: 'Production'
  },
  
  resourceUsage: {
    memory: { label: 'Memory Usage', value: 42 },
    disk: { label: 'Disk Usage', value: 28 },
    network: { label: 'Network I/O', value: 15 }
  },
  
  healthStatus: {
    server: {
      status: 'healthy'
    },
    responseTime: 17,
    lastChecked: 1747464500 // Unix timestamp
  },
  
  stalledJobs: [
    {
      id: 'a8f2e357-1d2c-4b6e-9d0f-e5c7b3461d9a',
      topic: 'data-processing',
      status: 'Stalled',
      created: '2023-05-14 10:30:45',
      duration: '1d 4h 25m'
    },
    {
      id: 'bd93c8e2-4f57-49e7-b5d8-1a2b3c4d5e6f',
      topic: 'report-generation',
      status: 'Stalled',
      created: '2023-05-14 08:15:22',
      duration: '1d 6h 40m'
    }
  ],
  
  jobProcessingData: {
    labels: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
    succeeded: [12, 19, 15, 21, 25, 31, 28, 24],
    failed: [2, 4, 1, 3, 2, 0, 2, 1],
    pending: [5, 8, 3, 4, 6, 9, 5, 7]
  }
};

// Functions to handle mock data requests
mock.onGet('/health/status').reply(200, data.healthStatus);
mock.onGet('/health/system/info').reply(200, data.systemInfo);
mock.onGet('/health/system/resources').reply(200, data.resourceUsage);
mock.onGet('/health/stalled-jobs').reply(200, data.stalledJobs);
mock.onGet('/health/job-processing-data').reply(config => {
  const timeRange = config.params?.timeRange || '24h';
  // Generate dynamic data based on the last label
  const lastLabel = data.jobProcessingData.labels[data.jobProcessingData.labels.length - 1];
  const newLabels = Array.from({ length: 8 }, (_, i) => mockDataHelpers.getNextHourLabel(lastLabel));
  
  return [200, mockDataHelpers.generateRandomJobProcessingData(newLabels)];
});

// Helper functions for generating dynamic mock data
export const mockDataHelpers = {
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  getNextHourLabel(lastLabel) {
    const [hour, minute] = lastLabel.split(':').map(Number);
    const nextHour = (hour + 1) % 24;
    return `${nextHour}:${minute < 10 ? '0' + minute : minute}`;
  },
  
  generateRandomJobProcessingData(labels) {
    return {
      labels: [...labels],
      succeeded: labels.map(() => this.getRandomInt(15, 35)),
      failed: labels.map(() => this.getRandomInt(0, 5)),
      pending: labels.map(() => this.getRandomInt(3, 10))
    };
  }
};