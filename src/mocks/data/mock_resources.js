import mock from "../mock.js";

// Mock data for resources
let dataResourceNames = {
  code: 200,
  message: "success",
  resources: ["database-connection", "file-system", "api-key", "email-sender", "report-generator", "cache-service", "message-queue"],
};

let dataResourceMetrics = {
  code: 200,
  message: "success",
  resources: [
    {
      resourceName: "database-connection",
      topic: "Database",
      jobUuid: "73b6a7e9-51e0-4982-a106-f54c4369271a",
      startTime: 1753520886,
      lockDuration: 60,
    },
    { resourceName: "file-system", topic: "Storage", jobUuid: "9e7b3fee-84c5-4fd0-b8e6-8e735c7deca1", startTime: 1753520886, lockDuration: 1 },
    { resourceName: "api-key", topic: "Security", jobUuid: "a8f2e357-1d2c-4b6e-9d0f-e5c7b3461d9a", startTime: 1753520886, lockDuration: 120 },
    { resourceName: "email-sender", topic: "Database", jobUuid: "1e0b3fee-84c5-4fd0-b8e6-8e735c7deca2", startTime: 1753520886, lockDuration: 3600 },
    {
      resourceName: "report-generator",
      topic: "Database",
      jobUuid: "33ab3fee-84c5-4fd0-b8e6-8e735c7de321",
      startTime: 1753520886,
      lockDuration: 1234,
    },
  ],
};

// Functions to handle mock data requests
mock.onGet("/api/v1/resources/").reply(200, dataResourceNames);

mock.onGet("/api/v1/metrics/resources").reply(200, dataResourceMetrics);

mock.onPost(/\/api\/v1\/resources\/(.+)\/unlock/).reply((config) => {
  const resourceName = config.url.split("/")[4];
  const resource = dataResourceMetrics.resources.find((r) => r.resourceName === resourceName);

  if (resource) {
    // If resource is found, delete it from dataResourceMetrics
    dataResourceMetrics.resources = dataResourceMetrics.resources.filter((r) => r.resourceName !== resourceName);
    return [200, { code: 200, message: "success" }];
  } else {
    return [404, { code: 404, message: "missing or empty resource name in query", data: null }];
  }
});

mock.onPost("/api/v1/resources/unlock").reply(() => {
  // Unlock all resources
  dataResourceMetrics.resources = [];

  return [200, { code: 200, message: "success" }];
});
