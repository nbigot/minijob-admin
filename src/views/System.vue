<template>
  <div>
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
            <font-awesome-icon :icon="['fas', 'sync-alt']" class="mr-2" /> Restart Server
          </button>
          <button
            class="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white dark:text-gray-200 font-bold py-2 px-4 rounded"
            @click="shutdownServer"
          >
            <font-awesome-icon :icon="['fas', 'power-off']" class="mr-2" /> Shutdown Server
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
              <font-awesome-icon :icon="['fas', 'trash-alt']" class="mr-2" /> Delete All Jobs
            </button>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Clear Job Queues</h4>
            <p class="text-gray-600 dark:text-gray-400 mb-4">This will remove all queued jobs. Running jobs will not be affected.</p>
            <button
              class="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white dark:text-gray-200 font-bold py-2 px-4 rounded"
              @click="clearJobQueues"
            >
              <font-awesome-icon :icon="['fas', 'broom']" class="mr-2" /> Clear Queues
            </button>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Unlock All Resources</h4>
            <p class="text-gray-600 dark:text-gray-400 mb-4">This will release all locked resources. Running jobs may be affected.</p>
            <button
              class="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white dark:text-gray-200 font-bold py-2 px-4 rounded"
              @click="unlockAllResources"
            >
              <font-awesome-icon :icon="['fas', 'unlock-alt']" class="mr-2" /> Unlock All Resources
            </button>
          </div>
        </div>
      </div>

    </main>

    <ConfirmationModal
      :visible="showModal"
      :title="modalTitle"
      :message="modalMessage"
      @confirm="confirmModal"
      @cancel="cancelModal"
    />
  </div>
</template>

<script>
import { systemService } from '../services/index.js';
import ConfirmationModal from '../components/ConfirmationModal.vue';

export default {
  name: 'System',
  components: { ConfirmationModal },
  data() {
    return {
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      modalAction: null,
      loading: false
    }
  },
  methods: {
    openModal(title, message, action) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.modalAction = action;
      this.showModal = true;
    },
    confirmModal() {
      this.showModal = false;
      if (this.modalAction) {
        this.modalAction();
      }
    },
    cancelModal() {
      this.showModal = false;
    },
    async restartServer() {
      this.openModal(
        'Restart Server',
        'Are you sure you want to restart the server?',
        this.restartServerAction
      );
    },
    async restartServerAction() {
      this.loading = true;
      try {
        const response = await systemService.restartServer();
        this.openModal('Success', response.message || 'Server restart initiated', null);
      } catch (error) {
        console.error('Error restarting server:', error);
        this.openModal('Error', 'Failed to restart server', null);
      } finally {
        this.loading = false;
      }
    },
    async shutdownServer() {
      this.openModal(
        'Shutdown Server',
        'Are you sure you want to shut down the server?',
        this.shutdownServerAction
      );
    },
    async shutdownServerAction() {
      this.loading = true;
      try {
        const response = await systemService.shutdownServer();
        this.openModal('Success', response.message || 'Server shutdown initiated', null);
      } catch (error) {
        console.error('Error shutting down server:', error);
        this.openModal('Error', 'Failed to shutdown server', null);
      } finally {
        this.loading = false;
      }
    },
    async deleteAllJobs() {
      this.openModal(
        'Delete All Jobs',
        'WARNING: This will permanently delete all jobs. This action cannot be undone. Continue?',
        this.deleteAllJobsAction
      );
    },
    async deleteAllJobsAction() {
      this.loading = true;
      try {
        const response = await systemService.deleteAllJobs();
        this.openModal('Success', response.message || `All jobs deleted successfully (${response.deletedCount} jobs)`, null);
      } catch (error) {
        console.error('Error deleting all jobs:', error);
        this.openModal('Error', 'Failed to delete all jobs', null);
      } finally {
        this.loading = false;
      }
    },
    async clearJobQueues() {
      this.openModal(
        'Clear Job Queues',
        'Are you sure you want to clear the job queues?',
        this.clearJobQueuesAction
      );
    },
    async clearJobQueuesAction() {
      this.loading = true;
      try {
        const response = await systemService.clearJobQueues();
        this.openModal('Success', response.message || `Job queues cleared successfully (${response.clearedCount} items)`, null);
      } catch (error) {
        console.error('Error clearing job queues:', error);
        this.openModal('Error', 'Failed to clear job queues', null);
      } finally {
        this.loading = false;
      }
    },
    async unlockAllResources() {
      this.openModal(
        'Unlock All Resources',
        'Are you sure you want to unlock all resources? This may affect running jobs.',
        this.unlockAllResourcesAction
      );
    },
    async unlockAllResourcesAction() {
      this.loading = true;
      try {
        const response = await systemService.unlockAllResources();
        this.openModal('Success', response.message || `All resources unlocked successfully (${response.unlockedCount} resources)`, null);
      } catch (error) {
        console.error('Error unlocking all resources:', error);
        this.openModal('Error', 'Failed to unlock all resources', null);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
