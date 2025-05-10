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
export default {
  name: 'Resources',
  data() {
    return {
      resourceStats: {
        total: 7,
        locked: 7
      },
      resources: [
        { 
          name: 'database-connection', 
          jobId: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 
          lockedSince: '5 min ago',
          topic: 'Database' 
        },
        { 
          name: 'file-system', 
          jobId: '7f8e9d6c-5b4a-4321-9f8e-7d6c5b4a3210', 
          lockedSince: '25 min ago',
          topic: 'Storage' 
        },
        { 
          name: 'api-key', 
          jobId: 'b7c8d9e0-f1a2-4b3c-8d9e-0f1a2b3c4d5e', 
          lockedSince: '35 min ago',
          topic: 'Security' 
        },
        { 
          name: 'email-service', 
          jobId: '2d3e4f5a-6b7c-4d5e-6f7a-8b9c0d1e2f3a', 
          lockedSince: '45 min ago',
          topic: 'Messaging' 
        },
        { 
          name: 'queue-manager', 
          jobId: 'c4d5e6f7-8a9b-4e5f-6a7b-8c9d0e1f2a3b', 
          lockedSince: '1 hour ago',
          topic: 'Messaging' 
        },
        { 
          name: 'backup-service', 
          jobId: '3f4a5b6c-7d8e-4f5a-6b7c-8d9e0f1a2b3c', 
          lockedSince: '1.5 hours ago',
          topic: 'Storage' 
        },
        { 
          name: 'auth-service', 
          jobId: 'd9e0f1a2-b3c4-4f1a-2b3c-4d5e6f7a8b9c', 
          lockedSince: '2 hours ago',
          topic: 'Security' 
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
          resource.jobId = null;
          resource.lockedSince = null;
          
          // Update stats
          this.resourceStats.locked--;
        }
      }
    },
    unlockAllResources() {
      if (confirm('Are you sure you want to unlock all resources? This may affect running jobs.')) {
        console.log('Unlocking all resources');
        
        // Update all locked resources
        this.resources.forEach(resource => {
          resource.jobId = null;
          resource.lockedSince = null;
        });
        
        // Update stats
        this.resourceStats.locked = 0;
      }
    }
  }
}
</script>