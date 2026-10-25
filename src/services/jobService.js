import apiClient, { errorMessage } from "./axios.js";

// Helper function to compute display properties from job data
function enrichJobData(job) {
  const lastEvent = job.history?.[job.history.length - 1];

  // Compute created timestamp (first CREATE event)
  const createEvent = job.history?.find((e) => e.eventType === "CREATE");
  const created = createEvent ? new Date(createEvent.timestamp).toISOString().replace("T", " ").substring(0, 19) : "";

  // Compute updated timestamp (last event)
  const updated = lastEvent ? new Date(lastEvent.timestamp).toISOString().replace("T", " ").substring(0, 19) : created;

  // The job's state comes from the server (job.state)
  return {
    ...job,
    created,
    updated,
  };
}

export const jobService = {
  // Get all jobs
  async getJobs(params = {}) {
    try {
      const response = await apiClient.get("/api/v1/jobs/", { params });

      // Enrich jobs with computed display fields
      const enrichedJobs = response.data.jobs?.map(enrichJobData) || [];

      return {
        ...response.data,
        jobs: enrichedJobs,
      };
    } catch (error) {
      throw new Error(`Failed to fetch jobs: ${errorMessage(error)}`);
    }
  },

  // Get job by ID
  async getJobById(jobId) {
    try {
      const response = await apiClient.get(`/api/v1/job/${jobId}`);
      if (response.status === 404) {
        throw new Error(`Job with ID ${jobId} not found`);
      }
      return enrichJobData(response.data);
    } catch (error) {
      throw new Error(`Failed to fetch job ${jobId}: ${errorMessage(error)}`);
    }
  },

  // Get stalled jobs
  async getStalledJobs() {
    try {
      const response = await apiClient.get("/api/v1/metrics/jobs/stalled");
      const jobs = response.data.jobs || [];
      return jobs;
    } catch (error) {
      throw new Error(`Failed to fetch stalled jobs: ${error.message}`);
    }
  },

  // Delete job
  async deleteJob(jobId) {
    try {
      const response = await apiClient.delete(`/api/v1/job/${jobId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete job ${jobId}: ${errorMessage(error)}`);
    }
  },

  // Cancel job
  async cancelJob(jobId) {
    try {
      const response = await apiClient.post(`/api/v1/job/${jobId}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to cancel job ${jobId}: ${errorMessage(error)}`);
    }
  },

  // Retry job
  async retryJob(jobId) {
    try {
      const response = await apiClient.post(`/api/v1/jobs/${jobId}/retry`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to retry job ${jobId}: ${error.message}`);
    }
  },

  // Create a new job
  async createJob(jobData) {
    try {
      const response = await apiClient.post("/api/v1/job/", jobData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create job: ${errorMessage(error)}`);
    }
  },
};
