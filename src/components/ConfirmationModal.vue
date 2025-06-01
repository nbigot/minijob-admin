<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 mx-auto">
      <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{{ title }}</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">{{ message }}</p>
      <div class="flex justify-end space-x-3">
        <button 
          @click="$emit('cancel')" 
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded"
        >
          Cancel
        </button>
        <button 
          @click="$emit('confirm')" 
          class="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmationModal',
  props: {
    visible: { type: Boolean, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true }
  }
}
</script>
