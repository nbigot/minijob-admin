<template>
  <main class="flex-1 p-4 md:p-6">
    <div>
      <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Jobs</h2>
          <p class="text-gray-600 dark:text-gray-400">View and manage all jobs in the system</p>
        </div>
        <div class="mt-4 md:mt-0">
          <button @click="navigateToCreateJob" class="bg-primary-600 dark:bg-primary-900 hover:bg-primary-700 dark:hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">
            <font-awesome-icon :icon="['fas', 'plus']" class="mr-2" /> Create New Job
          </button>
        </div>
      </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select id="status" v-model="filters.status" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 dark:bg-gray-500 dark:text-gray-300">
            <option value="">All Statuses</option>
            <option value="created">Created</option>
            <option value="queued">Queued</option>
            <option value="running">Running</option>
            <option value="succeeded">Succeeded</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div>
          <label for="topic" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic</label>
          <select id="topic" v-model="filters.topic" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 dark:bg-gray-500 dark:text-gray-300">
            <option value="">All Topics</option>
            <option value="data-processing">data-processing</option>
            <option value="email-notifications">email-notifications</option>
            <option value="report-generation">report-generation</option>
            <option value="file-uploads">file-uploads</option>
          </select>
        </div>
        <div>
          <label for="sort" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
          <select id="sort" v-model="filters.sort" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 dark:bg-gray-500 dark:text-gray-300">
            <option value="created_desc">Created (Newest)</option>
            <option value="created_asc">Created (Oldest)</option>
            <option value="updated_desc">Updated (Newest)</option>
            <option value="updated_asc">Updated (Oldest)</option>
          </select>
        </div>
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <div class="relative">
            <input type="text" id="search" v-model="filters.search" placeholder="Search by ID or content..." class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 pl-10 dark:bg-gray-500">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <font-awesome-icon :icon="['fas', 'search']" class="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button @click="applyFilters" class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-300 dark:hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded mr-2">
          <font-awesome-icon :icon="['fas', 'filter']" class="mr-2" /> Apply Filters
        </button>
        <button @click="resetFilters" class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-300 dark:hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded">
          <font-awesome-icon :icon="['fas', 'redo']" class="mr-2" /> Reset
        </button>
      </div>
    </div>

    <!-- Jobs Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="job in jobs" :key="job.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">{{ job.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ job.topic }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(job.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ job.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ job.created }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ job.updated }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div class="flex space-x-2">
                  <button @click="viewJob(job.id)" class="text-primary-600 hover:text-primary-900" title="View Details">
                    <font-awesome-icon :icon="['fas', 'eye']" />
                  </button>
                  <button @click="cloneJob(job.id)" class="text-yellow-600 hover:text-yellow-900" title="Clone">
                    <font-awesome-icon :icon="['fas', 'copy']" />
                  </button>
                  <button v-if="job.status === 'Running'" @click="cancelJob(job.id)" class="text-red-600 hover:text-red-900" title="Cancel">
                    <font-awesome-icon :icon="['fas', 'stop']" />
                  </button>
                  <button @click="deleteJob(job.id)" class="text-red-600 hover:text-red-900" title="Delete">
                    <font-awesome-icon :icon="['fas', 'trash']" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <a href="#" @click.prevent="prevPage" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </a>
          <a href="#" @click.prevent="nextPage" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </a>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-400">
              Showing <span class="font-medium">{{ paginationStart }}</span> to <span class="font-medium">{{ paginationEnd }}</span> of <span class="font-medium">{{ totalJobs }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a href="#" @click.prevent="prevPage" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-400">
                <span class="sr-only">Previous</span>
                <font-awesome-icon :icon="['fas', 'chevron-left']" />
              </a>
              <a v-for="page in displayedPages" :key="page" href="#" 
                 @click.prevent="goToPage(page)" 
                 :class="[
                   currentPage === page 
                     ? 'z-10 bg-primary-50 border-primary-500 text-primary-600 dark:bg-gray-200 dark:border-primary-800 dark:text-primary-900'
                     : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-300',
                   'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                 ]">
                {{ page }}
              </a>
              <a href="#" @click.prevent="nextPage" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-400">
                <span class="sr-only">Next</span>
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
    </div>
  </main>
</template>

<script>
import { jobService } from '../services/index.js';

export default {
  name: 'Jobs',
  data() {
    return {
      filters: {
        status: '',
        topic: '',
        sort: 'created_desc',
        search: ''
      },
      jobs: [],
      currentPage: 1,
      itemsPerPage: 10,
      totalJobs: 0,
      loading: false
    }
  },
  computed: {
    paginationStart() {
      return (this.currentPage - 1) * this.itemsPerPage + 1
    },
    paginationEnd() {
      return Math.min(this.currentPage * this.itemsPerPage, this.totalJobs)
    },
    displayedPages() {
      const totalPages = Math.ceil(this.totalJobs / this.itemsPerPage)
      if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
      }
      
      if (this.currentPage <= 3) {
        return [1, 2, 3, '...', totalPages]
      }
      
      if (this.currentPage >= totalPages - 2) {
        return [1, '...', totalPages - 2, totalPages - 1, totalPages]
      }
      
      return [1, '...', this.currentPage, '...', totalPages]
    }
  },
  methods: {
    getStatusClass(status) {
      const classes = {
        'created': 'bg-gray-100 text-gray-800',
        'queued': 'bg-yellow-100 text-yellow-800',
        'running': 'bg-green-100 dark:bg-green-200 text-green-800',
        'succeeded': 'bg-indigo-100 text-indigo-800',
        'failed': 'bg-red-100 text-red-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },
    
    async loadJobs() {
      this.loading = true;
      try {
        const params = {
          page: this.currentPage,
          limit: this.itemsPerPage,
          ...this.filters
        };
        
        const response = await jobService.getJobs(params);
        this.jobs = response.jobs || [];
        this.totalJobs = response.total || 0;
      } catch (error) {
        console.error('Error loading jobs:', error);
        this.$notify({
          title: 'Error',
          text: 'Failed to load jobs',
          type: 'error'
        });
      } finally {
        this.loading = false;
      }
    },
    
    async applyFilters() {
      this.currentPage = 1;
      await this.loadJobs();
    },
    
    async resetFilters() {
      this.filters = {
        status: '',
        topic: '',
        sort: 'created_desc',
        search: ''
      };
      this.currentPage = 1;
      await this.loadJobs();
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.loadJobs()
      }
    },
    nextPage() {
      const totalPages = Math.ceil(this.totalJobs / this.itemsPerPage)
      if (this.currentPage < totalPages) {
        this.currentPage++
        this.loadJobs()
      }
    },
    goToPage(page) {
      if (typeof page === 'number') {
        this.currentPage = page
        this.loadJobs()
      }
    },
    viewJob(id) {
      console.log('View job', id);
      this.$router.push(`/job/${id}`);
    },
    async cloneJob(id) {
      console.log('Clone job', id);
      // TODO: Implement clone functionality
    },
    async cancelJob(id) {
      if (confirm(`Are you sure you want to cancel job ${id}?`)) {
        try {
          await jobService.cancelJob(id);
          
          // Update job status in the list
          const job = this.jobs.find(j => j.id === id);
          if (job) {
            job.status = 'Cancelled';
          }
          
          this.$notify({
            title: 'Success',
            text: `Job ${id} was cancelled successfully`,
            type: 'success'
          });
        } catch (error) {
          console.error('Error cancelling job:', error);
          this.$notify({
            title: 'Error',
            text: error.message,
            type: 'error'
          });
        }
      }
    },
    async deleteJob(id) {
      if (confirm(`Are you sure you want to delete job ${id}? This action cannot be undone.`)) {
        try {
          await jobService.deleteJob(id);
          
          // Remove the job from the list
          this.jobs = this.jobs.filter(job => job.id !== id);
          this.totalJobs--;
          
          this.$notify({
            title: 'Success',
            text: `Job ${id} was deleted successfully`,
            type: 'success'
          });
        } catch (error) {
          console.error('Error deleting job:', error);
          this.$notify({
            title: 'Error',
            text: error.message,
            type: 'error'
          });
        }
      }
    },
    navigateToCreateJob() {
      // Get unique topics from the jobs list
      const topics = [...new Set(this.jobs.map(job => job.topic))];
      
      // Navigate to create job page with topics as route params
      this.$router.push({
        path: '/job/create',
        query: { topics: JSON.stringify(topics) }
      });
    }
  },
  async mounted() {
    // Load initial job data
    await this.loadJobs();
  }
}
</script>