<template>
  <main class="flex-1 p-4 md:p-6">
    <div>
      <!-- Dashboard Header -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Dashboard Overview</h2>
        <p class="text-gray-600 dark:text-gray-400">Monitor server status and performance</p>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <div v-for="i in 5" :key="i" class="bg-white dark:bg-gray-800 rounded-lg shadow animate-pulse p-4">
          <div class="flex items-center">
            <div class="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
            <div class="ml-4 flex-1">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else>
        <!-- Status Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          <!-- Created Jobs Card -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="flex items-center">
              <div class="rounded-full bg-blue-100 p-3 flex items-center justify-center w-10 h-10">
                <i class="fas fa-plus text-blue-500 text-sm"></i>
              </div>
              <div class="ml-4">
                <h4 class="text-gray-500 text-sm dark:text-gray-400">Created</h4>
                <h3 class="text-2xl font-bold dark:text-gray-200">{{ dashboardData.createdJobs || 24 }}</h3>
              </div>
            </div>
          </div>
          
          <!-- Queued Jobs Card -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="flex items-center">
              <div class="rounded-full bg-yellow-100 p-3 flex items-center justify-center w-10 h-10">
                <i class="fas fa-clock text-yellow-500 text-sm"></i>
              </div>
              <div class="ml-4">
                <h4 class="text-gray-500 text-sm dark:text-gray-400">Queued</h4>
                <h3 class="text-2xl font-bold dark:text-gray-200">{{ dashboardData.queuedJobs || 12 }}</h3>
              </div>
            </div>
          </div>
          
          <!-- Running Jobs Card -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="flex items-center">
              <div class="rounded-full bg-green-100 p-3 flex items-center justify-center w-10 h-10">
                <i class="fas fa-play text-green-500 text-sm"></i>
              </div>
              <div class="ml-4">
                <h4 class="text-gray-500 text-sm dark:text-gray-400">Running</h4>
                <h3 class="text-2xl font-bold dark:text-gray-200">{{ dashboardData.runningJobs || 8 }}</h3>
              </div>
            </div>
          </div>
          
          <!-- Succeeded Jobs Card -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="flex items-center">
              <div class="rounded-full bg-indigo-100 p-3 flex items-center justify-center w-10 h-10">
                <i class="fas fa-check text-indigo-500 text-sm"></i>
              </div>
              <div class="ml-4">
                <h4 class="text-gray-500 text-sm dark:text-gray-400">Succeeded</h4>
                <h3 class="text-2xl font-bold dark:text-gray-200">{{ dashboardData.succeededJobs || 156 }}</h3>
              </div>
            </div>
          </div>
          
          <!-- Failed Jobs Card -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="flex items-center">
              <div class="rounded-full bg-red-100 p-3 flex items-center justify-center w-10 h-10">
                <i class="fas fa-times text-red-500 text-sm"></i>
              </div>
              <div class="ml-4">
                <h4 class="text-gray-500 text-sm dark:text-gray-400">Failed</h4>
                <h3 class="text-2xl font-bold dark:text-gray-200">{{ dashboardData.failedJobs || 7 }}</h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Job Distribution Chart -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4 dark:text-gray-200">Job Status Distribution</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium dark:text-gray-300">Created</span>
                  <span class="text-sm font-medium dark:text-gray-300">{{ dashboardData.createdJobs || 24 }} ({{ calculatePercentage(dashboardData.createdJobs || 24) }}%)</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div class="bg-blue-500 dark:bg-blue-700 h-2.5 rounded-full" :style="{ width: calculatePercentage(dashboardData.createdJobs || 24) + '%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium dark:text-gray-300">Queued</span>
                  <span class="text-sm font-medium dark:text-gray-300">{{ dashboardData.queuedJobs || 12 }} ({{ calculatePercentage(dashboardData.queuedJobs || 12) }}%)</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div class="bg-yellow-500 dark:bg-yellow-700 h-2.5 rounded-full" :style="{ width: calculatePercentage(dashboardData.queuedJobs || 12) + '%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium dark:text-gray-300">Running</span>
                  <span class="text-sm font-medium dark:text-gray-300">{{ dashboardData.runningJobs || 8 }} ({{ calculatePercentage(dashboardData.runningJobs || 8) }}%)</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div class="bg-green-500 dark:bg-green-700 h-2.5 rounded-full" :style="{ width: calculatePercentage(dashboardData.runningJobs || 8) + '%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium dark:text-gray-300">Succeeded</span>
                  <span class="text-sm font-medium dark:text-gray-300">{{ dashboardData.succeededJobs || 156 }} ({{ calculatePercentage(dashboardData.succeededJobs || 156) }}%)</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div class="bg-indigo-500 dark:bg-indigo-700 h-2.5 rounded-full" :style="{ width: calculatePercentage(dashboardData.succeededJobs || 156) + '%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium dark:text-gray-300">Failed</span>
                  <span class="text-sm font-medium dark:text-gray-300">{{ dashboardData.failedJobs || 7 }} ({{ calculatePercentage(dashboardData.failedJobs || 7) }}%)</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div class="bg-red-500 dark:bg-red-700 h-2.5 rounded-full" :style="{ width: calculatePercentage(dashboardData.failedJobs || 7) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Topics Distribution -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4 dark:text-gray-200">Jobs by Topic</h3>
            <div class="space-y-4">
              <div v-for="(count, topic, index) in dashboardData.jobsByTopic" :key="index">
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium dark:text-gray-300">{{ topic }}</span>
                  <span class="text-sm font-medium dark:text-gray-300">{{ count }} ({{ calculateTopicPercentage(count) }}%)</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div :class="getTopicColorClass(index)" class="h-2.5 rounded-full" :style="{ width: calculateTopicPercentage(count) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Jobs and Resources -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Recent Jobs -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div class="p-4 border-b flex justify-between items-center">
              <h3 class="text-lg font-semibold dark:text-gray-200">Recent Jobs</h3>
              <router-link to="/jobs" class="text-primary-600 hover:text-primary-800 text-sm dark:text-blue-400">View All</router-link>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">ID</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Topic</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Created</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="job in dashboardData.recentJobs" :key="job.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{{ job.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ job.topic || job.type }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusClass(job.status)">
                        {{ job.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ formatDate(job.created) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Locked Resources -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div class="p-4 border-b flex justify-between items-center">
              <h3 class="text-lg font-semibold dark:text-gray-200">Locked Resources</h3>
              <router-link to="/resources" class="text-primary-600 hover:text-primary-800 text-sm dark:text-blue-400">View All</router-link>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Resource</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Job ID</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Locked Since</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="(resource, index) in dashboardData.lockedResources" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{{ resource.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ resource.jobId }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ formatDateRelative(resource.lockedSince) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <button @click="unlockResource(resource.id)" class="text-red-600 hover:text-red-900 dark:text-red-600">Unlock</button>
                    </td>
                  </tr>
                  <tr v-if="!dashboardData.lockedResources || dashboardData.lockedResources.length === 0">
                    <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No locked resources</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../api';

// Dashboard data
const dashboardData = ref({
  createdJobs: 24,
  queuedJobs: 12,
  runningJobs: 8,
  succeededJobs: 156,
  failedJobs: 7,
  recentJobs: [],
  lockedResources: [],
  serverStatus: 'healthy',
  memoryUsage: 42,
  responseTime: 124,
  jobsByTopic: {
    'data-processing': 87,
    'email-notifications': 56,
    'report-generation': 34,
    'file-uploads': 22,
    'other': 8
  }
});
const loading = ref(true);

// Calculate total jobs for percentage calculations
const totalJobs = computed(() => {
  return (dashboardData.value.createdJobs || 24) +
         (dashboardData.value.queuedJobs || 12) +
         (dashboardData.value.runningJobs || 8) +
         (dashboardData.value.succeededJobs || 156) +
         (dashboardData.value.failedJobs || 7);
});

// Calculate total topic jobs
const totalTopicJobs = computed(() => {
  return Object.values(dashboardData.value.jobsByTopic).reduce((sum, count) => sum + count, 0);
});

// Calculate percentage for job status
const calculatePercentage = (count) => {
  return Math.round((count / totalJobs.value) * 100);
};

// Calculate percentage for job topics
const calculateTopicPercentage = (count) => {
  return Math.round((count / totalTopicJobs.value) * 100);
};

// Get topic color class based on index
const getTopicColorClass = (index) => {
  const colors = [
    'bg-purple-500 dark:bg-purple-700', 'bg-pink-500 dark:bg-pink-700', 'bg-cyan-500 dark:bg-cyan-700',
    'bg-orange-500 dark:bg-orange-700', 'bg-gray-500 dark:bg-gray-700', 'bg-lime-500 dark:bg-lime-700',
    'bg-teal-500 dark:bg-teal-700', 'bg-emerald-500 dark:bg-emerald-700', 'bg-yellow-500 dark:bg-yellow-700',
    'bg-red-500 dark:bg-red-700', 'bg-blue-500 dark:bg-blue-700', 'bg-indigo-500 dark:bg-indigo-700',
    'bg-rose-500 dark:bg-rose-700', 'bg-slate-500 dark:bg-slate-700', 'bg-zinc-500 dark:bg-zinc-700'
  ];
  return colors[index % colors.length];
};

// Fetch dashboard data
const fetchDashboardData = async () => {
  loading.value = true;
  
  try {
    // For a real application, you would have a dedicated endpoint for dashboard data
    // Here we're gathering data from multiple endpoints to simulate that
    
    // Get jobs data
    const jobsResponse = await api.getJobs({ limit: 5 });
    const recentJobs = jobsResponse.data.items || [];
    
    // Get health data
    const healthResponse = await api.getHealth();
    const healthData = healthResponse.data;
    
    // Get resources data
    const resourcesResponse = await api.getResources();
    const resources = resourcesResponse.data || [];
    
    // Create mock dashboard data combining all responses
    dashboardData.value = {
      createdJobs: 24,
      queuedJobs: 12,
      runningJobs: 8,
      succeededJobs: 156,
      failedJobs: 7,
      recentJobs: recentJobs.map(job => ({
        ...job,
        topic: ['data-processing', 'email-notifications', 'report-generation', 'file-uploads', 'other'][Math.floor(Math.random() * 5)]
      })),
      lockedResources: [
        { id: 1, name: 'database-connection', jobId: '73b6a7e9-51e0-4982-a106-f54c4369271a', lockedSince: new Date(Date.now() - 5 * 60 * 1000) },
        { id: 2, name: 'file-system', jobId: '9e7b3fee-84c5-4fd0-b8e6-8e735c7deca1', lockedSince: new Date(Date.now() - 25 * 60 * 1000) },
        { id: 3, name: 'api-key', jobId: 'a8f2e357-1d2c-4b6e-9d0f-e5c7b3461d9a', lockedSince: new Date(Date.now() - 35 * 60 * 1000) }
      ],
      serverStatus: healthData.status || 'healthy',
      memoryUsage: 42,
      responseTime: 124,
      jobsByTopic: {
        'data-processing': 87,
        'email-notifications': 56,
        'report-generation': 34,
        'file-uploads': 22,
        'other': 8
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Even if there's an error, we'll show mock data
  } finally {
    loading.value = false;
  }
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.floor((now - date) / 1000);
  
  if (diffSeconds < 60) {
    return 'Just now';
  } else if (diffSeconds < 3600) {
    return `${Math.floor(diffSeconds / 60)}m ago`;
  } else if (diffSeconds < 86400) {
    return `${Math.floor(diffSeconds / 3600)}h ago`;
  } else {
    return `${Math.floor(diffSeconds / 86400)}d ago`;
  }
};

// Same as formatDate for this demo
const formatDateRelative = formatDate;

// Get status class
const getStatusClass = (status) => {
  if (!status) return '';
  
  switch (status.toLowerCase()) {
    case 'running':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400';
    case 'scheduled':
    case 'queued':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400';
    case 'completed':
    case 'succeeded':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-400';
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400';
    case 'created':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
  }
};

// Unlock a resource (mock function)
const unlockResource = (resourceId) => {
  // In a real app, this would make an API call
  console.log(`Unlocking resource with ID: ${resourceId}`);
  // Remove the resource from the locked resources list
  dashboardData.value.lockedResources = dashboardData.value.lockedResources.filter(r => r.id !== resourceId);
};

// Fetch data on mount
onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>