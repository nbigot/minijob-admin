<template>
  <main class="flex-1 p-4 md:p-6">
    <div
      v-if="loading"
      class="text-center py-8"
    >
      <p class="text-gray-600 dark:text-gray-400">
        Loading job details...
      </p>
    </div>
    <div
      v-else-if="error"
      class="text-center py-8"
    >
      <p class="text-red-600">
        {{ error }}
      </p>
      <button
        class="mt-4 text-primary-600 hover:text-primary-800"
        @click="goBack"
      >
        <font-awesome-icon :icon="['fas', 'arrow-left']" /> Back to Jobs
      </button>
    </div>
    <div v-else-if="job">
      <div
        class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <div class="flex items-center">
            <a
              href="#"
              class="text-primary-600 hover:text-primary-800 mr-2"
              @click.prevent="goBack"
            >
              <font-awesome-icon :icon="['fas', 'arrow-left']" />
            </a>
            <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Job Detail: {{ job.name }}
            </h2>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            {{ job.id }}
          </p>
        </div>
        <div class="mt-4 md:mt-0 flex flex-wrap gap-2">
          <button
            class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            @click="cloneJob"
          >
            <font-awesome-icon
              :icon="['fas', 'copy']"
              class="mr-2"
            /> Clone
          </button>
          <button
            v-if="canCancel"
            class="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            @click="cancelJob"
          >
            <font-awesome-icon
              :icon="['fas', 'stop']"
              class="mr-2"
            /> Cancel
          </button>
          <button
            class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            @click="deleteJob"
          >
            <font-awesome-icon
              :icon="['fas', 'trash']"
              class="mr-2"
            /> Delete
          </button>
        </div>
      </div>

      <!-- Job Status -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div class="flex items-center mb-4 md:mb-0">
            <div
              :class="getStatusIconClass(job.state)"
              class="rounded-full p-3 mr-4"
            >
              <font-awesome-icon :icon="getStatusIcon(job.state)" />
            </div>
            <div>
              <h3
                class="text-xl font-bold text-gray-800 dark:text-gray-200 capitalize"
              >
                {{ job.state }}
              </h3>
              <p class="text-gray-500 dark:text-gray-400">
                {{ getStateDescription() }}
              </p>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="flex items-center mb-2">
              <span class="text-gray-500 dark:text-gray-400 w-32">Created:</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{
                formatTimestamp(getCreatedTimestamp())
              }}</span>
            </div>
            <div class="flex items-center mb-2">
              <span class="text-gray-500 dark:text-gray-400 w-32">Updated:</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{
                formatTimestamp(getUpdatedTimestamp())
              }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500 dark:text-gray-400 w-32">Duration:</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{
                getDuration()
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Job Details Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div class="border-b">
          <nav class="flex -mb-px">
            <a
              href="#"
              :class="[
                activeTab === 'details'
                  ? 'text-primary-600 border-primary-500 border-b-2'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 border-b border-transparent',
                'whitespace-nowrap py-4 px-6 font-medium text-sm',
              ]"
              @click.prevent="activeTab = 'details'"
            >
              Details
            </a>
            <a
              href="#"
              :class="[
                activeTab === 'history'
                  ? 'text-primary-600 border-primary-500 border-b-2'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 border-b border-transparent',
                'whitespace-nowrap py-4 px-6 font-medium text-sm',
              ]"
              @click.prevent="activeTab = 'history'"
            >
              History
            </a>
            <a
              href="#"
              :class="[
                activeTab === 'resources'
                  ? 'text-primary-600 border-primary-500 border-b-2'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 border-b border-transparent',
                'whitespace-nowrap py-4 px-6 font-medium text-sm',
              ]"
              @click.prevent="activeTab = 'resources'"
            >
              Resources
            </a>
          </nav>
        </div>
        <div class="p-6">
          <div
            v-if="activeTab === 'details'"
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <h3
                class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200"
              >
                Job Properties
              </h3>
              <table class="min-w-full">
                <tbody>
                  <tr>
                    <td
                      class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      ID
                    </td>
                    <td class="py-2 text-sm text-gray-900 dark:text-gray-300">
                      {{ job.id }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Name
                    </td>
                    <td class="py-2 text-sm text-gray-900 dark:text-gray-300">
                      {{ job.name }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Topic
                    </td>
                    <td class="py-2 text-sm text-gray-900 dark:text-gray-300">
                      {{ job.topic }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Status
                    </td>
                    <td class="py-2 text-sm text-gray-900 dark:text-gray-300">
                      <span
                        :class="getStateClass(job.state)"
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize"
                      >{{ job.state }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Priority
                    </td>
                    <td class="py-2 text-sm text-gray-900 dark:text-gray-300">
                      {{ getPriorityLabel(job.priority) }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Visibility Timeout
                    </td>
                    <td class="py-2 text-sm text-gray-900 dark:text-gray-300">
                      {{ formatTimeout(job.visibilityTimeout) }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Start After
                    </td>
                    <td class="py-2 text-sm text-gray-900 dark:text-gray-300">
                      {{ formatStartAfter(job.startAfter) }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      User Agent
                    </td>
                    <td class="py-2 text-sm text-gray-900 dark:text-gray-300">
                      {{ job.userAgent }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Requester
                    </td>
                    <td class="py-2 text-sm text-gray-900 dark:text-gray-300">
                      {{ job.requester }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Session ID
                    </td>
                    <td
                      class="py-2 text-sm text-gray-900 dark:text-gray-300 truncate"
                      :title="job.sessionId"
                    >
                      {{ job.sessionId }}
                    </td>
                  </tr>
                  <tr v-if="job.callbackUrl">
                    <td
                      class="py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Callback URL
                    </td>
                    <td
                      class="py-2 text-sm text-gray-900 dark:text-gray-300 truncate"
                    >
                      <a
                        :href="job.callbackUrl"
                        target="_blank"
                        class="text-primary-600 hover:text-primary-800"
                      >{{ job.callbackUrl }}</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3
                class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200"
              >
                Job Properties
              </h3>
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <pre
                  class="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
                >{{ formatProperties(job.properties) }}</pre>
              </div>
            </div>
          </div>

          <div
            v-if="activeTab === 'resources'"
            class="overflow-x-auto"
          >
            <table
              class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            >
              <thead class="bg-gray-50 dark:bg-gray-600">
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
                    Status
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
              >
                <tr v-if="!job.lockResources || job.lockResources.length === 0">
                  <td
                    colspan="2"
                    class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No locked resources
                  </td>
                </tr>
                <tr
                  v-for="resource in job.lockResources"
                  :key="resource"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {{ resource }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                  >
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
                    >Locked</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-if="activeTab === 'history'"
            class="overflow-x-auto"
          >
            <table
              class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            >
              <thead class="bg-gray-50 dark:bg-gray-600">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Timestamp
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Event
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
              >
                <tr v-if="!job.history || job.history.length === 0">
                  <td
                    colspan="2"
                    class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No history available
                  </td>
                </tr>
                <tr
                  v-for="(event, index) in job.history"
                  :key="index"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                  >
                    {{ formatTimestamp(event.timestamp) }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                  >
                    <span class="capitalize">{{
                      event.eventType.toLowerCase()
                    }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
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
      @confirm="handleSuccessConfirm"
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
import { jobService } from "../services/index.js";
import { getStateClass } from "../utils/stateClass.js";
import ConfirmationModal from "./ConfirmationModal.vue";
import SuccessModal from "./SuccessModal.vue";
import FailureModal from "./FailureModal.vue";

export default {
  name: "JobDetail",
  components: { ConfirmationModal, SuccessModal, FailureModal },
  props: {
    jobId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      activeTab: "details",
      job: null,
      loading: true,
      error: null,
      showModal: false,
      modalTitle: "",
      modalMessage: "",
      modalAction: null,
      modalType: "confirm",
      successAction: null,
    };
  },
  computed: {
    actualJobId() {
      return this.jobId || this.$route.params.id;
    },
    canCancel() {
      return (
        this.job && ["pending", "enqueue", "running"].includes(this.job.status)
      );
    },
  },
  async mounted() {
    await this.loadJob();
  },
  methods: {
    getStateClass,
    async loadJob() {
      this.loading = true;
      this.error = null;
      try {
        const response = await jobService.getJobById(this.actualJobId);
        if (response.code !== 200) {
          throw new Error(response.message || "Failed to load job details");
        }
        this.job = response.job;
      } catch (error) {
        console.error("Error loading job:", error);
        this.error = error.message || "Failed to load job details";
      } finally {
        this.loading = false;
      }
    },
    goBack() {
      this.$router.push("/jobs");
    },
    getStatusIcon(status) {
      const statusIcons = {
        create: "plus-circle",
        delay: "clock",
        pending: "hourglass-half",
        enqueue: "list",
        running: "play",
        completed: "check-circle",
        failed: "times-circle",
        cancelled: "ban",
      };
      return ["fas", statusIcons[status] || "question-circle"];
    },
    getStatusIconClass(status) {
      const classes = {
        create: "bg-blue-100",
        delay: "bg-purple-100",
        pending: "bg-yellow-100",
        enqueue: "bg-indigo-100",
        running: "bg-green-100",
        completed: "bg-green-100",
        failed: "bg-red-100",
        cancelled: "bg-gray-100",
      };
      const iconClasses = {
        create: "text-blue-500",
        delay: "text-purple-500",
        pending: "text-yellow-500",
        enqueue: "text-indigo-500",
        running: "text-green-500",
        completed: "text-green-500",
        failed: "text-red-500",
        cancelled: "text-gray-500",
      };
      return `${classes[status] || "bg-gray-100"} ${
        iconClasses[status] || "text-gray-500"
      }`;
    },
    getStateDescription() {
      if (!this.job || !this.job.history || this.job.history.length === 0)
        return "N/A";
      const now = new Date();
      const lastEvent = this.job.history[this.job.history.length - 1];
      const updated = new Date(lastEvent.timestamp);
      const diffMs = now - updated;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60)
        return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;

      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24)
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    },
    getDuration() {
      if (!this.job || !this.job.history || this.job.history.length === 0)
        return "N/A";

      const firstEvent = this.job.history[0];
      const lastEvent = this.job.history[this.job.history.length - 1];

      const durationMs = lastEvent.timestamp - firstEvent.timestamp;
      const durationSec = Math.floor(durationMs / 1000);

      if (durationSec < 60) return `${durationSec} seconds`;

      const durationMin = Math.floor(durationSec / 60);
      if (durationMin < 60)
        return `${durationMin} minute${durationMin > 1 ? "s" : ""}`;

      const durationHours = Math.floor(durationMin / 60);
      const remainingMin = durationMin % 60;
      return `${durationHours} hour${
        durationHours > 1 ? "s" : ""
      } ${remainingMin} min`;
    },
    getPriorityLabel(priority) {
      const labels = { 0: "Low", 1: "Medium", 2: "High", 3: "Critical" };
      return labels[priority] || `Priority ${priority}`;
    },
    formatTimeout(timeout) {
      if (!timeout || timeout === 0) return "None";
      if (timeout < 60) return `${timeout} seconds`;
      const minutes = Math.floor(timeout / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    },
    formatStartAfter(startAfter) {
      if (!startAfter || startAfter === 0) return "Immediate";
      const date = new Date(startAfter);
      return date.toISOString().replace("T", " ").substring(0, 19);
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return "N/A";
      const date = new Date(timestamp);
      return date.toISOString().replace("T", " ").substring(0, 19);
    },
    getCreatedTimestamp() {
      if (!this.job || !this.job.history || this.job.history.length === 0)
        return null;
      return this.job.history[0].timestamp;
    },
    getUpdatedTimestamp() {
      if (!this.job || !this.job.history || this.job.history.length === 0)
        return null;
      return this.job.history[this.job.history.length - 1].timestamp;
    },
    formatProperties(properties) {
      return JSON.stringify(properties, null, 2);
    },
    openModal(title, message, action = null) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.modalAction = action;
      this.modalType = "confirm";
      this.showModal = true;
    },
    openModalSuccess(message, title = "Success", successAction = null) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.modalType = "success";
      this.successAction = successAction;
      this.showModal = true;
    },
    openModalFailure(message, title = "Error") {
      this.modalTitle = title;
      this.modalMessage = message;
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
    handleSuccessConfirm() {
      this.showModal = false;
      if (this.successAction) {
        this.successAction();
        this.successAction = null;
      }
    },
    async cloneJob() {
      console.log("Clone job", this.job.id);
      this.$router.push(`/job/create/clone/${this.job.id}`);
    },
    async cancelJob() {
      this.openModal(
        "Cancel Job",
        `Are you sure you want to cancel the job?`,
        this.cancelJobAction
      );
    },
    async cancelJobAction() {
      try {
        await jobService.cancelJob(this.job.id);
        await this.loadJob();
        this.openModalSuccess(
          `Job ${this.job.name} was cancelled successfully`
        );
      } catch (error) {
        console.error("Error cancelling job:", error);
        this.openModalFailure(error.message);
      }
    },
    async deleteJob() {
      this.openModal(
        "Delete Job",
        `Are you sure you want to delete job ${this.job.name}? This action cannot be undone.`,
        this.deleteJobAction
      );
    },
    async deleteJobAction() {
      try {
        await jobService.deleteJob(this.job.id);
        this.openModalSuccess(
          `Job ${this.job.name} was deleted successfully`,
          "Success",
          this.goBack
        );
      } catch (error) {
        console.error("Error deleting job:", error);
        this.openModalFailure(error.message);
      }
    },
  },
};
</script>
