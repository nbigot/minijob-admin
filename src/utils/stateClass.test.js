import { describe, it, expect } from "vitest";
import { getStateClass } from "./stateClass";

describe("getStateClass", () => {
  it("returns empty string for falsy input", () => {
    expect(getStateClass(null)).toBe("");
    expect(getStateClass(undefined)).toBe("");
    expect(getStateClass("")).toBe("");
  });

  it("returns green classes for running state", () => {
    expect(getStateClass("running")).toBe("bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400");
    expect(getStateClass("RUNNING")).toBe("bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400");
  });

  it("returns yellow classes for scheduled and queued states", () => {
    expect(getStateClass("scheduled")).toBe("bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400");
    expect(getStateClass("queued")).toBe("bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400");
  });

  it("returns indigo classes for completed and succeeded states", () => {
    expect(getStateClass("completed")).toBe("bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-400");
    expect(getStateClass("succeeded")).toBe("bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-400");
  });

  it("returns red classes for failed state", () => {
    expect(getStateClass("failed")).toBe("bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400");
  });

  it("returns blue classes for created state", () => {
    expect(getStateClass("created")).toBe("bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400");
  });

  it("returns gray classes for unknown state", () => {
    expect(getStateClass("unknown")).toBe("bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400");
  });
});
