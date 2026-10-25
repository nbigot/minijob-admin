import { readFileSync } from "node:fs";
import { defineConfig } from "vitepress";

const { version } = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf-8"));

export default defineConfig({
  title: "MiniJob Admin Dashboard",
  description: "Real-time Job Queue Management Dashboard",
  base: "/minijob-admin/",

  themeConfig: {
    logo: "/images/logo.svg",

    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Reference", link: "/reference/job-states" },
      {
        text: `v${version}`,
        items: [
          { text: "Changelog", link: "https://github.com/nbigot/minijob-admin/releases" },
          { text: "Contributing", link: "/guide/contributing" },
        ],
      },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Getting Started",
          items: [
            { text: "Introduction", link: "/guide/getting-started" },
            { text: "Configuration", link: "/guide/configuration" },
            { text: "Deployment", link: "/guide/deployment" },
          ],
        },
        {
          text: "Features",
          items: [
            { text: "Dashboard", link: "/guide/features/dashboard" },
            { text: "Jobs Management", link: "/guide/features/jobs" },
            { text: "Resources", link: "/guide/features/resources" },
            { text: "Topics", link: "/guide/features/topics" },
            { text: "Health Monitoring", link: "/guide/features/health-monitoring" },
            { text: "System Admin", link: "/guide/features/system" },
          ],
        },
        {
          text: "Additional",
          items: [
            { text: "Troubleshooting", link: "/guide/troubleshooting" },
            { text: "Contributing", link: "/guide/contributing" },
          ],
        },
      ],
      "/reference/": [
        {
          text: "Reference",
          items: [
            { text: "Job States", link: "/reference/job-states" },
            { text: "API Reference", link: "/reference/api" },
            { text: "Environment Variables", link: "/reference/environment-variables" },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/nbigot/minijob-admin" }],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026 Nicolas Bigot",
    },

    search: {
      provider: "local",
    },

    editLink: {
      pattern: "https://github.com/nbigot/minijob-admin/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
  },

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/images/logo.svg" }],
    ["meta", { name: "theme-color", content: "#5B21B6" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "MiniJob Admin Dashboard" }],
    ["meta", { property: "og:description", content: "Real-time Job Queue Management Dashboard" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
  ],
});
