<template>
  <main class="flex-1 p-4 md:p-6">
    <div
      class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
          {{ isCloning ? "Clone Job" : "Create New Job" }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          {{
            isCloning
              ? "Modify the job properties and create a copy"
              : "Fill out the form to create a new job"
          }}
        </p>
      </div>
      <div class="mt-4 md:mt-0 flex gap-2">
        <button
          class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          @click="randomizeForm"
        >
          <font-awesome-icon
            :icon="['fas', 'dice']"
            class="mr-2"
          /> Randomize
        </button>
        <button
          class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          @click="navigateBackToJobs"
        >
          <font-awesome-icon
            :icon="['fas', 'arrow-left']"
            class="mr-2"
          /> Back
          to Jobs
        </button>
      </div>
    </div>

    <!-- Job Creation Form -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <form @submit.prevent="submitJob">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Topic Selection with Editable Dropdown -->
          <div>
            <label
              for="topic"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Topic</label>
            <div class="relative">
              <input
                id="topic"
                v-model="job.topic"
                list="topic-options"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                placeholder="Select or enter a topic"
              >
              <datalist id="topic-options">
                <option
                  v-for="topic in topics"
                  :key="topic"
                  :value="topic"
                >
                  {{ topic }}
                </option>
              </datalist>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Select from existing topics or type a new one
            </p>
          </div>

          <!-- Priority -->
          <div>
            <label
              for="priority"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Priority</label>
            <select
              id="priority"
              v-model.number="job.priority"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            >
              <option
                v-for="(label, value) in priorityOptions"
                :key="value"
                :value="parseInt(value)"
              >
                {{ label }}
              </option>
            </select>
            <p class="text-xs text-gray-500 mt-1">
              Higher priority jobs are processed first
            </p>
          </div>

          <!-- Name -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Job Name</label>
            <input
              id="name"
              v-model="job.name"
              type="text"
              placeholder="Enter job name"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            >
            <p class="text-xs text-gray-500 mt-1">
              Descriptive name to identify this job (example: DataImportJob)
            </p>
          </div>

          <!-- User Agent -->
          <div>
            <label
              for="userAgent"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >User Agent</label>
            <input
              id="userAgent"
              v-model="job.userAgent"
              type="text"
              placeholder="Program name or identifier"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            >
            <p class="text-xs text-gray-500 mt-1">
              Name of the application or service creating this job (example:
              MinijobAdmin/1.0)
            </p>
          </div>

          <!-- Requester -->
          <div>
            <label
              for="requester"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Requester</label>
            <input
              id="requester"
              v-model="job.requester"
              type="text"
              placeholder="Job requester identifier"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            >
            <p class="text-xs text-gray-500 mt-1">
              Identifier of the user or system requesting this job
            </p>
          </div>

          <!-- Session ID -->
          <div>
            <label
              for="sessionId"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Session ID</label>
            <input
              id="sessionId"
              v-model="job.sessionId"
              type="text"
              placeholder="Session identifier"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            >
            <p class="text-xs text-gray-500 mt-1">
              Session ID to group related jobs together (example:
              6e70464d-85cf-431d-a9c9-a1f9c0ac82dc)
            </p>
          </div>

          <!-- Trace ID -->
          <div>
            <label
              for="traceId"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Trace ID</label>
            <input
              id="traceId"
              v-model="job.traceId"
              type="text"
              placeholder="Trace identifier"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            >
            <p class="text-xs text-gray-500 mt-1">
              Distributed tracing identifier for debugging (example:
              e7b46b16-c971-464e-8a47-c791be0ce2ed)
            </p>
          </div>

          <!-- Callback URL -->
          <div>
            <label
              for="callbackUrl"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Callback URL</label>
            <input
              id="callbackUrl"
              v-model="job.callbackUrl"
              type="url"
              placeholder="https://api.example.localhost/webhook"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            >
            <p class="text-xs text-gray-500 mt-1">
              Webhook URL to notify when job completes (success or failure)
            </p>
          </div>

          <!-- Job Properties -->
          <div class="md:col-span-2">
            <label
              for="properties"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Job Properties <span class="text-red-500">*</span></label>
            <textarea
              id="properties"
              v-model="job.properties"
              rows="6"
              placeholder="Enter job properties in JSON format..."
              required
              :class="[
                'w-full rounded-md shadow-sm focus:ring focus:ring-primary-500 focus:ring-opacity-50 font-mono text-sm',
                propertiesError
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-primary-500',
              ]"
            />
            <p
              v-if="propertiesError"
              class="text-xs text-red-500 mt-1"
            >
              {{ propertiesError }}
            </p>
            <p
              v-else
              class="text-xs text-gray-500 mt-1"
            >
              Job configuration and data in JSON format (required)
            </p>
          </div>

          <!-- Lock Resources -->
          <div class="md:col-span-2">
            <label
              for="lockResources"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Lock Resources</label>
            <textarea
              id="lockResources"
              v-model="job.lockResources"
              rows="4"
              placeholder="Enter resource names, one per line:&#10;database&#10;file-system&#10;email-service&#10;report-generator"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 font-mono text-sm"
            />
            <p class="text-xs text-gray-500 mt-1">
              Enter resource names to lock (one word per line). These resources
              will be unavailable to other jobs while this job runs.
            </p>
            <div class="mt-2 flex flex-wrap gap-2">
              <span class="text-xs text-gray-600 dark:text-gray-400">Examples:</span>
              <span
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >database</span>
              <span
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >file-system</span>
              <span
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >email-service</span>
            </div>
          </div>

          <!-- Schedule -->
          <div>
            <label
              for="schedule"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Schedule</label>
            <select
              id="schedule"
              v-model="job.schedule"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            >
              <option value="immediate">
                Run Immediately
              </option>
              <option value="delayed">
                Delay Start
              </option>
              <option value="scheduled">
                Schedule for Later
              </option>
            </select>
            <p class="text-xs text-gray-500 mt-1">
              Choose when to execute this job
            </p>
          </div>

          <!-- Delay (conditional) -->
          <div v-if="job.schedule === 'delayed'">
            <label
              for="delay"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Delay (seconds)</label>
            <input
              id="delay"
              v-model.number="job.delay"
              type="number"
              min="0"
              placeholder="0"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            >
            <p class="text-xs text-gray-500 mt-1">
              Number of seconds to wait before starting the job
            </p>
          </div>

          <!-- Schedule Time (conditional) -->
          <div v-if="job.schedule === 'scheduled'">
            <label
              for="startAfter"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Start After</label>
            <input
              id="startAfter"
              v-model="job.startAfterDateTime"
              type="datetime-local"
              required
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            >
            <p class="text-xs text-gray-500 mt-1">
              Specific date and time to start the job
            </p>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            type="button"
            class="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium py-2 px-4 rounded mr-2"
            @click="navigateBackToJobs"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded"
          >
            <font-awesome-icon
              :icon="['fas', 'save']"
              class="mr-2"
            /> Create
            Job
          </button>
        </div>
      </form>
    </div>

    <!-- Add Modal Components -->
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
import { jobService } from "../services/index.js";
import SuccessModal from "../components/SuccessModal.vue";
import FailureModal from "../components/FailureModal.vue";

export default {
  name: "CreateJob",
  components: { SuccessModal, FailureModal },
  props: {
    existingTopics: {
      type: Array,
      default: () => [
        "mock-data-processing",
        "mock-email-notifications",
        "mock-report-generation",
        "mock-file-uploads",
        "mock-user-onboarding",
        "mock-data-backup",
      ],
    },
    cloneJobId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      priorityOptions: {
        0: "Low",
        1: "Medium",
        2: "High",
        3: "Critical",
      },
      job: {
        topic: "",
        priority: 1,
        properties: "",
        lockResources: "",
        userAgent: "",
        requester: "",
        name: "",
        sessionId: "",
        traceId: "",
        startAfter: 0,
        delay: 0,
        callbackUrl: "",
        schedule: "immediate",
        startAfterDateTime: null,
      },
      topics: [...this.existingTopics],
      propertiesError: "",
      showModal: false,
      modalTitle: "",
      modalMessage: "",
      modalType: "success",
    };
  },
  computed: {
    isCloning() {
      return !!this.cloneJobId;
    },
  },
  async created() {
    // Check if topics were passed through query params
    if (this.$route.query.topics) {
      try {
        const topicsFromRoute = JSON.parse(this.$route.query.topics);
        if (Array.isArray(topicsFromRoute) && topicsFromRoute.length > 0) {
          // Override the default topics with the ones from the route
          this.topics = topicsFromRoute;
        }
      } catch (e) {
        console.error("Error parsing topics from route:", e);
      }
    }

    // Handle cloning if cloneJobId is provided
    if (this.cloneJobId) {
      await this.loadJobForCloning();
    }
  },
  methods: {
    async loadJobForCloning() {
      try {
        const response = await jobService.getJobById(this.cloneJobId);
        if (response.code !== 200) {
          throw new Error(response.message || "Failed to load job for cloning");
        }

        const sourceJob = response.job;

        // Populate form with source job data
        this.job.topic = sourceJob.topic || "";
        this.job.priority = sourceJob.priority || 1;
        this.job.properties = JSON.stringify(
          sourceJob.properties || {},
          null,
          2
        );
        this.job.lockResources = (sourceJob.lockResources || []).join("\n");
        this.job.userAgent = sourceJob.userAgent || "";
        this.job.requester = sourceJob.requester || "";
        this.job.name = `${sourceJob.name || "Untitled"} (Copy)`;
        this.job.sessionId = sourceJob.sessionId || "";
        this.job.traceId = sourceJob.traceId || "";
        this.job.callbackUrl = sourceJob.callbackUrl || "";

        // Handle scheduling - default to immediate for cloned jobs
        this.job.schedule = "immediate";
        this.job.delay = 0;
        this.job.startAfter = 0;
        this.job.startAfterDateTime = null;
      } catch (error) {
        console.error("Error loading job for cloning:", error);
        this.openModalFailure(
          "Failed to load job data for cloning: " + error.message
        );
      }
    },
    validateProperties() {
      this.propertiesError = "";

      if (!this.job.properties.trim()) {
        this.propertiesError = "Job properties are required";
        return false;
      }

      try {
        JSON.parse(this.job.properties);
        return true;
      } catch (error) {
        this.propertiesError = "Invalid JSON format: " + error.message;
        return false;
      }
    },

    async submitJob() {
      // Validate JSON before submitting
      if (!this.validateProperties()) {
        return;
      }

      // Convert datetime to timestamp if scheduled
      if (this.job.schedule === "scheduled" && this.job.startAfterDateTime) {
        this.job.startAfter = new Date(this.job.startAfterDateTime).getTime();
      }

      // Parse lockResources from line-separated format
      let lockResourcesArray = [];
      if (this.job.lockResources.trim()) {
        lockResourcesArray = this.job.lockResources
          .split("\n")
          .map((resource) => resource.trim())
          .filter((resource) => resource.length > 0);
      }

      // Parse JSON fields and prepare job data
      const jobData = {
        topic: this.job.topic,
        priority: this.job.priority,
        properties: JSON.parse(this.job.properties),
        lockResources: lockResourcesArray,
        userAgent: this.job.userAgent,
        requester: this.job.requester,
        name: this.job.name,
        sessionId: this.job.sessionId,
        traceId: this.job.traceId,
        startAfter: this.job.startAfter,
        delay: this.job.delay,
        callbackUrl: this.job.callbackUrl,
      };

      try {
        // Clear any previous errors
        this.propertiesError = "";

        // Submit the job to the server
        console.log("Submitting job:", jobData);
        const response = await jobService.createJob(jobData);

        console.log("Job created successfully:", response);

        // Show success modal
        this.openModalSuccess(
          `Job created successfully!\nJob ID: ${response.job?.id || "Unknown"}`,
          "Job Created"
        );
      } catch (error) {
        console.error("Error creating job:", error);

        // Show error modal
        this.openModalFailure(
          `Failed to create job: ${error.message}`,
          "Job Creation Failed"
        );
      }
    },

    openModalSuccess(message, title = "Success") {
      this.modalTitle = title;
      this.modalMessage = message;
      this.modalType = "success";
      this.showModal = true;
    },

    openModalFailure(message, title = "Error") {
      this.modalTitle = title;
      this.modalMessage = message;
      this.modalType = "failure";
      this.showModal = true;
    },

    cancelModal() {
      this.showModal = false;
      // Navigate back to jobs list after closing success modal
      if (this.modalType === "success") {
        this.$router.push("/jobs");
      }
    },

    navigateBackToJobs() {
      this.$router.push("/jobs");
    },
    randomizeForm() {
      // Clear any existing errors
      this.propertiesError = "";

      // Random values for form fields
      const randomNames = [
        "DataProcessingJob",
        "EmailNotificationTask",
        "ReportGenerationJob",
        "FileUploadProcessor",
        "UserOnboardingTask",
        "DataBackupJob",
        "ImageProcessingTask",
        "DatabaseCleanupJob",
      ];

      const randomUserAgents = [
        "MinijobAdmin/1.0",
        "TaskScheduler/2.1",
        "JobProcessor/1.5",
        "WorkflowEngine/3.0",
        "AutomationBot/2.0",
      ];

      const randomRequesters = [
        "admin-user",
        "automation-service",
        "scheduler-daemon",
        "workflow-engine",
        "batch-processor",
      ];

      const randomResources = [
        ["database", "file-system"],
        ["email-service", "notification-queue"],
        ["report-engine", "database"],
        ["file-storage", "processing-queue"],
        ["user-service", "email-service"],
        [],
      ];

      const randomProperties = [
        { action: "process", type: "data", batch_size: 100 },
        {
          recipient: "user@example.com",
          template: "welcome",
          priority: "high",
        },
        {
          report_type: "monthly",
          format: "pdf",
          recipients: ["admin@example.com"],
        },
        {
          file_path: "/uploads/documents",
          max_size: "10MB",
          allowed_types: ["pdf", "doc"],
        },
        { user_id: "12345", welcome_email: true, setup_profile: true },
        { backup_type: "incremental", retention_days: 30, compress: true },
      ];

      // Set random values
      this.job.topic =
        this.topics[Math.floor(Math.random() * this.topics.length)] ||
        "default";
      this.job.priority = Math.floor(Math.random() * 4); // 0-3
      this.job.name =
        randomNames[Math.floor(Math.random() * randomNames.length)];
      this.job.userAgent =
        randomUserAgents[Math.floor(Math.random() * randomUserAgents.length)];
      this.job.requester =
        randomRequesters[Math.floor(Math.random() * randomRequesters.length)];
      this.job.sessionId = Math.random() < 0.7 ? self.crypto.randomUUID() : "";
      this.job.traceId = Math.random() < 0.6 ? self.crypto.randomUUID() : "";
      this.job.callbackUrl =
        Math.random() < 0.5
          ? `https://api.example.localhost/webhook/${Math.floor(
              Math.random() * 1000
            )}`
          : "";

      // Set random properties (required field)
      const randomProp =
        randomProperties[Math.floor(Math.random() * randomProperties.length)];
      this.job.properties = JSON.stringify(randomProp, null, 2);

      // Set random lock resources
      const randomResourceSet =
        randomResources[Math.floor(Math.random() * randomResources.length)];
      this.job.lockResources = randomResourceSet.join("\n");

      // Random schedule
      const scheduleTypes = ["immediate", "delayed", "scheduled"];
      this.job.schedule =
        scheduleTypes[Math.floor(Math.random() * scheduleTypes.length)];

      if (this.job.schedule === "delayed") {
        this.job.delay = Math.floor(Math.random() * 300) + 10; // 10-310 seconds
      } else if (this.job.schedule === "scheduled") {
        // Set a random future date (within next 7 days)
        const now = new Date();
        const futureTime = new Date(
          now.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000
        );
        this.job.startAfterDateTime = futureTime.toISOString().slice(0, 16);
      }
    },
  },
};
</script>
