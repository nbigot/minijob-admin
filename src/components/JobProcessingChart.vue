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
import { Bar } from 'vue-chartjs'
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale 
} from 'chart.js'

ChartJS.register(
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale
)

export default {
  name: 'JobProcessingChart',
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: 'job-processing-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Array,
      default: () => []
    },
    jobData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Job Processing Rate',
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.formattedValue} jobs`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Jobs Processed'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          }
        }
      }
    }
  },
  watch: {
    jobData: {
      handler(newData) {
        this.updateChartData(newData);
      },
      deep: true
    }
  },
  mounted() {
    // Initialize with empty data if jobData is not provided
    this.updateChartData(this.jobData);
  },
  methods: {
    updateChartData(data) {
      if (!data) {
        // If data is undefined, set default empty data
        this.chartData = {
          labels: [],
          datasets: [
            {
              label: 'Succeeded',
              backgroundColor: 'rgba(75, 192, 192, 0.7)',
              data: []
            },
            {
              label: 'Failed',
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              data: []
            },
            {
              label: 'Pending',
              backgroundColor: 'rgba(255, 206, 86, 0.7)',
              data: []
            }
          ]
        };
        return;
      }
      
      // Use a safer approach to access data properties
      const labels = Array.isArray(data.labels) ? data.labels : [];
      const succeeded = Array.isArray(data.succeeded) ? data.succeeded : [];
      const failed = Array.isArray(data.failed) ? data.failed : [];
      const pending = Array.isArray(data.pending) ? data.pending : [];
      
      this.chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Succeeded',
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            data: succeeded
          },
          {
            label: 'Failed',
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
            data: failed
          },
          {
            label: 'Pending',
            backgroundColor: 'rgba(255, 206, 86, 0.7)',
            data: pending
          }
        ]
      }
    }
  }
}
</script>
