<template>
  <nav class="navbar text-gray-800 dark:text-white">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        My App
      </a>
    </div>
    <div class="navbar-menu">
      <!--div class="navbar-start">
        <a class="navbar-item" href="/">
          Home
        </a>
        <a class="navbar-item" href="/about">
          About
        </a>
      </div-->
      <div class="navbar-end">
        <div class="navbar-item">
          <button @click="toggleTheme" class="button" title="Toggle theme">
            <span v-if="isDarkMode">
              <font-awesome-icon icon="sun" />
            </span>
            <span v-else>
              <font-awesome-icon icon="moon" />
            </span>
          </button>
        </div>
        <div class="navbar-item" style="margin-left: 0.5rem;">
          <button @click="toggleAutoRefresh" class="button" :class="{ 'is-active': isAutoRefreshing }" title="Toggle auto-refresh">
            <font-awesome-icon icon="sync" :class="{ 'fa-spin': isAutoRefreshing }" />
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      isDarkMode: false, // Ensure this is correctly initialized
      isAutoRefreshing: false,
      autoRefreshIntervalId: null
    };
  },
  methods: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      if (this.isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); // Save theme preference
      } else {
        document.documentElement.removeAttribute('data-theme'); // Or setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light'); // Save theme preference
      }
    },
    toggleAutoRefresh() {
      this.isAutoRefreshing = !this.isAutoRefreshing;
      if (this.isAutoRefreshing) {
        // Refresh every 30 seconds (30000 milliseconds)
        this.autoRefreshIntervalId = setInterval(() => {
          location.reload();
        }, 30000);
        console.log("Auto-refresh started.");
      } else {
        if (this.autoRefreshIntervalId) {
          clearInterval(this.autoRefreshIntervalId);
          this.autoRefreshIntervalId = null;
        }
        console.log("Auto-refresh stopped.");
      }
    }
  },
  mounted() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      // Handles 'light' or null (no theme saved yet)
      this.isDarkMode = false;
      document.documentElement.removeAttribute('data-theme'); // Set to light visually
      if (savedTheme === null) {
        localStorage.setItem('theme', 'light'); // Persist 'light' as default if nothing was saved
      }
    }
  },
  beforeUnmount() {
    if (this.autoRefreshIntervalId) {
      clearInterval(this.autoRefreshIntervalId);
      this.autoRefreshIntervalId = null;
      console.log("Auto-refresh stopped due to component unmount.");
    }
  }
}
</script>

<style scoped>
.navbar {
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
}

.navbar-brand .navbar-item {
  font-weight: bold;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
}

.navbar-start .navbar-item {
  padding: 0.5rem 0.75rem;
  color: #007bff;
  text-decoration: none;
}

.navbar-start .navbar-item:hover {
  color: #0056b3;
}

.navbar-end {
  display: flex;
  align-items: center;
}

.button {
  background-color: transparent;
  border: 1px solid #ccc;
  padding: 0.5rem; /* Padding is maintained inside the fixed dimensions */
  cursor: pointer;
  border-radius: 4px;
  display: inline-flex; /* Added for consistent icon alignment */
  align-items: center;   /* Added for vertical centering */
  justify-content: center; /* Added for horizontal centering */
  width: 2.5rem;  /* Added: Fixed width */
  height: 2.5rem; /* Added: Fixed height */
  box-sizing: border-box; /* Added: Padding and border included in width/height */
}

.button span { /* For the theme toggle icon container */
  font-size: 1.2rem;
  display: inline-flex; 
  align-items: center;
  justify-content: center;
}

.button i { /* For direct icons like auto-refresh and icons inside the theme span */
  font-size: 1.2rem;
}

.button.is-active {
  color: #007bff; 
  border-color: #007bff;
}
</style>
