<template>
  <main class="flex-1 p-4 md:p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">System Administration</h2>
      <p class="text-gray-600 dark:text-gray-400">Manage server operations and perform bulk actions</p>
    </div>

    <!-- Server Control -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Server Control</h3>
      <div class="flex flex-wrap gap-4">
        <button 
          class="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white dark:text-gray-200 font-bold py-2 px-4 rounded"
          @click="restartServer"
        >
          <i class="fas fa-sync-alt mr-2"></i> Restart Server
        </button>
        <button 
          class="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white dark:text-gray-200 font-bold py-2 px-4 rounded"
          @click="shutdownServer"
        >
          <i class="fas fa-power-off mr-2"></i> Shutdown Server
        </button>
      </div>
    </div>

    <!-- Bulk Operations -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Bulk Operations</h3>
      <div class="space-y-4">
        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Delete All Jobs</h4>
          <p class="text-gray-600 dark:text-gray-400 mb-4">This will permanently delete all jobs from the system. This action cannot be undone.</p>
          <button 
            class="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white dark:text-gray-200 font-bold py-2 px-4 rounded"
            @click="deleteAllJobs"
          >
            <i class="fas fa-trash-alt mr-2"></i> Delete All Jobs
          </button>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Clear Job Queues</h4>
          <p class="text-gray-600 dark:text-gray-400 mb-4">This will remove all queued jobs. Running jobs will not be affected.</p>
          <button 
            class="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white dark:text-gray-200 font-bold py-2 px-4 rounded"
            @click="clearJobQueues"
          >
            <i class="fas fa-broom mr-2"></i> Clear Queues
          </button>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Unlock All Resources</h4>
          <p class="text-gray-600 dark:text-gray-400 mb-4">This will release all locked resources. Running jobs may be affected.</p>
          <button 
            class="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white dark:text-gray-200 font-bold py-2 px-4 rounded"
            @click="unlockAllResources"
          >
            <i class="fas fa-unlock-alt mr-2"></i> Unlock All Resources
          </button>
        </div>
      </div>
    </div>

  </main>
</template>

<script>
export default {
  name: 'System',
  data() {
    return {
    }
  },
  methods: {
    restartServer() {
      if (confirm('Are you sure you want to restart the server?')) {
        // Implement server restart logic
        console.log('Restarting server...')
      }
    },
    shutdownServer() {
      if (confirm('Are you sure you want to shut down the server?')) {
        // Implement server shutdown logic
        console.log('Shutting down server...')
      }
    },
    deleteAllJobs() {
      if (confirm('WARNING: This will permanently delete all jobs. This action cannot be undone. Continue?')) {
        // Implement delete all jobs logic
        console.log('Deleting all jobs...')
      }
    },
    clearJobQueues() {
      if (confirm('Are you sure you want to clear the job queues?')) {
        // Implement clear queues logic
        console.log('Clearing job queues...')
      }
    },
    unlockAllResources() {
      if (confirm('Are you sure you want to unlock all resources? This may affect running jobs.')) {
        // Implement unlock resources logic
        console.log('Unlocking all resources...')
      }
    }
  }
}
</script>