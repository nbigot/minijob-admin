import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { configDefaults, defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

const root = fileURLToPath(new URL(".", import.meta.url));
const { version } = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf-8"));

// The app version is the one in package.json, unless VITE_APP_VERSION is set in the
// environment (e.g. the Docker build argument) or in a .env file
function appVersion() {
  return {
    name: "app-version",
    config(_config, { mode }) {
      const env = loadEnv(mode, root, "VITE_APP_VERSION");
      process.env.VITE_APP_VERSION = env.VITE_APP_VERSION || version;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), appVersion()],
  build: {
    // Optimize build for production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["vue", "vue-router"],
          ui: ["@fortawesome/fontawesome-svg-core", "@fortawesome/vue-fontawesome"],
          charts: ["chart.js", "vue-chartjs"],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    // Integration tests need a live server: see vitest.integration.config.js
    exclude: [...configDefaults.exclude, "tests/integration/**"],
  },
});
