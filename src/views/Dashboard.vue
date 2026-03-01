<template>
  <main class="flex-1 p-4 md:p-6">
    <div>
      <!-- Dashboard Header -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Dashboard Overview
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          Monitor server status and performance
        </p>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-4 mb-8"
      >
        <div
          v-for="i in 10"
          :key="i"
          class="bg-white dark:bg-gray-800 rounded-lg shadow animate-pulse p-4"
        >
          <div class="flex items-center">
            <div
              class="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"
            />
            <div class="ml-4 flex-1">
              <div
                class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"
              />
              <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <!-- Status Cards -->
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-4 mb-8"
        >
          <!-- Existing Jobs Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="navigateToJobs('all')"
          >
            <div class="flex items-center">
              <div
                class="rounded-full bg-slate-100 p-3 flex items-center justify-center w-10 h-10"
              >
                <font-awesome-icon
                  :icon="['fas', 'database']"
                  class="text-slate-500 text-sm"
                />
              </div>
              <div class="ml-4">
                <h4 class="text-gray-500 text-xs dark:text-gray-400">
                  Total
                </h4>
                <h3 class="text-xl font-bold dark:text-gray-200">
                  {{ dashboardData.jobStats.existingJobs }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Created Jobs Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="navigateToJobs('created')"
          >
            <div class="flex items-center">
              <div
                class="rounded-full bg-blue-100 p-3 flex items-center justify-center w-10 h-10"
              >
                <font-awesome-icon
                  :icon="['fas', 'plus']"
                  class="text-blue-500 text-sm"
                />
              </div>
              <div class="ml-4">
                <h4 class="text-gray-500 text-xs dark:text-gray-400">
                  Created
                </h4>
                <h3 class="text-xl font-bold dark:text-gray-200">
                  {{ dashboardData.jobStats.createdJobs }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Delayed Jobs Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="navigateToJobs('delayed')"
          >
            <div class="flex items-center">
              <div
                class="rounded-full bg-orange-100 p-3 flex items-center justify-center w-10 h-10"
              >
                <font-awesome-icon
                  :icon="['fas', 'hourglass-half']"
                  class="text-orange-500 text-sm"
                />
              </div>
              <div class="ml-4">
                <h4 class="text-gray-500 text-xs dark:text-gray-400">
                  Delayed
                </h4>
                <h3 class="text-xl font-bold dark:text-gray-200">
                  {{ dashboardData.jobStats.delayedJobs }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Pending Jobs Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="navigateToJobs('pending')"
          >
            <div class="flex items-center">
              <div
                class="rounded-full bg-amber-100 p-3 flex items-center justify-center w-10 h-10"
              >
                <font-awesome-icon
                  :icon="['fas', 'pause']"
                  class="text-amber-500 text-sm"
                />
              </div>
              <div class="ml-4">
                <h4 class="text-gray-500 text-xs dark:text-gray-400">
                  Pending
                </h4>
                <h3 class="text-xl font-bold dark:text-gray-200">
                  {{ dashboardData.jobStats.pendingJobs }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Queued Jobs Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="navigateToJobs('queued')"
          >
            <div class="flex items-center">
              <div
                class="rounded-full bg-yellow-100 p-3 flex items-center justify-center w-10 h-10"
              >
                <font-awesome-icon
                  :icon="['fas', 'clock']"
                  class="text-yellow-500 text-sm"
                />
              </div>
              <div class="ml-4">
                <h4 class="text-gray-500 text-xs dark:text-gray-400">
                  Queued
                </h4>
                <h3 class="text-xl font-bold dark:text-gray-200">
                  {{ dashboardData.jobStats.queuedJobs }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Running Jobs Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="navigateToJobs('running')"
          >
            <div class="flex items-center">
              <div
                class="rounded-full bg-green-100 p-3 flex items-center justify-center w-10 h-10"
              >
                <font-awesome-icon
                  :icon="['fas', 'play']"
                  class="text-green-500 text-sm"
                />
              </div>
              <div class="ml-4">
                <h4 class="text-gray-500 text-xs dark:text-gray-400">
                  Running
                </h4>
                <h3 class="text-xl font-bold dark:text-gray-200">
                  {{ dashboardData.jobStats.runningJobs }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Succeeded Jobs Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="navigateToJobs('succeeded')"
          >
            <div class="flex items-center">
              <div
                class="rounded-full bg-indigo-100 p-3 flex items-center justify-center w-10 h-10"
              >
                <font-awesome-icon
                  :icon="['fas', 'check']"
                  class="text-indigo-500 text-sm"
                />
              </div>
              <div class="ml-4">
                <h4 class="text-gray-500 text-xs dark:text-gray-400">
                  Succeeded
                </h4>
                <h3 class="text-xl font-bold dark:text-gray-200">
                  {{ dashboardData.jobStats.succeededJobs }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Failed Jobs Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="navigateToJobs('failed')"
          >
            <div class="flex items-center">
              <div
                class="rounded-full bg-red-100 p-3 flex items-center justify-center w-10 h-10"
              >
                <font-awesome-icon
                  :icon="['fas', 'times']"
                  class="text-red-500 text-sm"
                />
              </div>
              <div class="ml-4">
                <h4 class="text-gray-500 text-xs dark:text-gray-400">
                  Failed
                </h4>
                <h3 class="text-xl font-bold dark:text-gray-200">
                  {{ dashboardData.jobStats.failedJobs }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Hidden Jobs Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="navigateToJobs('hidden')"
          >
            <div class="flex items-center">
              <div
                class="rounded-full bg-gray-100 p-3 flex items-center justify-center w-10 h-10"
              >
                <font-awesome-icon
                  :icon="['fas', 'eye-slash']"
                  class="text-gray-500 text-sm"
                />
              </div>
              <div class="ml-4">
                <h4 class="text-gray-500 text-xs dark:text-gray-400">
                  Hidden
                </h4>
                <h3 class="text-xl font-bold dark:text-gray-200">
                  {{ dashboardData.jobStats.hiddenJobs }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Canceled Jobs Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="navigateToJobs('canceled')"
          >
            <div class="flex items-center">
              <div
                class="rounded-full bg-rose-100 p-3 flex items-center justify-center w-10 h-10"
              >
                <font-awesome-icon
                  :icon="['fas', 'ban']"
                  class="text-rose-500 text-sm"
                />
              </div>
              <div class="ml-4">
                <h4 class="text-gray-500 text-xs dark:text-gray-400">
                  Canceled
                </h4>
                <h3 class="text-xl font-bold dark:text-gray-200">
                  {{ dashboardData.jobStats.canceledJobs }}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Job Activity Metrics -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Job Activity Metrics
            </h3>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <label
                  for="pollingInterval"
                  class="text-sm text-gray-600 dark:text-gray-400"
                >
                  Update Frequency:
                </label>
                <select
                  id="pollingInterval"
                  v-model="selectedPollingInterval"
                  class="px-3 py-1 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @change="handlePollingIntervalChange"
                >
                  <option :value="null">
                    None
                  </option>
                  <option :value="1000">
                    1 Second
                  </option>
                  <option :value="5000">
                    5 Seconds
                  </option>
                  <option :value="10000">
                    10 Seconds
                  </option>
                  <option :value="30000">
                    30 Seconds
                  </option>
                  <option :value="60000">
                    1 Minute
                  </option>
                  <option :value="600000">
                    10 Minutes
                  </option>
                </select>
              </div>
              <div class="flex items-center gap-2">
                <label
                  for="timeWindow"
                  class="text-sm text-gray-600 dark:text-gray-400"
                >
                  Time Window:
                </label>
                <select
                  id="timeWindow"
                  v-model="selectedTimeWindow"
                  class="px-3 py-1 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @change="handleTimeWindowChange"
                >
                  <option value="60">
                    1 Minute
                  </option>
                  <option value="300">
                    5 Minutes
                  </option>
                  <option value="900">
                    15 Minutes
                  </option>
                  <option value="3600">
                    1 Hour
                  </option>
                  <option value="21600">
                    6 Hours
                  </option>
                  <option value="86400">
                    24 Hours
                  </option>
                  <option value="604800">
                    1 Week
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div
            class="h-64 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 p-4"
          >
            <JobProcessingChart :activity-data="jobActivityChartData" />
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Job Distribution Chart -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4 dark:text-gray-200">
              Job Status Distribution
            </h3>
            <div class="flex items-center justify-center">
              <JobStatusChart :job-activity="dashboardData.jobStats" />
            </div>
          </div>

          <!-- Topics Distribution -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4 dark:text-gray-200">
              Jobs by Topic
            </h3>
            <div class="space-y-4">
              <div
                v-for="(count, topic, index) in dashboardData.jobsByTopic"
                :key="index"
              >
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium dark:text-gray-300">{{
                    topic
                  }}</span>
                  <span class="text-sm font-medium dark:text-gray-300">{{ count }} ({{ calculateTopicPercentage(count) }}%)</span>
                </div>
                <div
                  class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"
                >
                  <div
                    :class="getTopicColorClass(index)"
                    class="h-2.5 rounded-full"
                    :style="{ width: calculateTopicPercentage(count) + '%' }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Newly Active Jobs and Resources -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Newly Active Jobs -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
          >
            <div class="p-4 border-b flex justify-between items-center">
              <h3 class="text-lg font-semibold dark:text-gray-200">
                Newly Active Jobs
              </h3>
              <router-link
                to="/jobs"
                class="text-primary-600 hover:text-primary-800 text-sm dark:text-blue-400"
              >
                View All
              </router-link>
            </div>
            <div class="overflow-x-auto">
              <table
                class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
              >
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                    >
                      Topic
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                    >
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody
                  class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                >
                  <tr
                    v-for="job in dashboardData.newlyActiveJobs"
                    :key="job.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200"
                    >
                      {{ job.id }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                    >
                      {{ job.topic || job.type }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getStateClass(job.state)"
                      >
                        {{ job.state }}
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                    >
                      {{ formatDateRelative(job.created) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Locked Resources -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
          >
            <div class="p-4 border-b flex justify-between items-center">
              <h3 class="text-lg font-semibold dark:text-gray-200">
                Locked Resources
              </h3>
              <router-link
                to="/resources"
                class="text-primary-600 hover:text-primary-800 text-sm dark:text-blue-400"
              >
                View All
              </router-link>
            </div>
            <div class="overflow-x-auto">
              <table
                class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
              >
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                    >
                      Resource
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                    >
                      Job ID
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                    >
                      Locked Since
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                >
                  <tr
                    v-for="(resource, index) in dashboardData.resources"
                    :key="index"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200"
                    >
                      {{ resource.resourceName }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                    >
                      {{ resource.jobUuid }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                    >
                      {{ formatDuration(resource.lockDuration) }}
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
                  <tr
                    v-if="
                      !dashboardData.resources ||
                        dashboardData.resources.length === 0
                    "
                  >
                    <td
                      colspan="4"
                      class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No locked resources
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Top Stalled Jobs -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h3
            class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200"
          >
            Top Stalled Jobs
          </h3>
          <div class="overflow-x-auto">
            <table
              class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            >
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                  >
                    Topic
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                  >
                    Duration
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
              >
                <tr
                  v-for="job in sortedStalledJobs"
                  :key="job.id"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200"
                  >
                    {{ job.id }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                  >
                    {{ job.topic }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getStateClass(job.state)"
                    >{{ job.state }}</span>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                  >
                    {{ formatTimestamp(job.created) }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                  >
                    {{ formatDurationMs(job.duration) }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                  >
                    <div class="flex space-x-2">
                      <button
                        class="text-primary-600 hover:text-primary-900"
                        title="View Details"
                        @click="viewJobDetails(job.id)"
                      >
                        <font-awesome-icon :icon="['fas', 'eye']" />
                      </button>
                      <button
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
    </div>
  </main>
</template>

<script>
import {
  dashboardService,
  jobService,
  resourceService,
} from "../services/index.js";
import { getStateClass } from "../utils/stateClass.js";
import ConfirmationModal from "../components/ConfirmationModal.vue";
import SuccessModal from "../components/SuccessModal.vue";
import FailureModal from "../components/FailureModal.vue";
import JobProcessingChart from "../components/JobProcessingChart.vue";
import JobStatusChart from "../components/JobStatusChart.vue";

export default {
  name: "DashboardOverview",
  components: {
    ConfirmationModal,
    SuccessModal,
    FailureModal,
    JobProcessingChart,
    JobStatusChart,
  },
  data() {
    return {
      loading: false,
      dashboardData: {
        jobStats: {
          existingJobs: 0,
          createdJobs: 0,
          delayedJobs: 0,
          pendingJobs: 0,
          queuedJobs: 0,
          runningJobs: 0,
          succeededJobs: 0,
          failedJobs: 0,
          hiddenJobs: 0,
          canceledJobs: 0,
          deletedJobs: 0,
        },
        jobActivity: {},
        newlyActiveJobs: [],
        resources: [],
        jobsByTopic: {},
      },
      stalledJobs: [],
      jobProcessingData: {
        labels: [],
        succeeded: [],
        failed: [],
        pending: [],
      },
      // Job Activity Metrics
      selectedTimeWindow: 300, // Default: 5 minutes (in seconds)
      selectedPollingInterval: null, // Default: None (no auto-update)
      activityPollingInterval: null,
      previousActivityData: null,
      jobActivityChartData: [],
      activityDataBuffer: [], // Raw data buffer before aggregation
      screenWidth: window.innerWidth,
      maxDataPoints: 60, // Maximum data points to show in rolling window
      simulationInterval: null,
      showModal: false,
      modalTitle: "",
      modalMessage: "",
      modalAction: null,
      modalType: "confirm",
    };
  },
  computed: {
    totalJobs() {
      return this.dashboardData.jobStats.existingJobs || 0;
    },
    totalTopicJobs() {
      return Object.values(this.dashboardData.jobsByTopic).reduce(
        (sum, count) => sum + count,
        0,
      );
    },
    sortedStalledJobs() {
      return [...this.stalledJobs]
        .sort((a, b) => {
          // Duration is already in milliseconds, sort descending
          return (b.duration || 0) - (a.duration || 0);
        })
        .slice(0, 5);
    },
    numberOfBuckets() {
      // Determine number of bars based on time window and screen size
      let baseBuckets;

      // Base number of buckets for time windows
      if (this.selectedTimeWindow <= 60) {
        baseBuckets = 6; // 1 minute: 6 bars (10s each)
      } else if (this.selectedTimeWindow <= 300) {
        baseBuckets = 10; // 5 minutes: 10 bars (30s each)
      } else if (this.selectedTimeWindow <= 900) {
        baseBuckets = 15; // 15 minutes: 15 bars (1min each)
      } else if (this.selectedTimeWindow <= 3600) {
        baseBuckets = 12; // 1 hour: 12 bars (5min each)
      } else if (this.selectedTimeWindow <= 21600) {
        baseBuckets = 12; // 6 hours: 12 bars (30min each)
      } else if (this.selectedTimeWindow <= 86400) {
        baseBuckets = 24; // 24 hours: 24 bars (1hour each)
      } else {
        baseBuckets = 14; // 1 week: 14 bars (12 hours each)
      }

      // Adjust for screen size (responsive)
      if (this.screenWidth < 640) {
        // Mobile: reduce by 40%
        return Math.max(4, Math.floor(baseBuckets * 0.6));
      } else if (this.screenWidth < 1024) {
        // Tablet: reduce by 20%
        return Math.max(6, Math.floor(baseBuckets * 0.8));
      } else {
        // Desktop: use full number
        return baseBuckets;
      }
    },
    bucketDuration() {
      // Calculate duration of each bucket in seconds
      return this.selectedTimeWindow / this.numberOfBuckets;
    },
  },
  async mounted() {
    this.startJobProcessingSimulation();
    this.startActivityPolling();
    await this.fetchDashboardData();
    await this.loadStalledJobs();
    await this.loadJobProcessingData();

    // Add window resize listener for responsive bucket count
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    this.stopJobProcessingSimulation();
    this.stopActivityPolling();
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    getStateClass,

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

    calculatePercentage(count) {
      return this.totalJobs > 0
        ? Math.round((count / this.totalJobs) * 100)
        : 0;
    },

    calculateTopicPercentage(count) {
      return this.totalTopicJobs > 0
        ? Math.round((count / this.totalTopicJobs) * 100)
        : 0;
    },

    getTopicColorClass(index) {
      const colors = [
        "bg-purple-500 dark:bg-purple-700",
        "bg-pink-500 dark:bg-pink-700",
        "bg-cyan-500 dark:bg-cyan-700",
        "bg-orange-500 dark:bg-orange-700",
        "bg-lime-500 dark:bg-lime-700",
        "bg-teal-500 dark:bg-teal-700",
        "bg-emerald-500 dark:bg-emerald-700",
        "bg-yellow-500 dark:bg-yellow-700",
        "bg-red-500 dark:bg-red-700",
        "bg-blue-500 dark:bg-blue-700",
        "bg-indigo-500 dark:bg-indigo-700",
        "bg-rose-500 dark:bg-rose-700",
        "bg-slate-500 dark:bg-slate-700",
        "bg-zinc-500 dark:bg-zinc-700",
      ];
      return colors[index % colors.length];
    },

    async fetchDashboardData() {
      this.loading = true;

      try {
        const response = await dashboardService.getDashboardData();
        this.dashboardData = response;
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (
          error &&
          (error.message?.includes("ERR_CONNECTION_REFUSED") ||
            error.toString().includes("ERR_CONNECTION_REFUSED") ||
            error.message?.includes("Network Error") ||
            error.toString().includes("Network Error"))
        ) {
          this.openModalFailure(
            "Cannot connect to the server. Please check your network or server status.",
          );
        } else {
          this.openModalFailure("Failed to load dashboard data");
        }
      } finally {
        this.loading = false;
      }
    },

    formatDateRelative(dateString) {
      if (!dateString) return "N/A";

      const date = new Date(dateString);
      const now = new Date();
      const diffSeconds = Math.floor((now - date) / 1000);

      if (diffSeconds < 60) {
        return "Just now";
      } else if (diffSeconds < 3600) {
        return `${Math.floor(diffSeconds / 60)}m ago`;
      } else if (diffSeconds < 86400) {
        return `${Math.floor(diffSeconds / 3600)}h ago`;
      } else {
        return `${Math.floor(diffSeconds / 86400)}d ago`;
      }
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

    formatTimestamp(timestamp) {
      if (!timestamp) return "N/A";
      const date = new Date(timestamp);
      return date.toISOString().replace("T", " ").substring(0, 19);
    },

    formatDurationMs(durationMs) {
      if (!durationMs || durationMs === 0) {
        return "-";
      }

      const seconds = Math.floor(durationMs / 1000);
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

    async unlockResource(resourceName) {
      this.openModal(
        "Unlock Resource",
        `Are you sure you want to unlock ${resourceName}? This may affect running jobs.`,
        async () => {
          try {
            await resourceService.unlockResource(resourceName);
            this.openModalSuccess(
              `Resource ${resourceName} unlocked successfully`,
            );
            await this.fetchDashboardData();
          } catch (error) {
            console.error("Error unlocking resource:", error);
            this.openModalFailure(`Failed to unlock resource ${resourceName}.`);
          }
        },
      );
    },

    handleRefreshData() {
      //console.log("Refreshing dashboard data");
      this.fetchDashboardData && this.fetchDashboardData();
      this.loadStalledJobs && this.loadStalledJobs();
      this.loadJobProcessingData && this.loadJobProcessingData();
    },

    // Job Activity Metrics simulation methods
    startJobProcessingSimulation() {
      this.simulationInterval = setInterval(() => {
        if (this.jobProcessingData.labels.length === 0) return;

        const lastLabel =
          this.jobProcessingData.labels[
            this.jobProcessingData.labels.length - 1
          ];
        const newLabel = this.getNextHourLabel(lastLabel);

        const newLabels = [...this.jobProcessingData.labels.slice(1), newLabel];
        const newSucceeded = [
          ...this.jobProcessingData.succeeded.slice(1),
          this.getRandomInt(15, 35),
        ];
        const newFailed = [
          ...this.jobProcessingData.failed.slice(1),
          this.getRandomInt(0, 5),
        ];
        const newPending = [
          ...this.jobProcessingData.pending.slice(1),
          this.getRandomInt(3, 10),
        ];

        this.jobProcessingData = {
          labels: newLabels,
          succeeded: newSucceeded,
          failed: newFailed,
          pending: newPending,
        };
      }, 5000);
    },

    stopJobProcessingSimulation() {
      if (this.simulationInterval) {
        clearInterval(this.simulationInterval);
      }
    },

    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getNextHourLabel(lastLabel) {
      const [hour, minute] = lastLabel.split(":").map(Number);
      const nextHour = (hour + 1) % 24;
      return `${nextHour}:${minute < 10 ? "0" + minute : minute}`;
    },

    async loadStalledJobs() {
      try {
        const stalledJobs = await jobService.getStalledJobs();
        this.stalledJobs = stalledJobs;
      } catch (error) {
        console.error("Error loading stalled jobs:", error);
      }
    },

    async loadJobProcessingData() {
      try {
        // Note: Backend /api/v1/metrics/jobs/processing returns jobStats, not chart data
        // Initialize with current time for simulation
        const now = new Date();
        const labels = [];
        for (let i = 7; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 3600000);
          labels.push(`${time.getHours()}:00`);
        }

        this.jobProcessingData = {
          labels: labels,
          succeeded: labels.map(() => this.getRandomInt(15, 35)),
          failed: labels.map(() => this.getRandomInt(0, 5)),
          pending: labels.map(() => this.getRandomInt(3, 10)),
        };
      } catch (error) {
        console.error("Error loading Job Activity Metrics data:", error);
      }
    },

    async cancelJob(jobId) {
      this.openModal(
        "Cancel Job",
        `Are you sure you want to cancel job ${jobId}?`,
        async () => {
          try {
            await jobService.cancelJob(jobId);

            const job = this.stalledJobs.find((j) => j.id === jobId);
            if (job) {
              job.status = "Cancelled";
            }

            this.openModalSuccess(`Job ${jobId} was cancelled successfully`);
          } catch (error) {
            console.error("Error cancelling job:", error);
            this.openModalFailure(error.message || "Failed to cancel job");
          }
        },
      );
    },

    async deleteJob(jobId) {
      this.openModal(
        "Delete Job",
        `Are you sure you want to delete job ${jobId}? This action cannot be undone.`,
        async () => {
          try {
            await jobService.deleteJob(jobId);

            this.stalledJobs = this.stalledJobs.filter(
              (job) => job.id !== jobId,
            );

            this.openModalSuccess(`Job ${jobId} was deleted successfully`);
          } catch (error) {
            console.error("Error deleting job:", error);
            this.openModalFailure(error.message || "Failed to delete job");
          }
        },
      );
    },

    viewJobDetails(jobId) {
      console.log(`Viewing details for job: ${jobId}`);
      this.$router.push(`/job/${jobId}`);
    },

    navigateToJobs(status) {
      this.$router.push({ path: "/jobs", query: { status: status } });
    },

    // Job Activity Metrics methods
    startActivityPolling() {
      // Don't start polling if interval is None (null)
      if (!this.selectedPollingInterval) {
        return;
      }

      // Poll immediately
      this.pollJobActivity();
      // Then poll at the selected interval
      this.activityPollingInterval = setInterval(() => {
        this.pollJobActivity();
      }, this.selectedPollingInterval);
    },

    stopActivityPolling() {
      if (this.activityPollingInterval) {
        clearInterval(this.activityPollingInterval);
        this.activityPollingInterval = null;
      }
    },

    async pollJobActivity() {
      try {
        const currentData = await dashboardService.getJobActivityMetrics();

        if (!this.previousActivityData) {
          // First poll - initialize with zeros
          this.previousActivityData = currentData;
          this.addActivityDataPoint({
            created: 0,
            started: 0,
            succeeded: 0,
            failed: 0,
          });
          return;
        }

        // Calculate deltas (rate per second)
        const pollingIntervalSeconds = this.selectedPollingInterval / 1000;
        const deltaCreated =
          Math.max(
            0,
            (currentData.created || 0) -
              (this.previousActivityData.created || 0),
          ) / pollingIntervalSeconds;
        const deltaStarted =
          Math.max(
            0,
            (currentData.started || 0) -
              (this.previousActivityData.started || 0),
          ) / pollingIntervalSeconds;
        const deltaSucceeded =
          Math.max(
            0,
            (currentData.succeeded || 0) -
              (this.previousActivityData.succeeded || 0),
          ) / pollingIntervalSeconds;
        const deltaFailed =
          Math.max(
            0,
            (currentData.failed || 0) - (this.previousActivityData.failed || 0),
          ) / pollingIntervalSeconds;

        this.addActivityDataPoint({
          created: parseFloat(deltaCreated.toFixed(2)),
          started: parseFloat(deltaStarted.toFixed(2)),
          succeeded: parseFloat(deltaSucceeded.toFixed(2)),
          failed: parseFloat(deltaFailed.toFixed(2)),
        });

        this.previousActivityData = currentData;
      } catch (error) {
        console.error("Failed to poll job activity:", error);
      }
    },

    addActivityDataPoint(dataPoint) {
      const now = new Date();

      // Add to raw data buffer with timestamp
      this.activityDataBuffer.push({
        timestamp: now.getTime(),
        created: dataPoint.created,
        started: dataPoint.started,
        succeeded: dataPoint.succeeded,
        failed: dataPoint.failed,
      });

      // Remove old data points beyond the time window
      const cutoffTime = now.getTime() - this.selectedTimeWindow * 1000;
      this.activityDataBuffer = this.activityDataBuffer.filter(
        (item) => item.timestamp >= cutoffTime,
      );

      // Aggregate data into fixed buckets
      this.aggregateIntoBuckets();
    },

    aggregateIntoBuckets() {
      const now = new Date();
      const buckets = [];
      const bucketDurationMs = this.bucketDuration * 1000;

      // Create empty buckets
      for (let i = 0; i < this.numberOfBuckets; i++) {
        const bucketEndTime = now.getTime() - i * bucketDurationMs;
        const bucketStartTime = bucketEndTime - bucketDurationMs;

        buckets.push({
          startTime: bucketStartTime,
          endTime: bucketEndTime,
          created: 0,
          started: 0,
          succeeded: 0,
          failed: 0,
          count: 0,
        });
      }

      // Aggregate data points into buckets
      this.activityDataBuffer.forEach((dataPoint) => {
        for (let bucket of buckets) {
          if (
            dataPoint.timestamp > bucket.startTime &&
            dataPoint.timestamp <= bucket.endTime
          ) {
            bucket.created += dataPoint.created;
            bucket.started += dataPoint.started;
            bucket.succeeded += dataPoint.succeeded;
            bucket.failed += dataPoint.failed;
            bucket.count++;
            break;
          }
        }
      });

      // Reverse to show oldest to newest (left to right)
      buckets.reverse();

      // Calculate averages and format labels
      this.jobActivityChartData = buckets.map((bucket) => {
        const bucketDate = new Date(bucket.endTime);
        let timeLabel;

        // Format time label based on bucket duration
        if (this.bucketDuration < 60) {
          // Less than 1 minute: show seconds
          timeLabel = bucketDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });
        } else if (this.bucketDuration < 3600) {
          // Less than 1 hour: show time
          timeLabel = bucketDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        } else if (this.bucketDuration < 86400) {
          // Less than 1 day: show time
          timeLabel = bucketDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        } else {
          // 1 day or more: show date and time
          timeLabel = bucketDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
          });
        }

        // Calculate average rates per second for the bucket
        const divisor = bucket.count > 0 ? bucket.count : 1;
        return {
          time: timeLabel,
          created: parseFloat((bucket.created / divisor).toFixed(2)),
          started: parseFloat((bucket.started / divisor).toFixed(2)),
          succeeded: parseFloat((bucket.succeeded / divisor).toFixed(2)),
          failed: parseFloat((bucket.failed / divisor).toFixed(2)),
        };
      });
    },

    handleTimeWindowChange() {
      // Clear existing data when time window changes
      this.jobActivityChartData = [];
      this.activityDataBuffer = [];
      this.previousActivityData = null;

      // Restart polling to get fresh data
      this.stopActivityPolling();
      this.startActivityPolling();
    },

    handlePollingIntervalChange() {
      // Stop any existing polling
      this.stopActivityPolling();

      // If None is selected, just stop polling and keep existing data
      if (!this.selectedPollingInterval) {
        return;
      }

      // Clear existing data when polling interval changes
      this.jobActivityChartData = [];
      this.activityDataBuffer = [];
      this.previousActivityData = null;

      // Restart polling with new interval
      this.startActivityPolling();
    },

    handleResize() {
      // Update screen width for responsive bucket calculation
      this.screenWidth = window.innerWidth;
      // Re-aggregate data with new bucket count
      if (this.activityDataBuffer.length > 0) {
        this.aggregateIntoBuckets();
      }
    },
  },
};
</script>
