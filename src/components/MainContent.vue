<template>
  <main class="flex-1 p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200">
    <div class="container mx-auto">
      <h1 class="text-2xl font-bold mb-4">
        {{ pageTitle }}
      </h1>

      <!-- Content wrapper -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg shadow p-6 mb-6">
        <slot />
      </div>

      <!-- Card elements example -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow p-4"
        >
          <h3 class="text-lg font-semibold mb-2">
            {{ card.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            {{ card.description }}
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'MainContent',
  props: {
    pageTitle: {
      type: String,
      default: 'Dashboard'
    }
  },
  data() {
    return {
      cards: [
        { title: 'Card 1', description: 'This is a sample card with dark mode support.' },
        { title: 'Card 2', description: 'Content will change color based on theme.' },
        { title: 'Card 3', description: 'Using dark: prefix for all color classes.' }
      ]
    }
  },
  mounted() {
    // Listen for theme change events
    document.addEventListener('theme-changed', (e) => {
      // You can perform additional actions when theme changes
      console.log('Theme changed to:', e.detail.isDark ? 'dark' : 'light');
    });
  }
}
</script>
