<template>
  <div class="screenshot-wrapper">
    <div
      class="screenshot-container"
      @click="toggleZoom"
    >
      <img
        :src="src"
        :alt="alt"
        :class="{ zoomed: isZoomed }"
      >
      <div
        v-if="caption"
        class="screenshot-caption"
      >
        {{ caption }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "Screenshot",
  },
  caption: {
    type: String,
    default: "",
  },
});

const isZoomed = ref(false);

const toggleZoom = () => {
  isZoomed.value = !isZoomed.value;
};
</script>

<style scoped>
.screenshot-wrapper {
  margin: 2rem 0;
}

.screenshot-container {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--vp-c-border);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.screenshot-container:hover {
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
  transform: translateY(-2px);
}

.dark .screenshot-container {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.dark .screenshot-container:hover {
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
}

.screenshot-container img {
  width: 100%;
  display: block;
  transition: all 0.3s ease;
}

.screenshot-container img.zoomed {
  transform: scale(1.5);
}

.screenshot-caption {
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-soft);
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  text-align: center;
  border-top: 1px solid var(--vp-c-border);
}
</style>
