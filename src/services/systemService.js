import apiClient from "./axios.js";

const makeApiRequest = async (method, url, operation) => {
  try {
    const response = await apiClient[method](url);
    if (response.status !== 200) {
      throw new Error(`Failed to ${operation}: ${response.data?.message || "unexpected error"}`);
    }
    return response.data;
  } catch (error) {
    throw new Error(`Failed to ${operation}: ${error.message}`);
  }
};

export const systemService = {
  async restartServer() {
    return makeApiRequest("post", "/api/v1/admin/server/restart", "restart server");
  },

  async shutdownServer() {
    return makeApiRequest("post", "/api/v1/admin/server/shutdown", "shutdown server");
  },

  async deleteAllJobs() {
    return makeApiRequest("delete", "/api/v1/jobs/", "delete all jobs");
  },

  async clearJobQueues() {
    return makeApiRequest("delete", "/api/v1/jobs/queued", "clear job queues");
  },

  async unlockAllResources() {
    return makeApiRequest("post", "/api/v1/resources/unlock", "unlock all resources");
  },
};
