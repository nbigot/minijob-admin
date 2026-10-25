import axios from "axios";

export const SERVER_URL = process.env.MINIJOB_URL || "http://127.0.0.1:8080";

// Destructive tests (delete all jobs, clear queues, unlock all resources) wipe the server state.
export const DESTRUCTIVE = process.env.MINIJOB_DESTRUCTIVE === "1";

// A client independent from the UI services, used to set up and check the server state.
export const server = axios.create({ baseURL: SERVER_URL, timeout: 15000, validateStatus: () => true });

let counter = 0;

// A topic of its own for each test, so tests never see each other's jobs.
export function uniqueTopic(prefix = "it") {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

export async function createJob(fields) {
  const res = await server.post("/api/v1/job/", { properties: {}, ...fields });
  if (res.status !== 200) {
    throw new Error(`create job failed: ${res.status} ${JSON.stringify(res.data)}`);
  }
  return res.data.job;
}

export async function getJob(id) {
  const res = await server.get(`/api/v1/job/${id}`);
  return res.status === 200 ? res.data.job : null;
}

// Waits until the job reaches one of the given states.
export async function waitForState(id, states, timeoutMs = 5000) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const job = await getJob(id);
    if (job && states.includes(job.state)) return job;
    if (Date.now() > deadline) {
      throw new Error(`job ${id} is ${job?.state}, expected one of ${states.join(", ")}`);
    }
    await new Promise((r) => setTimeout(r, 50));
  }
}

// Creates a job and pulls it, as a worker would: the job is then running.
export async function createRunningJob(fields) {
  const job = await createJob(fields);
  await waitForState(job.id, ["queued"]);
  const res = await server.post("/api/v1/job/pull", null, {
    params: { jobuuid: job.id, visibilitytimeout: 300 },
  });
  if (res.status !== 200 || res.data.jobs?.length !== 1) {
    throw new Error(`pull job failed: ${res.status} ${JSON.stringify(res.data)}`);
  }
  return res.data.jobs[0];
}

export async function succeedJob(id) {
  return server.post(`/api/v1/job/${id}/succeed`);
}

export async function deleteJobs(ids) {
  await Promise.all(ids.map((id) => server.delete(`/api/v1/job/${id}`)));
}
