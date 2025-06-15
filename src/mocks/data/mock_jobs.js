import mock from "../mock.js";

// Mock data for jobs
let data = {
  jobs: [
    {
      id: "73b6a7e9-51e0-4982-a106-f54c4369271a",
      topic: "data-processing",
      status: "running",
      created: "2023-05-15 14:30:45",
      updated: "2023-05-15 14:35:12",
      name: "Data Processing Job",
      priority: "high",
      attempts: 1,
      maxAttempts: 3,
      progress: 75,
      data: {
        source: "external-api",
        destination: "database",
        syncType: "incremental",
      },
      duration: null,
      queue: "data-processing",
      worker: "worker-001",
    },
    {
      id: "f56cf42d-8b8a-4b95-b088-ae42dd9c1b56",
      topic: "email-notifications",
      status: "succeeded",
      created: "2023-05-15 14:20:33",
      updated: "2023-05-15 14:25:47",
      name: "Email Notification Job",
      priority: "medium",
      attempts: 1,
      maxAttempts: 3,
      progress: 100,
      data: {
        email: "user@example.com",
        subject: "Welcome Email",
        template: "welcome",
      },
      duration: 2000,
      queue: "email-notifications",
      worker: "worker-002",
    },
    {
      id: "3a7f1e5c-d254-4071-beff-9fe72171c6b9",
      topic: "report-generation",
      status: "failed",
      created: "2023-05-15 14:10:22",
      updated: "2023-05-15 14:15:36",
      name: "Report Generation Job",
      priority: "high",
      attempts: 3,
      maxAttempts: 3,
      progress: 0,
      data: {
        reportType: "monthly",
        dateRange: {
          start: "2024-01-01",
          end: "2024-01-31",
        },
        format: "pdf",
      },
      duration: 5000,
      queue: "report-generation",
      worker: "worker-003",
      error: {
        message: "Connection timeout",
        stack: "Error: Connection timeout\n    at Database.connect...",
      },
    },
    {
      id: "2c8d69b4-a61f-4e0c-a2e6-791dd0f68991",
      topic: "file-uploads",
      status: "succeeded",
      created: "2023-05-15 14:00:11",
      updated: "2023-05-15 14:05:25",
      name: "File Upload Job",
      priority: "low",
      attempts: 1,
      maxAttempts: 3,
      progress: 100,
      data: {
        filename: "document.pdf",
        operation: "upload",
        size: "2.5MB",
      },
      duration: 1500,
      queue: "file-uploads",
      worker: "worker-004",
    },
    {
      id: "9ea2ceac-582d-4ef1-9f80-ca6581ed510c",
      topic: "data-processing",
      status: "queued",
      created: "2023-05-15 13:50:12",
      updated: "2023-05-15 13:50:12",
      name: "Image Processing Job",
      priority: "medium",
      attempts: 0,
      maxAttempts: 3,
      progress: 0,
      data: {
        imageUrl: "https://example.com/image.jpg",
        dimensions: [800, 600],
        format: "webp",
      },
      duration: null,
      queue: "image-processing",
      worker: null,
    },
    {
      id: "2813002e-3882-4d14-8641-d2231c6fb06a",
      topic: "email-notifications",
      status: "created",
      created: "2023-05-15 13:40:33",
      updated: "2023-05-15 13:40:33",
      name: "Welcome Email Job",
      priority: "low",
      attempts: 0,
      maxAttempts: 3,
      progress: 0,
      data: {
        email: "newuser@example.com",
        subject: "Welcome to our platform",
        template: "welcome",
      },
      duration: null,
      queue: "email-notifications",
      worker: null,
    },
  ],

  stalledJobs: [],
};

// Update stalled jobs data
data.stalledJobs = data.jobs.filter((job) => job.status === "stalled");

// Functions to handle mock data requests
mock.onGet("/api/v1/jobs").reply((config) => {
  const { page = 1, limit = 50 } = config.params || {};
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedJobs = data.jobs.slice(start, end);

  return [
    200,
    {
      jobs: paginatedJobs,
      total: data.jobs.length,
      page: parseInt(page),
      limit: parseInt(limit),
      hasMore: end < data.jobs.length,
    },
  ];
});

mock.onGet("/api/v1/jobs/stalled").reply(200, data.stalledJobs);

mock.onGet(/\/api\/v1\/job\/(.+)/).reply((config) => {
  const jobId = config.url.split("/").pop();
  const job = data.jobs.find((j) => j.id === jobId);

  if (job) {
    return [200, job];
  } else {
    return [404, { error: "Job not found" }];
  }
});

mock.onDelete(/\/api\/v1\/job\/(.+)/).reply((config) => {
  const jobId = config.url.split("/").pop();
  const jobIndex = data.jobs.findIndex((j) => j.id === jobId);

  if (jobIndex !== -1) {
    const deletedJob = data.jobs.splice(jobIndex, 1)[0];
    // Update stalled jobs list
    data.stalledJobs = data.jobs.filter((job) => job.status === "stalled");
    return [200, { success: true, deletedJob }];
  } else {
    return [404, { error: "Job not found" }];
  }
});

mock.onPost(/\/api\/v1\/job\/(.+)\/cancel/).reply((config) => {
  const jobId = config.url.split("/")[2];
  const job = data.jobs.find((j) => j.id === jobId);

  if (job) {
    job.status = "cancelled";
    job.updatedAt = new Date().toISOString();
    // Update stalled jobs list
    data.stalledJobs = data.jobs.filter((job) => job.status === "stalled");
    return [200, { success: true, job }];
  } else {
    return [404, { error: "Job not found" }];
  }
});

mock.onPost(/\/api\/v1\/job\/(.+)\/retry/).reply((config) => {
  const jobId = config.url.split("/")[2];
  const job = data.jobs.find((j) => j.id === jobId);

  if (job) {
    job.status = "waiting";
    job.attempts = 0;
    job.updatedAt = new Date().toISOString();
    delete job.error;
    delete job.failedAt;
    delete job.stalledAt;
    // Update stalled jobs list
    data.stalledJobs = data.jobs.filter((job) => job.status === "stalled");
    return [200, { success: true, job }];
  } else {
    return [404, { error: "Job not found" }];
  }
});

// Helper functions for generating dynamic mock data
export const mockDataHelpers = {
  findJobById(jobId) {
    return data.jobs.find((job) => job.id === jobId);
  },

  updateJobStatus(jobId, status) {
    const job = this.findJobById(jobId);
    if (job) {
      job.status = status;
      job.updatedAt = new Date().toISOString();
      // Update stalled jobs list
      data.stalledJobs = data.jobs.filter((job) => job.status === "stalled");
      return job;
    }
    return null;
  },

  removeJob(jobId) {
    const index = data.jobs.findIndex((job) => job.id === jobId);
    if (index !== -1) {
      const removedJob = data.jobs.splice(index, 1)[0];
      // Update stalled jobs list
      data.stalledJobs = data.jobs.filter((job) => job.status === "stalled");
      return removedJob;
    }
    return null;
  },
};
