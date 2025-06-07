<template>
  <aside
    class="h-screen flex flex-col transition-all duration-100"
    :class="[
      isCollapsed ? 'w-16' : 'w-64',
      isDarkTheme ? 'bg-gray-900 text-white' : 'bg-primary-800 text-white',
    ]"
  >
    <!-- Site name at the top of sidebar -->
    <div
      class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
    >
      <h1 class="text-xl font-bold truncate" v-show="!isCollapsed">
        MiniJob Admin
      </h1>
      <button
        @click="toggleCollapse"
        class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        :class="{ 'ml-auto': !isCollapsed }"
      >
        <font-awesome-icon
          :icon="isCollapsed ? 'chevron-right' : 'chevron-left'"
        />
      </button>
    </div>

    <nav class="p-4 flex-1">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.path">
          <router-link
            :to="item.path"
            class="p-2 rounded-md transition flex items-center hover:bg-primary-700 dark:hover:bg-gray-700"
            :class="{ active: $route.path === item.path }"
            :active-class="
              isDarkTheme ? 'bg-gray-700' : 'bg-primary-700 text-white'
            "
          >
            <font-awesome-icon
              :icon="item.icon"
              :class="isCollapsed ? '' : 'mr-3'"
            />
            <span v-show="!isCollapsed">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Auto Refresh toggle -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
      <button
        @click="toggleAutoRefresh"
        class="w-full p-2 rounded-md flex items-center justify-center transition mb-3 hover:bg-primary-700 dark:hover:bg-gray-700"
        v-tooltip="isCollapsed ? 'Auto Refresh' : ''"
      >
        <font-awesome-icon
          :icon="autoRefresh ? ['fas', 'toggle-on'] : ['fas', 'toggle-off']"
          :class="{ 'mr-2': !isCollapsed }"
          :spin="autoRefresh"
        />
        <span v-show="!isCollapsed">{{
          autoRefresh ? formatTime(remainingTime) : "Auto Refresh"
        }}</span>
        <font-awesome-icon
          icon="sync"
          :class="{ 'fa-spin': autoRefresh, 'ml-2': true }"
        />
      </button>

      <!-- Theme toggle button -->
      <button
        @click="toggleTheme"
        class="w-full p-2 rounded-md flex items-center justify-center transition hover:bg-primary-700 dark:hover:bg-gray-700"
        v-tooltip="
          isCollapsed ? (isDarkTheme ? 'Dark Theme' : 'Light Theme') : ''
        "
      >
        <font-awesome-icon
          :icon="isDarkTheme ? 'moon' : 'sun'"
          :class="{ 'mr-2': !isCollapsed }"
        />
        <span v-show="!isCollapsed">{{
          isDarkTheme ? "Dark Theme" : "Light Theme"
        }}</span>
      </button>
    </div>
  </aside>
</template>

<script>
export default {
  name: "SideBar",
  directives: {
    tooltip: {
      mounted(el, binding) {
        if (binding.value) {
          el.setAttribute("title", binding.value);
        }
      },
      updated(el, binding) {
        if (binding.value) {
          el.setAttribute("title", binding.value);
        } else {
          el.removeAttribute("title");
        }
      },
    },
  },
  props: {
    autoRefreshRate: {
      type: Number,
      default: 30000,
    },
  },
  emits: [
    "theme-changed",
    "refresh-data",
    "auto-refresh-changed",
    "sidebar-collapsed",
  ],
  data() {
    return {
      isDarkTheme: false,
      autoRefresh: false,
      refreshInterval: null,
      isCollapsed: false,
      remainingTime: 0,
      // Navigation items definition with Font Awesome icons
      menuItems: [
        { name: "Dashboard", path: "/", icon: "tachometer-alt" },
        { name: "Jobs", path: "/jobs", icon: "tasks" },
        { name: "Resources", path: "/resources", icon: "lock" },
        { name: "Topics", path: "/topics", icon: "tag" },
        { name: "System", path: "/system", icon: "server" },
        { name: "Health", path: "/health", icon: "heartbeat" },
      ],
    };
  },
  mounted() {
    // Initialize theme from localStorage if available
    const savedTheme = localStorage.getItem("theme");

    // Check for saved theme preference or system preference
    if (
      savedTheme === "dark" ||
      (savedTheme === null &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      this.isDarkTheme = true;
      document.documentElement.classList.add("dark");
    } else {
      this.isDarkTheme = false;
      document.documentElement.classList.remove("dark");
    }

    // Listen for changes in system color scheme preferences
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        const newColorScheme = e.matches ? "dark" : "light";
        // Only auto switch if user hasn't manually set a preference
        if (!localStorage.getItem("theme")) {
          this.isDarkTheme = e.matches;
          if (this.isDarkTheme) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      });
  },
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  methods: {
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;

      // Apply dark class to html element as per Tailwind docs
      if (this.isDarkTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      // Save preference to localStorage and emit event to parent components
      localStorage.setItem("theme", this.isDarkTheme ? "dark" : "light");

      // Emit theme change event to parent component
      this.$emit("theme-changed", this.isDarkTheme);

      // Force re-render of components that might not be watching for the class change
      document.dispatchEvent(
        new CustomEvent("theme-changed", {
          detail: { isDark: this.isDarkTheme },
        })
      );
    },
    toggleAutoRefresh() {
      this.autoRefresh = !this.autoRefresh;
      this.$emit("auto-refresh-changed", this.autoRefresh);

      if (this.autoRefresh) {
        this.$emit("refresh-data"); // Immediately emit refresh-data when turning on
        this.remainingTime = Math.floor(this.autoRefreshRate / 1000);
        this.refreshInterval = setInterval(() => {
          this.remainingTime--;
          if (this.remainingTime < 0) {
            this.$emit("refresh-data");
            this.remainingTime = Math.floor(this.autoRefreshRate / 1000);
          }
        }, 1000);
      } else {
        if (this.refreshInterval) {
          clearInterval(this.refreshInterval);
          this.refreshInterval = null;
        }
        this.remainingTime = 0;
      }
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      this.$emit("sidebar-collapsed", this.isCollapsed);
    },
    formatTime(seconds) {
      const m = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");
      const s = (seconds % 60).toString().padStart(2, "0");
      return `${m}:${s}`;
    },
  },
};
</script>
