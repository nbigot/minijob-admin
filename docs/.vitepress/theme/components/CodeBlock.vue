<template>
  <div class="code-block-wrapper">
    <div class="code-block-header">
      <span class="code-block-lang">{{ lang }}</span>
      <button
        class="copy-button"
        :class="{ copied }"
        @click="copyCode"
      >
        <span v-if="!copied">Copy</span>
        <span v-else>Copied!</span>
      </button>
    </div>
    <div class="code-block-content">
      <pre><code>{{ code }}</code></pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  lang: {
    type: String,
    default: "sh",
  },
});

const copied = ref(false);

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};
</script>

<style scoped>
.code-block-wrapper {
  margin: 1.5rem 0;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.dark .code-block-wrapper {
  background: #1a1333;
  border-color: #312e81;
}

.code-block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-border);
}

.dark .code-block-header {
  background: #0f0a1e;
  border-bottom-color: #312e81;
}

.code-block-lang {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-transform: uppercase;
}

.copy-button {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-button:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.copy-button.copied {
  color: #10b981;
  border-color: #10b981;
}

.code-block-content {
  padding: 1.25rem;
  overflow-x: auto;
}

.code-block-content pre {
  margin: 0;
  background: transparent;
}

.code-block-content code {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}
</style>
