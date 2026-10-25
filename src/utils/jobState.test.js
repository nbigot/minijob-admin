import { describe, it, expect } from "vitest";
import { isCancellable } from "./jobState";

describe("isCancellable", () => {
  it("returns true for a running job", () => {
    expect(isCancellable("running")).toBe(true);
  });

  it("returns false for the states the server refuses to cancel", () => {
    for (const state of ["created", "delayed", "pending", "queued", "succeeded", "failed", "canceled"]) {
      expect(isCancellable(state)).toBe(false);
    }
  });

  it("returns false for falsy input", () => {
    expect(isCancellable(null)).toBe(false);
    expect(isCancellable(undefined)).toBe(false);
  });
});
