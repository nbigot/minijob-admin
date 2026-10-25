// Mounts the real views and lets them talk to the live server (jsdom XHR, with CORS).
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import JobDetail from "../../src/components/JobDetail.vue";
import CreateJob from "../../src/views/CreateJob.vue";
import Dashboard from "../../src/views/Dashboard.vue";
import Health from "../../src/views/Health.vue";
import Jobs from "../../src/views/Jobs.vue";
import Resources from "../../src/views/Resources.vue";
import Topics from "../../src/views/Topics.vue";
import { apiClient, jobService } from "../../src/services/index.js";
import {
  SERVER_URL,
  createJob,
  createRunningJob,
  deleteJobs,
  getJob,
  succeedJob,
  uniqueTopic,
  waitForState,
} from "./helpers.js";

const created = [];
const track = (job) => {
  created.push(job.id);
  return job;
};
const wrappers = [];

afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount());
  vi.restoreAllMocks();
});

afterAll(async () => {
  await deleteJobs(created);
});

async function mountView(component, { props = {}, route = "/" } = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/:pathMatch(.*)*", component: { template: "<div />" } }],
  });
  await router.push(route);
  await router.isReady();
  const errors = [];
  const wrapper = mount(component, {
    props,
    attachTo: document.body,
    global: {
      plugins: [router],
      stubs: { FontAwesomeIcon: true, JobProcessingChart: true, JobStatusChart: true },
      config: { errorHandler: (err) => errors.push(err) },
    },
  });
  wrapper.errors = errors;
  wrappers.push(wrapper);
  return wrapper;
}

const until = (fn) => vi.waitFor(fn, { timeout: 5000, interval: 50 });
const buttons = (wrapper, text) => wrapper.findAll("button").filter((b) => b.text().trim() === text);
const byTitle = (el, title) => el.findAll(`button[title="${title}"]`);

describe("JobDetail view", () => {
  it("shows a running job with its Cancel action, and cancels it", async () => {
    const job = track(await createRunningJob({ topic: uniqueTopic(), name: "detail-running", priority: 2 }));
    const wrapper = await mountView(JobDetail, { props: { jobId: job.id } });
    await until(() => expect(wrapper.text()).toContain("Job Detail: detail-running"));

    expect(wrapper.text()).toContain(job.id);
    expect(wrapper.text()).toContain("running");
    expect(wrapper.text()).toContain("High");
    expect(buttons(wrapper, "Cancel")).toHaveLength(1);

    await buttons(wrapper, "Cancel")[0].trigger("click");
    await buttons(wrapper, "Confirm")[0].trigger("click");
    await until(() => expect(wrapper.text()).toContain("was cancelled successfully"));
    const after = await getJob(job.id);
    expect(after.history.map((e) => e.eventType)).toContain("CANCEL");
    expect(wrapper.errors).toEqual([]);
  });

  it("does not offer Cancel for a queued job (the server would refuse it)", async () => {
    const job = track(await createJob({ topic: uniqueTopic(), name: "detail-queued" }));
    await waitForState(job.id, ["queued"]);
    const wrapper = await mountView(JobDetail, { props: { jobId: job.id } });
    await until(() => expect(wrapper.text()).toContain("Job Detail: detail-queued"));
    expect(buttons(wrapper, "Cancel")).toHaveLength(0);
    // The status icon of the "queued" state, not the unknown-state fallback
    expect(wrapper.find(".bg-indigo-100.text-indigo-500").exists()).toBe(true);
  });

  it("shows an error for an unknown job", async () => {
    const wrapper = await mountView(JobDetail, { props: { jobId: "01a173a7-0000-7000-8000-000000000000" } });
    await until(() => expect(wrapper.text()).toContain("job not found"));
  });
});

describe("Jobs view", () => {
  it("lists the jobs of a topic with the actions matching their state", async () => {
    const topic = uniqueTopic();
    const running = track(await createRunningJob({ topic, name: "list-running" }));
    const queued = track(await createJob({ topic, name: "list-queued" }));
    await waitForState(queued.id, ["queued"]);

    const wrapper = await mountView(Jobs, { route: `/jobs?topic=${topic}` });
    await until(() => expect(wrapper.findAll("tbody tr").filter((r) => r.text().includes(topic))).toHaveLength(2));

    const row = (id) => wrapper.findAll("tbody tr").find((r) => r.text().includes(id));
    expect(row(running.id).text()).toContain("running");
    expect(row(queued.id).text()).toContain("queued");
    expect(byTitle(row(running.id), "Cancel")).toHaveLength(1);
    expect(byTitle(row(queued.id), "Cancel")).toHaveLength(0);
    expect(wrapper.errors).toEqual([]);
  });

  it("cancels a running job from the list and shows its new state", async () => {
    const topic = uniqueTopic();
    const running = track(await createRunningJob({ topic }));
    const wrapper = await mountView(Jobs, { route: `/jobs?topic=${topic}` });
    const row = () => wrapper.findAll("tbody tr").find((r) => r.text().includes(running.id));
    await until(() => expect(row()).toBeTruthy());

    await byTitle(row(), "Cancel")[0].trigger("click");
    await buttons(wrapper, "Confirm")[0].trigger("click");
    await until(() => expect(wrapper.text()).toContain("was cancelled successfully"));
    // The server re-enqueues a canceled job: the row must not keep showing "running".
    await until(() => expect(row().text()).not.toContain("running"));
  });

  it("shows a failed reload in the page, without closing an open confirmation", async () => {
    const topic = uniqueTopic();
    const running = track(await createRunningJob({ topic }));
    const wrapper = await mountView(Jobs, { route: `/jobs?topic=${topic}` });
    const row = () => wrapper.findAll("tbody tr").find((r) => r.text().includes(running.id));
    await until(() => expect(row()).toBeTruthy());

    // An auto-refresh tick fails while the Cancel confirmation is open
    await byTitle(row(), "Cancel")[0].trigger("click");
    vi.spyOn(jobService, "getJobs").mockRejectedValueOnce(new Error("Failed to fetch jobs: server down"));
    await wrapper.vm.handleRefreshData();
    await until(() => expect(wrapper.text()).toContain("Failed to fetch jobs: server down"));
    expect(buttons(wrapper, "Confirm")).toHaveLength(1);

    // The cancel works but the reload after it fails: both are shown
    vi.spyOn(jobService, "getJobs").mockRejectedValueOnce(new Error("Failed to fetch jobs: still down"));
    await buttons(wrapper, "Confirm")[0].trigger("click");
    await until(() => expect(wrapper.text()).toContain("was cancelled successfully"));
    expect(wrapper.text()).toContain("Failed to fetch jobs: still down");

    // The next reload clears the error
    await wrapper.vm.handleRefreshData();
    await until(() => expect(wrapper.text()).not.toContain("Failed to fetch jobs"));
  });

  it("deletes a job from the list", async () => {
    const topic = uniqueTopic();
    const job = await createJob({ topic });
    const wrapper = await mountView(Jobs, { route: `/jobs?topic=${topic}` });
    const row = () => wrapper.findAll("tbody tr").find((r) => r.text().includes(job.id));
    await until(() => expect(row()).toBeTruthy());

    await byTitle(row(), "Delete")[0].trigger("click");
    await buttons(wrapper, "Confirm")[0].trigger("click");
    await until(() => expect(wrapper.text()).toContain("was deleted successfully"));
    expect(await getJob(job.id)).toBeNull();
  });
});

describe("CreateJob view", () => {
  it("offers the server's topics", async () => {
    const topic = uniqueTopic();
    track(await createJob({ topic }));
    const wrapper = await mountView(CreateJob, { route: "/job/create" });
    await until(() => {
      const options = wrapper.findAll("#topic-options option").map((o) => o.attributes("value"));
      expect(options).toContain(topic);
      expect(options.some((o) => o.startsWith("mock-"))).toBe(false);
    });
  });

  it("offers the server's topics when opened from the Jobs page", async () => {
    const topic = uniqueTopic();
    track(await createJob({ topic }));
    // Jobs.vue passes the topics of the jobs it shows, here an empty page
    for (const listed of [[], ["listed-topic"]]) {
      const wrapper = await mountView(CreateJob, { route: `/job/create?topics=${encodeURIComponent(JSON.stringify(listed))}` });
      await until(() => {
        const options = wrapper.findAll("#topic-options option").map((o) => o.attributes("value"));
        expect(options).toEqual(expect.arrayContaining([topic, ...listed]));
      });
    }
  });

  it("clones a job, keeping its priority", async () => {
    const source = track(
      await createJob({ topic: uniqueTopic(), name: "to-clone", priority: 0, properties: { x: 1 }, lockResources: [] }),
    );
    const wrapper = await mountView(CreateJob, { props: { cloneJobId: source.id }, route: `/job/create/clone/${source.id}` });
    await until(() => expect(wrapper.find("#topic").element.value).toBe(source.topic));
    expect(wrapper.vm.job.name).toBe("to-clone (Copy)");
    expect(wrapper.vm.job.priority).toBe(0);
    expect(JSON.parse(wrapper.vm.job.properties)).toEqual({ x: 1 });
  });

  it("submits the form and creates the job on the server", async () => {
    const topic = uniqueTopic();
    const wrapper = await mountView(CreateJob, { route: "/job/create" });
    await wrapper.find("#topic").setValue(topic);
    wrapper.vm.job.name = "from-form";
    wrapper.vm.job.properties = '{"hello":"world"}';
    wrapper.vm.job.lockResources = "";
    await wrapper.vm.submitJob();
    await until(() => expect(wrapper.text()).toContain("Job created successfully"));
    const id = wrapper.text().match(/Job ID: ([0-9a-f-]{36})/)[1];
    const job = track(await getJob(id));
    expect(job).toMatchObject({ topic, name: "from-form", properties: { hello: "world" } });
  });

  it("sends the delay only for a delayed schedule, and accepts an emptied delay field", async () => {
    const submit = async (fields) => {
      const wrapper = await mountView(CreateJob, { route: "/job/create" });
      Object.assign(wrapper.vm.job, { topic: uniqueTopic(), properties: "{}", lockResources: "", ...fields });
      await wrapper.vm.submitJob();
      await until(() => expect(wrapper.text()).toContain("Job created successfully"));
      return track(await getJob(wrapper.text().match(/Job ID: ([0-9a-f-]{36})/)[1]));
    };
    // A delay typed, then "Run Immediately" chosen again
    const immediate = await submit({ schedule: "immediate", delay: 3600 });
    expect((await waitForState(immediate.id, ["queued"])).state).toBe("queued");
    // v-model.number gives "" for an emptied field
    const emptied = await submit({ schedule: "delayed", delay: "" });
    expect((await waitForState(emptied.id, ["queued"])).state).toBe("queued");
  });
});

describe("Resources view", () => {
  it("counts and lists locked resources, and unlocks one", async () => {
    const resource = uniqueTopic("res");
    const job = track(await createJob({ topic: uniqueTopic(), lockResources: [resource] }));
    await waitForState(job.id, ["queued"]);

    const wrapper = await mountView(Resources);
    const row = () => wrapper.findAll("tbody tr").find((r) => r.text().includes(resource));
    await until(() => expect(row()).toBeTruthy());
    expect(row().text()).toContain(job.id);
    expect(wrapper.vm.lockedResources).toBe(wrapper.vm.resourceStats.length);
    expect(wrapper.text()).not.toContain("Total Resources");

    await buttons(row(), "Unlock")[0].trigger("click");
    await buttons(wrapper, "Confirm")[0].trigger("click");
    await until(() => expect(wrapper.text()).toContain(`Resource ${resource} unlocked successfully`));
    await until(() => expect(row()).toBeUndefined());
    expect(wrapper.errors).toEqual([]);
  });
});

describe("Topics view", () => {
  it("shows topic stats with success rate", async () => {
    const topic = uniqueTopic();
    const job = track(await createRunningJob({ topic }));
    await succeedJob(job.id);
    const wrapper = await mountView(Topics);
    const row = () => wrapper.findAll("tbody tr").find((r) => r.text().includes(topic));
    await until(() => expect(row()).toBeTruthy());
    expect(row().text()).toContain("100.0%");
  });
});

describe("Health view", () => {
  it("shows the server as healthy with its system info", async () => {
    const wrapper = await mountView(Health);
    await until(() => expect(wrapper.text()).toContain("Healthy"));
    await until(() => expect(wrapper.text()).toMatch(/MiniJob v\d/));
  });

  it("opens the raw prometheus metrics of the server", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const wrapper = await mountView(Health);
    await wrapper.vm.openRawMetricsEndpoint();
    expect(open).toHaveBeenCalledWith(`${SERVER_URL}/metrics`, "_blank");
  });

  it("opens the raw metrics without a double slash when the base URL ends with one", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const baseURL = apiClient.defaults.baseURL;
    apiClient.defaults.baseURL = `${SERVER_URL}/`;
    try {
      const wrapper = await mountView(Health);
      await wrapper.vm.openRawMetricsEndpoint();
      expect(open).toHaveBeenCalledWith(`${SERVER_URL}/metrics`, "_blank");
    } finally {
      apiClient.defaults.baseURL = baseURL;
    }
  });
});

describe("Dashboard view", () => {
  it("renders the live job counters", async () => {
    const job = track(await createJob({ topic: uniqueTopic() }));
    await waitForState(job.id, ["queued"]);
    const wrapper = await mountView(Dashboard);
    await until(() => expect(wrapper.vm.dashboardData.jobStats.existingJobs).toBeGreaterThan(0));
    await until(() => expect(wrapper.vm.dashboardData.newlyActiveJobs.length).toBeGreaterThan(0));
    expect(wrapper.text()).toContain(job.topic.slice(0, 10));
    expect(wrapper.errors).toEqual([]);
  });

  it("tells when the server cannot be reached", async () => {
    const baseURL = apiClient.defaults.baseURL;
    apiClient.defaults.baseURL = "http://127.0.0.1:1";
    try {
      const wrapper = await mountView(Dashboard);
      await until(() => expect(wrapper.text()).toContain("Cannot connect to the server"));
    } finally {
      apiClient.defaults.baseURL = baseURL;
    }
  });
});
