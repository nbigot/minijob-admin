<template>
  <main class="flex-1 p-4 md:p-6">
    <div>
      <div
        class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Jobs
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            View and manage all jobs in the system
          </p>
        </div>
        <div class="mt-4 md:mt-0">
          <button
            class="bg-primary-600 dark:bg-primary-900 hover:bg-primary-700 dark:hover:bg-primary-700 text-white font-bold py-2 px-4 rounded"
            @click="navigateToCreateJob"
          >
            <font-awesome-icon
              :icon="['fas', 'plus']"
              class="mr-2"
            /> Create
            New Job
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              for="status"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Status</label>
            <select
              id="status"
              v-model="filters.status"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 dark:bg-gray-500 dark:text-gray-300"
            >
              <option value="">
                All Statuses
              </option>
              <option value="created">
                Created
              </option>
              <option value="delayed">
                Delayed
              </option>
              <option value="pending">
                Pending
              </option>
              <option value="queued">
                Queued
              </option>
              <option value="running">
                Running
              </option>
              <option value="succeeded">
                Succeeded
              </option>
              <option value="failed">
                Failed
              </option>
              <option value="canceled">
                Canceled
              </option>
              <option value="deleted">
                Deleted
              </option>
              <option value="hidden">
                Hidden
              </option>
            </select>
          </div>
          <div>
            <label
              for="topic"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Topic</label>
            <select
              id="topic"
              v-model="filters.topic"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 dark:bg-gray-500 dark:text-gray-300"
            >
              <option value="">
                All Topics
              </option>
              <option
                v-for="topic in topics"
                :key="topic"
                :value="topic"
              >
                {{ topic }}
              </option>
            </select>
          </div>
          <div>
            <label
              for="sort"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Sort By</label>
            <select
              id="sort"
              v-model="filters.sort"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 dark:bg-gray-500 dark:text-gray-300"
            >
              <option value="created_asc">
                Created (Oldest)
              </option>
              <option value="created_desc">
                Created (Newest)
              </option>
              <option value="priority_asc">
                Priority (Low to High)
              </option>
              <option value="priority_desc">
                Priority (High to Low)
              </option>
              <option value="updated_asc">
                Updated (Oldest)
              </option>
              <option value="updated_desc">
                Updated (Newest)
              </option>
              <option value="topic_asc">
                Topic (A-Z)
              </option>
              <option value="topic_desc">
                Topic (Z-A)
              </option>
            </select>
          </div>
          <div>
            <label
              for="search"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Search</label>
            <div class="relative">
              <input
                id="search"
                v-model="filters.search"
                type="text"
                placeholder="Search by ID or content..."
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 pl-10 dark:bg-gray-500"
              >
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <font-awesome-icon
                  :icon="['fas', 'search']"
                  class="text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button
            class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-300 dark:hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded mr-2"
            @click="applyFilters"
          >
            <font-awesome-icon
              :icon="['fas', 'filter']"
              class="mr-2"
            /> Apply
            Filters
          </button>
          <button
            class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-300 dark:hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded"
            @click="resetFilters"
          >
            <font-awesome-icon
              :icon="['fas', 'redo']"
              class="mr-2"
            /> Reset
          </button>
        </div>
      </div>

      <!-- Shown in the page: auto-refresh reloads the list while a modal may be open -->
      <p
        v-if="loadError"
        class="mb-4 text-red-600"
      >
        {{ loadError }}
      </p>

      <!-- Jobs Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table
            class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          >
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Topic
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Updated
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
            >
              <tr
                v-for="job in jobs"
                :key="job.id"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {{ job.id }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                >
                  {{ job.topic }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStateClass(job.state)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ job.state }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                >
                  {{ job.created }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                >
                  {{ job.updated }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                >
                  <div class="flex space-x-2">
                    <button
                      class="text-primary-600 hover:text-primary-900"
                      title="View Details"
                      @click="viewJob(job.id)"
                    >
                      <font-awesome-icon :icon="['fas', 'eye']" />
                    </button>
                    <button
                      class="text-yellow-600 hover:text-yellow-900"
                      title="Clone"
                      @click="cloneJob(job.id)"
                    >
                      <font-awesome-icon :icon="['fas', 'copy']" />
                    </button>
                    <button
                      v-if="isCancellable(job.state)"
                      class="text-red-600 hover:text-red-900"
                      title="Cancel"
                      @click="cancelJob(job.id)"
                    >
                      <font-awesome-icon :icon="['fas', 'stop']" />
                    </button>
                    <button
                      class="text-red-600 hover:text-red-900"
                      title="Delete"
                      @click="deleteJob(job.id)"
                    >
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <div class="flex-1 flex justify-between sm:hidden">
            <a
              href="#"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              @click.prevent="prevPage"
            >
              Previous
            </a>
            <a
              href="#"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              @click.prevent="nextPage"
            >
              Next
            </a>
          </div>
          <div
            class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
          >
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-400">
                Showing
                <span class="font-medium">{{ paginationStart }}</span> to
                <span class="font-medium">{{ paginationEnd }}</span> of
                <span class="font-medium">{{ totalJobs }}</span> results
              </p>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <label
                  for="itemsPerPage"
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Items per page:
                </label>
                <select
                  id="itemsPerPage"
                  v-model.number="itemsPerPage"
                  class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 dark:bg-gray-500 dark:text-gray-300 text-sm"
                  @change="changeItemsPerPage"
                >
                  <option :value="5">
                    5
                  </option>
                  <option :value="10">
                    10
                  </option>
                  <option :value="25">
                    25
                  </option>
                  <option :value="50">
                    50
                  </option>
                  <option :value="100">
                    100
                  </option>
                </select>
              </div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <a
                  href="#"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-400"
                  @click.prevent="prevPage"
                >
                  <span class="sr-only">Previous</span>
                  <font-awesome-icon :icon="['fas', 'chevron-left']" />
                </a>
                <a
                  v-for="page in displayedPages"
                  :key="page"
                  href="#"
                  :class="[
                    currentPage === page
                      ? 'z-10 bg-primary-50 border-primary-500 text-primary-600 dark:bg-gray-200 dark:border-primary-800 dark:text-primary-900'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-300',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  ]"
                  @click.prevent="goToPage(page)"
                >
                  {{ page }}
                </a>
                <a
                  href="#"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-400"
                  @click.prevent="nextPage"
                >
                  <span class="sr-only">Next</span>
                  <font-awesome-icon :icon="['fas', 'chevron-right']" />
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConfirmationModal
      v-if="modalType === 'confirm'"
      :visible="showModal"
      :title="modalTitle"
      :message="modalMessage"
      @confirm="confirmModal"
      @cancel="cancelModal"
    />
    <SuccessModal
      v-if="modalType === 'success'"
      :visible="showModal"
      :title="modalTitle"
      :message="modalMessage"
      @confirm="cancelModal"
    />
    <FailureModal
      v-if="modalType === 'failure'"
      :visible="showModal"
      :title="modalTitle"
      :message="modalMessage"
      @confirm="cancelModal"
    />
  </main>
</template>

<script>
import { jobService, topicService } from "../services/index.js";
import { getStateClass } from "../utils/stateClass.js";
import { isCancellable } from "../utils/jobState.js";
import ConfirmationModal from "../components/ConfirmationModal.vue";
import SuccessModal from "../components/SuccessModal.vue";
import FailureModal from "../components/FailureModal.vue";

export default {
  name: "JobManager",
  components: {
    ConfirmationModal,
    SuccessModal,
    FailureModal,
  },
  data() {
    return {
      filters: {
        status: "",
        topic: "",
        sort: "created_desc",
        search: "",
      },
      jobs: [],
      topics: [],
      currentPage: 1,
      itemsPerPage: 10,
      totalJobs: 0,
      loading: false,
      loadError: "",
      showModal: false,
      modalTitle: "",
      modalMessage: "",
      modalAction: null,
      modalType: "confirm",
    };
  },
  computed: {
    paginationStart() {
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    paginationEnd() {
      return Math.min(this.currentPage * this.itemsPerPage, this.totalJobs);
    },
    displayedPages() {
      const totalPages = Math.ceil(this.totalJobs / this.itemsPerPage);
      if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      if (this.currentPage <= 3) {
        return [1, 2, 3, "...", totalPages];
      }

      if (this.currentPage >= totalPages - 2) {
        return [1, "...", totalPages - 2, totalPages - 1, totalPages];
      }

      return [1, "...", this.currentPage, "...", totalPages];
    },
  },
  async mounted() {
    // Load topics first
    await this.loadTopics();

    // Check if there's a topic filter in the query parameters
    if (this.$route.query.topic) {
      this.filters.topic = this.$route.query.topic;
    }

    // Load initial job data
    await this.loadJobs();
  },
  methods: {
    getStateClass,
    isCancellable,
    openModal(title, message, action = null) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.modalAction = action;
      this.modalType = "confirm";
      this.showModal = true;
    },
    openModalSuccess(message, title = "Success") {
      this.modalTitle = title;
      this.modalMessage = message;
      this.modalAction = null;
      this.modalType = "success";
      this.showModal = true;
    },
    openModalFailure(message, title = "Error") {
      this.modalTitle = title;
      this.modalMessage = message;
      this.modalAction = null;
      this.modalType = "failure";
      this.showModal = true;
    },
    confirmModal() {
      this.showModal = false;
      if (this.modalType === "confirm" && this.modalAction) {
        this.modalAction();
      }
    },
    cancelModal() {
      this.showModal = false;
    },
    async loadTopics() {
      try {
        const response = await topicService.getTopics();
        if (response && response.topics && Array.isArray(response.topics)) {
          this.topics = response.topics;
        }
      } catch (error) {
        console.error("Error loading topics:", error);
        this.openModalFailure(error.message);
      }
    },
    async loadJobs() {
      this.loading = true;
      try {
        const params = {
          page: this.currentPage,
          limit: this.itemsPerPage,
          ...this.filters,
        };

        const response = await jobService.getJobs(params);
        this.jobs = response.jobs || [];
        this.totalJobs = response.total || 0;
        this.loadError = "";
      } catch (error) {
        console.error("Error loading jobs:", error);
        this.loadError = error.message || "Failed to load jobs";
      } finally {
        this.loading = false;
      }
    },

    async applyFilters() {
      this.currentPage = 1;
      await this.loadJobs();
    },

    async changeItemsPerPage() {
      this.currentPage = 1;
      await this.loadJobs();
    },

    async resetFilters() {
      this.filters = {
        status: "",
        topic: "",
        sort: "created_desc",
        search: "",
      };
      this.currentPage = 1;
      await this.loadJobs();
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.loadJobs();
      }
    },
    nextPage() {
      const totalPages = Math.ceil(this.totalJobs / this.itemsPerPage);
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.loadJobs();
      }
    },
    goToPage(page) {
      if (typeof page === "number") {
        this.currentPage = page;
        this.loadJobs();
      }
    },
    viewJob(id) {
      console.log("View job", id);
      this.$router.push(`/job/${id}`);
    },
    async cloneJob(id) {
      this.$router.push(`/job/create/clone/${id}`);
    },
    async cancelJob(id) {
      this.openModal(
        "Cancel Job",
        `Are you sure you want to cancel job ${id}?`,
        () => this.cancelJobAction(id)
      );
    },
    async cancelJobAction(id) {
      this.loading = true;
      try {
        await jobService.cancelJob(id);

        // Reload the list: the server enqueues the cancelled job again
        await this.loadJobs();

        this.openModalSuccess(`Job ${id} was cancelled successfully`);
      } catch (error) {
        console.error("Error cancelling job:", error);
        this.openModalFailure(error.message || "Failed to cancel job");
      } finally {
        this.loading = false;
      }
    },
    async deleteJob(id) {
      this.openModal(
        "Delete Job",
        `Are you sure you want to delete job ${id}? This action cannot be undone.`,
        () => this.deleteJobAction(id)
      );
    },
    async deleteJobAction(id) {
      this.loading = true;
      try {
        await jobService.deleteJob(id);

        // Remove the job from the list
        this.jobs = this.jobs.filter((job) => job.id !== id);
        this.totalJobs--;

        this.openModalSuccess(`Job ${id} was deleted successfully`);
      } catch (error) {
        console.error("Error deleting job:", error);
        this.openModalFailure(error.message || "Failed to delete job");
      } finally {
        this.loading = false;
      }
    },
    navigateToCreateJob() {
      // Get unique topics from the jobs list
      const topics = [...new Set(this.jobs.map((job) => job.topic))];

      // Navigate to create job page with topics as route params
      this.$router.push({
        path: "/job/create",
        query: { topics: JSON.stringify(topics) },
      });
    },
    handleRefreshData() {
      //console.log("Refreshing jobs data");
      this.loadJobs && this.loadJobs();
    },
  },
};
</script>
