// @vitest-environment node
import { afterAll, describe, expect, it } from "vitest";
import {
  dashboardService,
  healthService,
  jobService,
  resourceService,
  systemService,
  topicService,
} from "../../src/services/index.js";
import {
  DESTRUCTIVE,
  createJob,
  createRunningJob,
  deleteJobs,
  getJob,
  server,
  succeedJob,
  uniqueTopic,
  waitForState,
} from "./helpers.js";

const created = [];
const track = (job) => {
  created.push(job.id);
  return job;
};

afterAll(async () => {
  await deleteJobs(created);
});

describe("routes called by the UI exist on the server", () => {
  // Non-destructive check: a route that exists for another method answers 405 with Allow.
  const routes = [
    ["post", "/api/v1/admin/server/restart"],
    ["post", "/api/v1/admin/server/shutdown"],
    ["delete", "/api/v1/jobs/"],
    ["delete", "/api/v1/jobs/queued"],
    ["post", "/api/v1/resources/unlock"],
  ];
  it.each(routes)("%s %s", async (method, path) => {
    const res = await server.patch(path);
    expect(res.status).toBe(405);
    expect(res.headers.allow).toContain(method.toUpperCase());
  });

  it("raw prometheus metrics link opened by the Health view", async () => {
    // Health.vue opens `${VITE_API_BASE_URL}/metrics` in a new tab.
    const res = await server.get("/metrics");
    expect(res.status).toBe(200);
    expect(res.data).toContain("# HELP");
  });
});

describe("healthService", () => {
  it("reports a healthy server", async () => {
    const health = await healthService.getHealthStatus();
    expect(health.server.status).toBe("healthy");
    expect(health.responseTime).toBeGreaterThanOrEqual(0);
    expect(health.lastChecked).toBeGreaterThan(0);
  });

  it("returns system info", async () => {
    const info = await healthService.getSystemInfo();
    expect(info).toEqual(
      expect.objectContaining({
        version: expect.any(String),
        uptime: expect.any(Number),
        hostname: expect.any(String),
        environment: expect.any(String),
      }),
    );
  });
});

describe("jobService", () => {
  it("creates a job with the payload built by the CreateJob form", async () => {
    const topic = uniqueTopic();
    // Same shape as CreateJob.vue submitJob()
    const res = await jobService.createJob({
      topic,
      priority: 2,
      properties: { a: 1, nested: { b: [1, 2] } },
      lockResources: [],
      userAgent: "MinijobAdmin/1.0",
      requester: "integration-test",
      name: "create-test",
      sessionId: "s1",
      traceId: "t1",
      startAfter: 0,
      delay: 0,
      callbackUrl: "",
    });
    track(res.job);
    expect(res.code).toBe(200);
    expect(res.job.id).toMatch(/^[0-9a-f-]{36}$/);
    const job = await getJob(res.job.id);
    expect(job).toMatchObject({
      topic,
      priority: 2,
      name: "create-test",
      requester: "integration-test",
      properties: { a: 1, nested: { b: [1, 2] } },
    });
  });

  it("creates a delayed job", async () => {
    const res = await jobService.createJob({ topic: uniqueTopic(), properties: {}, delay: 3600 });
    track(res.job);
    const job = await waitForState(res.job.id, ["delayed"]);
    expect(job.state).toBe("delayed");
  });

  it("creates a job scheduled with startAfter (ms timestamp)", async () => {
    const startAfter = Date.now() + 3600 * 1000;
    const res = await jobService.createJob({ topic: uniqueTopic(), properties: {}, startAfter });
    track(res.job);
    const job = await waitForState(res.job.id, ["delayed"]);
    expect(job.startAfter).toBe(startAfter);
  });

  it("surfaces the server error message when creation is rejected", async () => {
    // The server only accepts a number for "delay". With JSON schema validation on (the Docker
    // image config), the schema rejects it; with it off, the decoding does.
    await expect(jobService.createJob({ topic: uniqueTopic(), properties: {}, delay: "" })).rejects.toThrow(
      /^Failed to create job: (invalid json content|cannot create job from request)/,
    );
  });

  it("lists jobs with filters, sort and pagination", async () => {
    const topic = uniqueTopic();
    const jobs = [];
    for (let i = 0; i < 3; i++) jobs.push(track(await createJob({ topic, name: `list-${i}`, priority: i })));
    await Promise.all(jobs.map((j) => waitForState(j.id, ["queued"])));

    const page1 = await jobService.getJobs({ topic, limit: 2, page: 1, sort: "priority_desc", status: "", search: "" });
    expect(page1.total).toBe(3);
    expect(page1.totalpages).toBe(2);
    expect(page1.jobs.map((j) => j.name)).toEqual(["list-2", "list-1"]);

    const page2 = await jobService.getJobs({ topic, limit: 2, page: 2, sort: "priority_desc" });
    expect(page2.jobs.map((j) => j.name)).toEqual(["list-0"]);

    const byStatus = await jobService.getJobs({ topic, status: "running" });
    expect(byStatus.total).toBe(0);

    const bySearch = await jobService.getJobs({ topic, search: jobs[1].id.slice(-12) });
    expect(bySearch.jobs.map((j) => j.id)).toEqual([jobs[1].id]);
  });

  it("enriches listed jobs with created/updated display fields", async () => {
    const topic = uniqueTopic();
    const job = track(await createJob({ topic }));
    await waitForState(job.id, ["queued"]);
    const { jobs } = await jobService.getJobs({ topic });
    expect(jobs[0].state).toBe("queued");
    expect(jobs[0].created).toMatch(/^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d$/);
    expect(jobs[0].updated).toMatch(/^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d$/);
  });

  it("getJobById returns the server envelope", async () => {
    const job = track(await createJob({ topic: uniqueTopic(), name: "by-id" }));
    await waitForState(job.id, ["queued"]);
    // JobDetail.vue and CreateJob.vue (clone) read response.code and response.job
    const response = await jobService.getJobById(job.id);
    expect(response.code).toBe(200);
    expect(response.job.id).toBe(job.id);
    expect(response.job.name).toBe("by-id");
    expect(response.job.state).toBe("queued");
  });

  it("getJobById rejects for an unknown job", async () => {
    await expect(jobService.getJobById("01a173a7-0000-7000-8000-000000000000")).rejects.toThrow(/job not found/);
  });

  it("cancels a running job", async () => {
    const job = track(await createRunningJob({ topic: uniqueTopic() }));
    expect(job.state).toBe("running");
    const res = await jobService.cancelJob(job.id);
    expect(res.code).toBe(200);
    const after = await getJob(job.id);
    expect(after.history.map((e) => e.eventType)).toContain("CANCEL");
  });

  it("surfaces the server reason when cancel is refused", async () => {
    const job = track(await createJob({ topic: uniqueTopic() }));
    await waitForState(job.id, ["queued"]);
    await expect(jobService.cancelJob(job.id)).rejects.toThrow(/job is not running/);
  });

  it("deletes a job", async () => {
    const job = await createJob({ topic: uniqueTopic() });
    const res = await jobService.deleteJob(job.id);
    expect(res.code).toBe(200);
    expect(await getJob(job.id)).toBeNull();
  });

  it("lists stalled jobs (queued or running for an hour or more, longest first)", async () => {
    const job = track(await createRunningJob({ topic: uniqueTopic() }));
    const stalled = await jobService.getStalledJobs();
    expect(Array.isArray(stalled)).toBe(true);
    expect(stalled.find((j) => j.id === job.id)).toBeUndefined();
    for (const entry of stalled) {
      expect(["queued", "running"]).toContain(entry.state);
      expect(entry.duration).toBeGreaterThanOrEqual(3600 * 1000);
      expect(entry.created).toEqual(expect.any(Number));
    }
  });
});

describe("topicService", () => {
  it("lists topics and topic stats", async () => {
    const topic = uniqueTopic();
    const job = track(await createRunningJob({ topic }));
    await succeedJob(job.id);
    track(await createJob({ topic }));

    const { topics } = await topicService.getTopics();
    expect(topics).toContain(topic);

    const stats = await topicService.getTopicsStats();
    const t = stats.topics.find((s) => s.topicName === topic);
    // Topics.vue: percentJobs is a percentage, successRate a ratio (x100), averageDuration seconds
    expect(t.totalJobs).toBe(2);
    expect(t.successRate).toBeGreaterThan(0);
    expect(t.successRate).toBeLessThanOrEqual(1);
    expect(t.percentJobs).toBeGreaterThan(0);
    expect(t.percentJobs).toBeLessThanOrEqual(100);
    expect(typeof t.averageDuration).toBe("number");
  });
});

describe("resourceService", () => {
  it("lists the stats of locked resources", async () => {
    const resource = uniqueTopic("res");
    const job = track(await createJob({ topic: uniqueTopic(), lockResources: [resource] }));
    await waitForState(job.id, ["queued"]);

    const stats = await resourceService.getResourceStats();
    expect(stats.find((r) => r.resourceName === resource)).toEqual(
      expect.objectContaining({ jobUuid: job.id, topic: job.topic, lockDuration: expect.any(Number) }),
    );
  });

  it("unlocks a single resource", async () => {
    const resource = uniqueTopic("res");
    const job = track(await createJob({ topic: uniqueTopic(), lockResources: [resource] }));
    await waitForState(job.id, ["queued"]);

    const res = await resourceService.unlockResource(resource);
    expect(res.code).toBe(200);
    const stats = await resourceService.getResourceStats();
    expect(stats.find((r) => r.resourceName === resource)).toBeUndefined();
  });
});

describe("dashboardService", () => {
  it("aggregates the dashboard data", async () => {
    const resource = uniqueTopic("res");
    const job = track(await createJob({ topic: uniqueTopic(), lockResources: [resource] }));
    await waitForState(job.id, ["queued"]);

    const data = await dashboardService.getDashboardData();
    for (const key of [
      "existingJobs",
      "createdJobs",
      "delayedJobs",
      "pendingJobs",
      "queuedJobs",
      "runningJobs",
      "succeededJobs",
      "failedJobs",
      "hiddenJobs",
      "canceledJobs",
    ]) {
      expect(data.jobStats[key], key).toEqual(expect.any(Number));
    }
    expect(data.jobStats.existingJobs).toBeGreaterThan(0);
    for (const key of ["created", "pending", "enqueued", "started", "succeeded", "failed", "canceled"]) {
      expect(data.jobActivity[key], key).toEqual(expect.any(Number));
    }
    expect(data.newlyActiveJobs.length).toBeGreaterThan(0);
    expect(data.newlyActiveJobs.length).toBeLessThanOrEqual(5);
    expect(data.newlyActiveJobs[0]).toEqual(
      expect.objectContaining({ id: expect.any(String), state: expect.any(String), created: expect.any(Number) }),
    );
    expect(data.resources.length).toBeGreaterThan(0);
    expect(Object.values(data.jobsByTopic).every((n) => typeof n === "number")).toBe(true);
  });

  it("returns job activity counters", async () => {
    const activity = await dashboardService.getJobActivityMetrics();
    expect(activity.created).toEqual(expect.any(Number));
  });
});

describe.skipIf(!DESTRUCTIVE)("systemService (destructive: MINIJOB_DESTRUCTIVE=1)", () => {
  it("unlocks all resources", async () => {
    const resource = uniqueTopic("res");
    track(await createJob({ topic: uniqueTopic(), lockResources: [resource] }));
    await systemService.unlockAllResources();
    expect(await resourceService.getResourceStats()).toEqual([]);
  });

  it("clears the job queues", async () => {
    const job = track(await createJob({ topic: uniqueTopic() }));
    await waitForState(job.id, ["queued"]);
    const res = await systemService.clearJobQueues();
    expect(res.code).toBe(200);
    expect((await getJob(job.id))?.state).not.toBe("queued");
  });

  it("deletes all jobs", async () => {
    track(await createJob({ topic: uniqueTopic() }));
    await systemService.deleteAllJobs();
    const { total } = await jobService.getJobs({});
    expect(total).toBe(0);
  });
});
