<template>
  <div
    class="w-full flex flex-col xl:flex-row items-center justify-center gap-6"
  >
    <!-- Chart Section -->
    <div class="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0">
      <Doughnut :data="chartData" :options="chartOptions" />
      <!-- Center Text -->
      <div
        class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      >
        <span class="text-3xl font-bold text-gray-800 dark:text-gray-100">{{
          totalJobs
        }}</span>
        <span
          class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >Total</span
        >
      </div>
    </div>

    <!-- Custom Legend / Stats Section -->
    <div
      class="w-full xl:w-auto xl:flex-1 flex flex-col justify-center space-y-2 min-w-[180px]"
    >
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-3 h-3 rounded-full shadow-sm"
            :style="{ backgroundColor: stat.color }"
          ></div>
          <span class="font-medium text-gray-700 dark:text-gray-200 text-sm">{{
            stat.label
          }}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="font-bold text-gray-900 dark:text-white">{{
            stat.value
          }}</span>
          <span
            class="text-xs font-medium text-gray-500 dark:text-gray-400 w-10 text-right bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded"
            >{{ stat.percentage }}%</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  name: "JobStatusChart",
  components: { Doughnut },
  props: {
    jobStats: {
      type: Object,
      required: true,
      default: () => ({
        createdJobs: 0,
        queuedJobs: 0,
        runningJobs: 0,
        succeededJobs: 0,
        failedJobs: 0,
      }),
    },
  },
  data() {
    return {
      isDark: false,
    };
  },
  mounted() {
    this.checkTheme();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          this.checkTheme();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    this.observer = observer;
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    checkTheme() {
      this.isDark = document.documentElement.classList.contains("dark");
    },
  },
  computed: {
    totalJobs() {
      return (
        (this.jobStats.createdJobs || 0) +
        (this.jobStats.queuedJobs || 0) +
        (this.jobStats.runningJobs || 0) +
        (this.jobStats.succeededJobs || 0) +
        (this.jobStats.failedJobs || 0)
      );
    },
    stats() {
      const total = this.totalJobs;
      const data = [
        {
          label: "Created",
          value: this.jobStats.createdJobs || 0,
          color: "#3B82F6",
        },
        {
          label: "Queued",
          value: this.jobStats.queuedJobs || 0,
          color: "#EAB308",
        },
        {
          label: "Running",
          value: this.jobStats.runningJobs || 0,
          color: "#22C55E",
        },
        {
          label: "Succeeded",
          value: this.jobStats.succeededJobs || 0,
          color: "#6366F1",
        },
        {
          label: "Failed",
          value: this.jobStats.failedJobs || 0,
          color: "#EF4444",
        },
      ];

      return data.map((item) => ({
        ...item,
        percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
      }));
    },
    chartData() {
      return {
        labels: ["Created", "Queued", "Running", "Succeeded", "Failed"],
        datasets: [
          {
            backgroundColor: [
              "#3B82F6", // Blue-500
              "#EAB308", // Yellow-500
              "#22C55E", // Green-500
              "#6366F1", // Indigo-500
              "#EF4444", // Red-500
            ],
            data: [
              this.jobStats.createdJobs || 0,
              this.jobStats.queuedJobs || 0,
              this.jobStats.runningJobs || 0,
              this.jobStats.succeededJobs || 0,
              this.jobStats.failedJobs || 0,
            ],
            hoverOffset: 4,
            borderWidth: 0,
          },
        ],
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Hide default legend
          },
          tooltip: {
            enabled: false, // Disable tooltips for TV mode
          },
        },
        cutout: "75%",
      };
    },
  },
};
</script>
