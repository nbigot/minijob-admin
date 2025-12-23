<template>
  <div class="w-full h-full">
    <Bar
      :options="chartOptions"
      :data="chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "JobProcessingChart",
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: "job-processing-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
    activityData: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Job Activity Metrics (Events/sec)",
            font: {
              size: 16,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) =>
                `${context.dataset.label}: ${context.formattedValue} events/sec`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grace: "5%",
            title: {
              display: true,
              text: "Events per Second",
            },
            ticks: {
              precision: 1,
            },
          },
          x: {
            title: {
              display: true,
              text: "Time",
            },
            ticks: {
              maxRotation: 45,
              minRotation: 0,
              autoSkip: true,
              maxTicksLimit: 12,
            },
          },
        },
      },
    };
  },
  watch: {
    activityData: {
      handler(newData) {
        this.updateChartData(newData);
      },
      deep: true,
    },
  },
  mounted() {
    this.updateChartData(this.activityData);
  },
  methods: {
    updateChartData(data) {
      if (!data || data.length === 0) {
        this.chartData = {
          labels: [],
          datasets: [
            {
              label: "Created",
              backgroundColor: "rgba(54, 162, 235, 0.7)",
              data: [],
            },
            {
              label: "Started",
              backgroundColor: "rgba(255, 206, 86, 0.7)",
              data: [],
            },
            {
              label: "Succeeded",
              backgroundColor: "rgba(75, 192, 192, 0.7)",
              data: [],
            },
            {
              label: "Failed",
              backgroundColor: "rgba(255, 99, 132, 0.7)",
              data: [],
            },
          ],
        };
        return;
      }

      // Extract data from the rolling window
      const labels = data.map((item) => item.time);
      const created = data.map((item) => item.created);
      const started = data.map((item) => item.started);
      const succeeded = data.map((item) => item.succeeded);
      const failed = data.map((item) => item.failed);

      this.chartData = {
        labels: labels,
        datasets: [
          {
            label: "Created",
            backgroundColor: "rgba(54, 162, 235, 0.7)",
            data: created,
          },
          {
            label: "Started",
            backgroundColor: "rgba(255, 206, 86, 0.7)",
            data: started,
          },
          {
            label: "Succeeded",
            backgroundColor: "rgba(75, 192, 192, 0.7)",
            data: succeeded,
          },
          {
            label: "Failed",
            backgroundColor: "rgba(255, 99, 132, 0.7)",
            data: failed,
          },
        ],
      };
    },
  },
};
</script>
