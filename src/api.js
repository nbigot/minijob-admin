// Simple API client for MiniJob Admin
// This is a mock implementation for demonstration purposes

// Mock data
const mockJobs = [
  { id: 'job-123', status: 'running', created: new Date(Date.now() - 20 * 60 * 1000), type: 'data-processing' },
  { id: 'job-122', status: 'queued', created: new Date(Date.now() - 45 * 60 * 1000), type: 'email-notifications' },
  { id: 'job-121', status: 'failed', created: new Date(Date.now() - 3 * 60 * 60 * 1000), type: 'report-generation' },
  { id: 'job-120', status: 'succeeded', created: new Date(Date.now() - 5 * 60 * 60 * 1000), type: 'file-uploads' },
  { id: 'job-119', status: 'created', created: new Date(Date.now() - 10 * 60 * 1000), type: 'data-processing' }
];

const mockHealth = {
  status: 'healthy',
  version: '1.2.3',
  uptime: '3d 4h 12m',
  lastChecked: new Date()
};

const mockResources = [
  { id: 1, name: 'database-connection', status: 'locked', jobId: 'job-123' },
  { id: 2, name: 'file-system', status: 'locked', jobId: 'job-119' },
  { id: 3, name: 'api-key', status: 'locked', jobId: 'job-117' },
  { id: 4, name: 'email-sender', status: 'available', jobId: null },
  { id: 5, name: 'report-generator', status: 'available', jobId: null }
];

// API client
const api = {
  // Get jobs with optional filtering
  getJobs: async ({ limit = 10, status = null } = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredJobs = [...mockJobs];
    if (status) {
      filteredJobs = filteredJobs.filter(job => job.status === status);
    }
    
    return {
      data: {
        items: filteredJobs.slice(0, limit),
        total: mockJobs.length
      }
    };
  },
  
  // Get system health information
  getHealth: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      data: mockHealth
    };
  },
  
  // Get resources information
  getResources: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      data: mockResources
    };
  }
};

export default api;