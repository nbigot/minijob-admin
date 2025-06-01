<template>
  <main class="flex-1 p-4 md:p-6">
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Resources</h2>
        <p class="text-gray-600 dark:text-gray-400">View and manage locked resources</p>
      </div>
      <div class="mt-4 md:mt-0">
        <button class="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white dark:text-gray-200 font-bold py-2 px-4 rounded" @click="unlockAllResources">
          <i class="fas fa-unlock-alt mr-2"></i> Unlock All Resources
        </button>
      </div>
    </div>

    <!-- Resources Summary -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="rounded-full bg-blue-100 p-3">
            <i class="fas fa-lock text-blue-500"></i>
          </div>
          <div class="ml-4">
            <h4 class="text-gray-500 dark:text-gray-300 text-sm">Total Resources</h4>
            <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200">{{ resourceStats.total }}</h3>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="rounded-full bg-yellow-100 p-3">
            <i class="fas fa-lock text-yellow-500"></i>
          </div>
          <div class="ml-4">
            <h4 class="text-gray-500 dark:text-gray-300 text-sm">Locked Resources</h4>
            <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200">{{ resourceStats.locked }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Resources Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resource Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Topic</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Job ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Locked Since</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="resource in resources" :key="resource.name">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{{ resource.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
                >
                  {{ resource.topic }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ resource.jobId || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ resource.lockedSince || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <button 
                  class="text-red-600 hover:text-red-900 dark:text-red-700"
                  @click="unlockResource(resource.name)"
                >
                  <i class="fas fa-unlock mr-1"></i> Unlock
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script>
import { resourceService } from '../services/index.js';

export default {
  name: 'Resources',
  data() {
    return {
      loading: false,
      resourceStats: {
        total: 0,
        locked: 0,
        available: 0
      },
      resources: []
    }
  },
  methods: {
    async loadResources() {
      this.loading = true;
      try {
        const [resourcesResponse, statsResponse] = await Promise.all([
          resourceService.getResources(),
          resourceService.getResourceStats()
        ]);
        
        this.resources = resourcesResponse;
        this.resourceStats = statsResponse;
      } catch (error) {
        console.error('Error loading resources:', error);
        this.$notify({
          title: 'Error',
          text: 'Failed to load resources',
          type: 'error'
        });
      } finally {
        this.loading = false;
      }
    },

    async unlockResource(resourceName) {
      if (confirm(`Are you sure you want to unlock ${resourceName}? This may affect running jobs.`)) {
        try {
          await resourceService.unlockResource(resourceName);
          
          // Update local state
          const resource = this.resources.find(r => r.name === resourceName);
          if (resource) {
            resource.jobId = null;
            resource.lockedSince = null;
            this.resourceStats.locked--;
            this.resourceStats.available++;
          }
          
          this.$notify({
            title: 'Success',
            text: `Resource ${resourceName} unlocked successfully`,
            type: 'success'
          });
        } catch (error) {
          console.error('Error unlocking resource:', error);
          this.$notify({
            title: 'Error',
            text: `Failed to unlock resource ${resourceName}`,
            type: 'error'
          });
        }
      }
    },

    async unlockAllResources() {
      if (confirm('Are you sure you want to unlock all resources? This may affect running jobs.')) {
        try {
          const response = await resourceService.unlockAllResources();
          
          // Update local state
          this.resources.forEach(resource => {
            resource.jobId = null;
            resource.lockedSince = null;
          });
          
          this.resourceStats.locked = 0;
          this.resourceStats.available = this.resourceStats.total;
          
          this.$notify({
            title: 'Success',
            text: `All resources unlocked successfully (${response.unlockedCount} resources)`,
            type: 'success'
          });
        } catch (error) {
          console.error('Error unlocking all resources:', error);
          this.$notify({
            title: 'Error',
            text: 'Failed to unlock all resources',
            type: 'error'
          });
        }
      }
    }
  },

  async mounted() {
    await this.loadResources();
  }
}
</script>