import mock from "../mock.js";

// Mock data for resources
let data = {
  resourceStats: {
    total: 7,
    locked: 3,
    available: 4,
  },

  resources: [
    {
      name: "database-connection",
      jobId: "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d",
      lockedSince: "5 min ago",
      topic: "Database",
    },
    {
      name: "file-system",
      jobId: "7f8e9d6c-5b4a-4321-9f8e-7d6c5b4a3210",
      lockedSince: "25 min ago",
      topic: "Storage",
    },
    {
      name: "api-key",
      jobId: "b7c8d9e0-f1a2-4b3c-8d9e-0f1a2b3c4d5e",
      lockedSince: "35 min ago",
      topic: "Security",
    },
  ],
};

// Functions to handle mock data requests
mock.onGet("/resources").reply(200, data.resources);

mock.onGet("/resources/stats").reply(200, data.resourceStats);

mock.onPost(/\/resources\/(.+)\/unlock/).reply((config) => {
  const resourceName = config.url.split("/")[2];
  const resource = data.resources.find((r) => r.name === resourceName);

  if (resource) {
    resource.jobId = null;
    resource.lockedSince = null;
    // Update stats
    data.resourceStats.locked = data.resources.filter((r) => r.jobId !== null).length;
    data.resourceStats.available = data.resourceStats.total - data.resourceStats.locked;
    return [200, { success: true, resource }];
  } else {
    return [404, { error: "Resource not found" }];
  }
});

mock.onPost("/api/v1/resources/unlock").reply(() => {
  // Unlock all resources
  data.resources.forEach((resource) => {
    resource.jobId = null;
    resource.lockedSince = null;
  });

  // Update stats
  data.resourceStats.locked = 0;
  data.resourceStats.available = data.resourceStats.total;

  return [200, { success: true, unlockedCount: data.resourceStats.total }];
});

// Helper functions for generating dynamic mock data
export const mockDataHelpers = {
  unlockResource(resourceName) {
    const resource = data.resources.find((r) => r.name === resourceName);
    if (resource) {
      resource.jobId = null;
      resource.lockedSince = null;
      data.resourceStats.locked = data.resources.filter((r) => r.jobId !== null).length;
      data.resourceStats.available = data.resourceStats.total - data.resourceStats.locked;
      return resource;
    }
    return null;
  },

  unlockAllResources() {
    data.resources.forEach((resource) => {
      resource.jobId = null;
      resource.lockedSince = null;
    });
    data.resourceStats.locked = 0;
    data.resourceStats.available = data.resourceStats.total;
    return data.resources;
  },
};
