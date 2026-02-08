import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
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
});
