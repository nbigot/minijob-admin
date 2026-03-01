<template>
  <div class="bg-gray-50 border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold text-gray-800">
      {{ title }}
    </h3>
    <p class="mt-2 text-gray-600">
      {{ description }}
    </p>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'AppCard',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    }
  }
}
</script>
