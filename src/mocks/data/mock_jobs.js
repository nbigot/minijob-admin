import mock from "../mock.js";

// Mock data for jobs
let data = {
  jobs: [
    {
      id: "73b6a7e9-51e0-4982-a106-f54c4369271a",
      topic: "mock-data-processing",
      priority: 2,
      properties: {
        source: "external-api",
        destination: "database",
        syncType: "incremental",
      },
      history: [
        {
          eventType: "CREATE",
          timestamp: 1684159845000,
        },
        {
          eventType: "PENDING",
          timestamp: 1684159845000,
        },
        {
          eventType: "ENQUEUE",
          timestamp: 1684159845000,
        },
        {
          eventType: "START",
          timestamp: 1684160112000,
        },
      ],
      lockResources: ["external-api", "database"],
      userAgent: "MinijobAdmin/1.0",
      requester: "scheduler-daemon",
      name: "Data Processing Job",
      sessionId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      traceId: "",
      visibilityTimeout: 0,
      startAfter: 0,
      callbackUrl: "https://api.example.localhost/webhook/001",
      state: "running",
    },
    {
      id: "f56cf42d-8b8a-4b95-b088-ae42dd9c1b56",
      topic: "mock-email-notifications",
      priority: 1,
      properties: {
        email: "user@example.com",
        subject: "Welcome Email",
        template: "welcome",
      },
      history: [
        {
          eventType: "CREATE",
          timestamp: 1684159233000,
        },
        {
          eventType: "PENDING",
          timestamp: 1684159233000,
        },
        {
          eventType: "ENQUEUE",
          timestamp: 1684159233000,
        },
        {
          eventType: "START",
          timestamp: 1684159240000,
        },
        {
          eventType: "SUCCESS",
          timestamp: 1684159547000,
        },
      ],
      lockResources: ["email-service"],
      userAgent: "TaskScheduler/2.1",
      requester: "user-service",
      name: "Email Notification Job",
      sessionId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      traceId: "",
      visibilityTimeout: 0,
      startAfter: 0,
      callbackUrl: "https://api.example.localhost/webhook/002",
      state: "succeeded",
    },
    {
      id: "3a7f1e5c-d254-4071-beff-9fe72171c6b9",
      topic: "mock-report-generation",
      priority: 2,
      properties: {
        reportType: "monthly",
        dateRange: {
          start: "2024-01-01",
          end: "2024-01-31",
        },
        format: "pdf",
      },
      history: [
        {
          eventType: "CREATE",
          timestamp: 1684158622000,
        },
        {
          eventType: "PENDING",
          timestamp: 1684158622000,
        },
        {
          eventType: "ENQUEUE",
          timestamp: 1684158622000,
        },
        {
          eventType: "START",
          timestamp: 1684158630000,
        },
        {
          eventType: "FAIL",
          timestamp: 1684158936000,
        },
      ],
      lockResources: ["report-engine", "database"],
      userAgent: "MinijobAdmin/1.0",
      requester: "admin-user",
      name: "Report Generation Job",
      sessionId: "c3d4e5f6-a7b8-9012-cdef-123456789012",
      traceId: "",
      visibilityTimeout: 0,
      startAfter: 0,
      callbackUrl: "https://api.example.localhost/webhook/003",
      state: "failed",
    },
    {
      id: "2c8d69b4-a61f-4e0c-a2e6-791dd0f68991",
      topic: "mock-file-uploads",
      priority: 0,
      properties: {
        filename: "document.pdf",
        operation: "upload",
        size: "2.5MB",
      },
      history: [
        {
          eventType: "CREATE",
          timestamp: 1684158011000,
        },
        {
          eventType: "PENDING",
          timestamp: 1684158011000,
        },
        {
          eventType: "ENQUEUE",
          timestamp: 1684158011000,
        },
        {
          eventType: "START",
          timestamp: 1684158015000,
        },
        {
          eventType: "SUCCESS",
          timestamp: 1684158325000,
        },
      ],
      lockResources: ["storage-service"],
      userAgent: "FileUploader/3.0",
      requester: "web-application",
      name: "File Upload Job",
      sessionId: "d4e5f6a7-b8c9-0123-def1-234567890123",
      traceId: "",
      visibilityTimeout: 0,
      startAfter: 0,
      callbackUrl: "https://api.example.localhost/webhook/004",
      state: "succeeded",
    },
    {
      id: "9ea2ceac-582d-4ef1-9f80-ca6581ed510c",
      topic: "mock-data-backup",
      priority: 1,
      properties: {
        imageUrl: "https://example.com/image.jpg",
        dimensions: [800, 600],
        format: "webp",
      },
      history: [
        {
          eventType: "CREATE",
          timestamp: 1684157412000,
        },
        {
          eventType: "PENDING",
          timestamp: 1684157412000,
        },
        {
          eventType: "ENQUEUE",
          timestamp: 1684157412000,
        },
      ],
      lockResources: ["image-service"],
      userAgent: "ImageProcessor/2.5",
      requester: "content-manager",
      name: "Image Processing Job",
      sessionId: "e5f6a7b8-c9d0-1234-ef12-345678901234",
      traceId: "",
      visibilityTimeout: 0,
      startAfter: 0,
      callbackUrl: "https://api.example.localhost/webhook/005",
      state: "queued",
    },
    {
      id: "2813002e-3882-4d14-8641-d2231c6fb06a",
      topic: "mock-email-notifications",
      priority: 0,
      properties: {
        email: "newuser@example.com",
        subject: "Welcome to our platform",
        template: "welcome",
      },
      history: [
        {
          eventType: "CREATE",
          timestamp: 1684156833000,
        },
        {
          eventType: "DELAY",
          timestamp: 1684156833000,
        },
      ],
      lockResources: ["email-service", "user-service"],
      userAgent: "TaskScheduler/2.1",
      requester: "registration-service",
      name: "Welcome Email Job",
      sessionId: "f6a7b8c9-d0e1-2345-f123-456789012345",
      traceId: "",
      visibilityTimeout: 0,
      startAfter: 1684157133000,
      callbackUrl: "",
      state: "delayed",
    },
  ],

  stalledJobs: [
    {
      id: "a8f2e357-1d2c-4b6e-9d0f-e5c7b3461d9a",
      topic: "data-processing",
      state: "running",
      created: 1700473845000,
      duration: 138300000,
    },
    {
      id: "bd93c8e2-4f57-49e7-b5d8-1a2b3c4d5e6f",
      topic: "report-generation",
      state: "running",
      created: 1700465722000,
      duration: 146400000,
    },
    {
      id: "c5d4e9f1-2a3b-4c5d-6e7f-8a9b0c1d2e3f",
      topic: "email-notification",
      state: "running",
      created: 1700579110000,
      duration: 33600000,
    },
    {
      id: "d7e8f9a0-3b4c-5d6e-7f8a-9b0c1d2e3f4a",
      topic: "data-export",
      state: "queued",
      created: 1700589000000,
      duration: 23700000,
    },
    {
      id: "e9f0a1b2-4c5d-6e7f-8a9b-0c1d2e3f4a5b",
      topic: "backup-job",
      state: "running",
      created: 1700428800000,
      duration: 183900000,
    },
  ],
};

// Functions to handle mock data requests
mock.onGet("/api/v1/jobs/").reply((config) => {
  const { page = 1, limit = 50, topic = "", status = "", search = "" } = config.params || {};

  // Filter jobs based on query parameters
  let filteredJobs = data.jobs;

  // Filter by topic
  if (topic) {
    filteredJobs = filteredJobs.filter((job) => job.topic === topic);
  }

  // Filter by status (state)
  if (status) {
    filteredJobs = filteredJobs.filter((job) => job.state === status);
  }

  // Filter by search (search in id, name, or topic)
  if (search) {
    const searchLower = search.toLowerCase();
    filteredJobs = filteredJobs.filter(
      (job) =>
        job.id.toLowerCase().includes(searchLower) ||
        (job.name && job.name.toLowerCase().includes(searchLower)) ||
        job.topic.toLowerCase().includes(searchLower)
    );
  }

  // Paginate filtered results
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedJobs = filteredJobs.slice(start, end);

  return [
    200,
    {
      jobs: paginatedJobs,
      total: filteredJobs.length,
      page: parseInt(page),
      limit: parseInt(limit),
      hasMore: end < filteredJobs.length,
      totalpages: Math.ceil(filteredJobs.length / limit),
    },
  ];
});

mock.onGet("/api/v1/metrics/jobs/stalled").reply(200, {
  code: 200,
  message: "success",
  jobs: data.stalledJobs,
});

// Get job statistics
// Cumulative counters for /api/v1/metrics/jobs/activity (total events since server start)
let jobActivityCounters = {
  created: 24,
  delayed: 3,
  pending: 5,
  enqueued: 12,
  started: 8,
  succeeded: 156,
  failed: 7,
  canceled: 4,
  hidden: 2,
  deleted: 18,
  timeout: 1,
  terminated: 2,
};

// Current state counters for /api/v1/metrics/jobs/processing (current job counts by status)
let currentJobStats = {
  existingJobs: 215,
  createdJobs: 0,
  delayedJobs: 3,
  pendingJobs: 5,
  queuedJobs: 12,
  runningJobs: 8,
  succeededJobs: 156,
  failedJobs: 7,
  hiddenJobs: 2,
  canceledJobs: 4,
  deletedJobs: 18,
};

mock.onGet("/api/v1/metrics/jobs/activity").reply(200, {
  code: 200,
  message: "success",
  jobActivity: {
    created: jobActivityCounters.created,
    delayed: jobActivityCounters.delayed,
    pending: jobActivityCounters.pending,
    enqueued: jobActivityCounters.enqueued,
    started: jobActivityCounters.started,
    succeeded: jobActivityCounters.succeeded,
    failed: jobActivityCounters.failed,
    canceled: jobActivityCounters.canceled,
    hidden: jobActivityCounters.hidden,
    deleted: jobActivityCounters.deleted,
    timeout: jobActivityCounters.timeout,
    terminated: jobActivityCounters.terminated,
  },
});

// Simulate increasing counters for job activity (cumulative)
setInterval(() => {
  jobActivityCounters.created += Math.floor(Math.random() * 3);
  jobActivityCounters.started += Math.floor(Math.random() * 3);
  jobActivityCounters.succeeded += Math.floor(Math.random() * 4);
  jobActivityCounters.failed += Math.floor(Math.random() * 2);
  jobActivityCounters.enqueued += Math.floor(Math.random() * 2);
  jobActivityCounters.pending += Math.floor(Math.random() * 2);
  jobActivityCounters.delayed += Math.floor(Math.random() * 1);
  jobActivityCounters.canceled += Math.floor(Math.random() * 1);

  // Update current state counters to simulate realistic job state changes
  const newRunning = Math.max(0, currentJobStats.runningJobs + Math.floor(Math.random() * 2) - 1);
  const completedJobs = currentJobStats.runningJobs - newRunning;

  currentJobStats.runningJobs = newRunning;
  currentJobStats.succeededJobs += Math.max(0, Math.floor(completedJobs * 0.8));
  currentJobStats.failedJobs += Math.max(0, Math.floor(completedJobs * 0.2));
  currentJobStats.queuedJobs = Math.max(0, currentJobStats.queuedJobs + Math.floor(Math.random() * 3) - 1);
  currentJobStats.existingJobs =
    currentJobStats.queuedJobs + currentJobStats.runningJobs + currentJobStats.succeededJobs + currentJobStats.failedJobs;
}, 3000);

// Get recent jobs
mock.onGet("/api/v1/metrics/jobs/recent").reply(200, {
  code: 200,
  message: "success",
  jobs: [
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
});

// Get Job Activity Metrics data
mock.onGet("/api/v1/metrics/jobs/processing").reply((config) => {
  return [
    200,
    {
      code: 200,
      message: "success",
      jobStats: {
        existingJobs: currentJobStats.existingJobs,
        createdJobs: currentJobStats.createdJobs,
        delayedJobs: currentJobStats.delayedJobs,
        pendingJobs: currentJobStats.pendingJobs,
        queuedJobs: currentJobStats.queuedJobs,
        runningJobs: currentJobStats.runningJobs,
        succeededJobs: currentJobStats.succeededJobs,
        failedJobs: currentJobStats.failedJobs,
        hiddenJobs: currentJobStats.hiddenJobs,
        canceledJobs: currentJobStats.canceledJobs,
        deletedJobs: currentJobStats.deletedJobs,
      },
    },
  ];
});

mock.onGet(/\/api\/v1\/job\/(.+)/).reply((config) => {
  // Get job by ID
  const jobId = config.url.split("/").pop();
  const job = data.jobs.find((j) => j.id === jobId);

  if (job) {
    return [200, { code: 200, message: "success", job: job }];
  } else {
    return [404, { code: 1001, error: "job not found", jobUUID: jobId }];
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

mock.onDelete("/api/v1/jobs/").reply(() => {
  // Simulate deleting all jobs
  return [200, { code: 200, message: "success" }];
});

mock.onDelete("/api/v1/jobs/queued").reply(() => {
  // Simulate clearing job queues
  return [200, { code: 200, message: "success" }];
});

// Add POST handler for creating new jobs
mock.onPost("/api/v1/job/").reply((config) => {
  const jobData = JSON.parse(config.data);

  const newJob = {
    id: String(self.crypto.randomUUID()),
    topic: jobData.topic || "default",
    status: "created",
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    name: jobData.name || "New Job",
    priority: jobData.priority || "medium",
    attempts: 0,
    maxAttempts: jobData.maxAttempts || 3,
    progress: 0,
    properties: jobData.properties || jobData.data || {},
    history: [
      {
        eventType: "CREATE",
        timestamp: Date.now(),
      },
    ],
    lockResources: jobData.lockResources || [],
    userAgent: jobData.userAgent || "MinijobAdmin/1.0",
    requester: jobData.requester || "unknown",
    sessionId: jobData.sessionId || String(self.crypto.randomUUID()),
    traceId: jobData.traceId || "",
    visibilityTimeout: jobData.visibilityTimeout || 0,
    startAfter: jobData.startAfter || 0,
    callbackUrl: jobData.callbackUrl || "",
    duration: null,
    queue: jobData.queue || jobData.topic || "default",
    worker: null,
    ...jobData,
  };

  data.jobs.unshift(newJob);

  return [
    201,
    {
      success: true,
      job: newJob,
      message: "Job created successfully",
    },
  ];
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
