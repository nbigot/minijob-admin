import { configDefaults, defineConfig, mergeConfig } from "vitest/config";
import baseConfig from "./vite.config.js";

// Integration tests: run the UI services and views against a live minijob server.
// Usage: MINIJOB_URL=http://127.0.0.1:8080 npm run test:integration
const config = mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ["tests/integration/**/*.test.js"],
      setupFiles: ["tests/integration/setup.js"],
      // Tests share one server: run files one after the other.
      fileParallelism: false,
      testTimeout: 20000,
      hookTimeout: 20000,
    },
  }),
);
// mergeConfig concatenates arrays: drop the base exclusion of tests/integration.
config.test.exclude = configDefaults.exclude;

export default config;
