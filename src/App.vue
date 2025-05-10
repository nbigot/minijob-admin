<template>
  <div class="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
    <SideBar @theme-changed="handleThemeChange" @sidebar-collapsed="handleSidebarCollapse" />
    <div class="flex-1 overflow-auto">
      <NavBar />
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script>
import SideBar from './components/SideBar.vue'
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',
  components: {
    SideBar,
    NavBar
  },
  data() {
    return {
      isDarkTheme: false,
      isSidebarCollapsed: false
    }
  },
  mounted() {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    this.isDarkTheme = savedTheme === 'dark';
  },
  methods: {
    handleThemeChange(isDark) {
      this.isDarkTheme = isDark;
      // You can add additional app-wide theme changes here if needed
    },
    handleSidebarCollapse(isCollapsed) {
      this.isSidebarCollapsed = isCollapsed;
    }
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Make sure the page takes the full height */
html, body {
  height: 100%;
  margin: 0;
}
</style>