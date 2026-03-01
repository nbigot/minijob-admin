<template>
  <div class="feature-grid">
    <div v-for="feature in features" :key="feature.title" class="feature-card">
      <div class="feature-icon" v-html="feature.icon"></div>
      <h3 class="feature-title">{{ feature.title }}</h3>
      <p class="feature-description">{{ feature.description }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  features: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.feature-card {
  padding: 2rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 12px 32px rgba(139, 92, 246, 0.1);
  transform: translateY(-4px);
}

.dark .feature-card:hover {
  box-shadow: 0 12px 32px rgba(139, 92, 246, 0.2);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--vp-c-brand-1);
}

.feature-icon :deep(svg) {
  width: 2.5rem;
  height: 2.5rem;
  fill: currentColor;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.75rem;
}

.feature-description {
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
}
</style>
