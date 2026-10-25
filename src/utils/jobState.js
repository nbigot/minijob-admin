// The server only cancels a running job, and then enqueues it again
export function isCancellable(state) {
  return state === "running";
}
