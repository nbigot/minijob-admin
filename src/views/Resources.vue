<template>
  <main class="flex-1 p-4 md:p-6">
    <div
      class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Resources
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          View and manage locked resources
        </p>
      </div>
      <div class="mt-4 md:mt-0">
        <button
          class="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white dark:text-gray-200 font-bold py-2 px-4 rounded"
          @click="unlockAllResources"
        >
          <font-awesome-icon
            :icon="['fas', 'unlock-alt']"
            class="mr-2"
          />
          Unlock All Resources
        </button>
      </div>
    </div>

    <!-- Resources Summary -->
    <!-- The server only knows the locked resources: there is no total to show -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="rounded-full bg-yellow-100 p-3">
            <font-awesome-icon
              :icon="['fas', 'lock']"
              class="text-yellow-500"
            />
          </div>
          <div class="ml-4">
            <h4 class="text-gray-500 dark:text-gray-300 text-sm">
              Locked Resources
            </h4>
            <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {{ lockedResources }}
            </h3>
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
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Resource Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Topic
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Job ID
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Locked Since
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
          >
            <tr
              v-for="resource in resourceStats"
              :key="resource.name"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                {{ resource.resourceName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400"
                >
                  {{ resource.topic }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ resource.jobUuid || "-" }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ formatDuration(resource.lockDuration) + " ago" || "-" }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                <button
                  class="text-red-600 hover:text-red-900 dark:text-red-700"
                  @click="unlockResource(resource.resourceName)"
                >
                  <font-awesome-icon
                    :icon="['fas', 'unlock']"
                    class="mr-1"
                  />
                  Unlock
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
import { resourceService } from "../services/index.js";
import ConfirmationModal from "../components/ConfirmationModal.vue";
import SuccessModal from "../components/SuccessModal.vue";
import FailureModal from "../components/FailureModal.vue";

export default {
  name: "ResourceManager",
  components: { ConfirmationModal, SuccessModal, FailureModal },
  data() {
    return {
      resourceStats: [],
      lockedResources: 0,
      showModal: false,
      modalTitle: "",
      modalMessage: "",
      modalAction: null,
      modalType: "confirm",
    };
  },

  async mounted() {
    await this.loadResources();
  },
  methods: {
    async loadResources() {
      try {
        this.resourceStats = await resourceService.getResourceStats();
        this.lockedResources = this.resourceStats.filter(
          (r) => r.jobId !== null
        ).length;
      } catch (error) {
        console.error("Error loading resources:", error);
        this.openModalFailure("Failed to load resources");
      }
    },

    async unlockResource(resourceName) {
      this.openModal(
        "Unlock Resource",
        `Are you sure you want to unlock ${resourceName}? This may affect running jobs.`,
        async () => {
          try {
            await resourceService.unlockResource(resourceName);
            this.openModalSuccess(
              `Resource ${resourceName} unlocked successfully`
            );
            await this.loadResources();
          } catch (error) {
            console.error("Error unlocking resource:", error);
            this.openModalFailure(`Failed to unlock resource ${resourceName}.`);
          }
        }
      );
    },

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

    async unlockAllResources() {
      this.openModal(
        "Unlock All Resources",
        "Are you sure you want to unlock all resources? This may affect running jobs.",
        async () => {
          try {
            const response = await resourceService.unlockAllResources();
            this.openModalSuccess(`All resources unlocked successfully`);
            await this.loadResources();
          } catch (error) {
            console.error("Error unlocking all resources:", error);
            this.openModalFailure("Failed to unlock all resources");
          }
        }
      );
    },
    handleRefreshData() {
      this.loadResources && this.loadResources();
    },
    formatDuration(duration) {
      if (!duration || duration === 0) {
        return "-";
      }

      // Convert to seconds if duration is in milliseconds
      const seconds =
        duration > 10000000000 ? Math.floor(duration / 1000) : duration;

      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
      } else {
        return `${remainingSeconds}s`;
      }
    },
  },
};
</script>
