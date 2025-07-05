<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 mx-auto"
    >
      <h3 class="text-xl font-bold text-green-700 dark:text-green-400 mb-4">
        {{ title }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">{{ message }}</p>
      <div class="flex justify-end">
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SuccessModal",
  props: {
    visible: { type: Boolean, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
  },
};
</script>
