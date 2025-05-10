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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="rounded-full bg-green-100 p-3">
            <i class="fas fa-unlock text-green-500"></i>
          </div>
          <div class="ml-4">
            <h4 class="text-gray-500 dark:text-gray-300 text-sm">Available Resources</h4>
            <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200">{{ resourceStats.available }}</h3>
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
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
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
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="resource.isLocked ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'"
                >
                  {{ resource.isLocked ? 'Locked' : 'Available' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ resource.jobId || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ resource.lockedSince || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <button 
                  v-if="resource.isLocked"
                  class="text-red-600 hover:text-red-900 dark:text-red-700"
                  @click="unlockResource(resource.name)"
                >
                  <i class="fas fa-unlock mr-1"></i> Unlock
                </button>
                <span v-else>-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'Resources',
  data() {
    return {
      resourceStats: {
        total: 15,
        locked: 7,
        available: 8
      },
      resources: [
        { 
          name: 'database-connection', 
          isLocked: true, 
          jobId: 'job-123', 
          lockedSince: '5 min ago' 
        },
        { 
          name: 'file-system', 
          isLocked: true, 
          jobId: 'job-119', 
          lockedSince: '25 min ago' 
        },
        { 
          name: 'api-key', 
          isLocked: true, 
          jobId: 'job-117', 
          lockedSince: '35 min ago' 
        },
        { 
          name: 'email-service', 
          isLocked: true, 
          jobId: 'job-115', 
          lockedSince: '45 min ago' 
        },
        { 
          name: 'storage-bucket', 
          isLocked: false 
        },
        { 
          name: 'cache-service', 
          isLocked: false 
        },
        { 
          name: 'queue-manager', 
          isLocked: true, 
          jobId: 'job-110', 
          lockedSince: '1 hour ago' 
        },
        { 
          name: 'backup-service', 
          isLocked: true, 
          jobId: 'job-109', 
          lockedSince: '1.5 hours ago' 
        },
        { 
          name: 'auth-service', 
          isLocked: true, 
          jobId: 'job-105', 
          lockedSince: '2 hours ago' 
        },
        { 
          name: 'logging-system', 
          isLocked: false 
        },
        { 
          name: 'monitoring-service', 
          isLocked: false 
        },
        { 
          name: 'notification-service', 
          isLocked: false 
        },
        { 
          name: 'batch-processor', 
          isLocked: false 
        },
        { 
          name: 'scheduler', 
          isLocked: false 
        },
        { 
          name: 'metrics-collector', 
          isLocked: false 
        }
      ]
    }
  },
  methods: {
    unlockResource(resourceName) {
      if (confirm(`Are you sure you want to unlock ${resourceName}? This may affect running jobs.`)) {
        console.log(`Unlocking resource: ${resourceName}`);
        
        // Find the resource and update its status
        const resource = this.resources.find(r => r.name === resourceName);
        if (resource) {
          resource.isLocked = false;
          resource.jobId = null;
          resource.lockedSince = null;
          
          // Update stats
          this.resourceStats.locked--;
          this.resourceStats.available++;
        }
      }
    },
    unlockAllResources() {
      if (confirm('Are you sure you want to unlock all resources? This may affect running jobs.')) {
        console.log('Unlocking all resources');
        
        // Update all locked resources
        this.resources.forEach(resource => {
          if (resource.isLocked) {
            resource.isLocked = false;
            resource.jobId = null;
            resource.lockedSince = null;
          }
        });
        
        // Update stats
        this.resourceStats.available = this.resourceStats.total;
        this.resourceStats.locked = 0;
      }
    }
  }
}
</script>