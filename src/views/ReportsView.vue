<template>
  <div class="reports-container">
    <h1>Relatórios de Aluguel</h1>

    <div class="date-filters">
      <div class="form-group">
        <label for="startDate">Data Inicial:</label>
        <input type="date" id="startDate" v-model="startDate" @change="loadReport" />
      </div>
      <div class="form-group">
        <label for="endDate">Data Final:</label>
        <input type="date" id="endDate" v-model="endDate" @change="loadReport" />
      </div>
    </div>

    <div class="charts-container">
      <div class="chart-wrapper">
        <h2>Total de Aluguéis por Dia</h2>
        <Bar v-if="chartData" :data="rentalsChartData" :options="chartOptions" />
      </div>

      <div class="chart-wrapper">
        <h2>Receita por Dia</h2>
        <Line v-if="chartData" :data="revenueChartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script>
import { Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { reportService } from '@/services/reportService'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
)

export default {
  name: 'ReportsView',
  components: {
    Bar,
    Line,
  },
  data() {
    return {
      startDate: this.getLastMonthDate(),
      endDate: this.getTodayDate(),
      chartData: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    }
  },
  computed: {
    rentalsChartData() {
      if (!this.chartData) return null

      return {
        labels: this.chartData.map((item) => this.formatDate(item.date)),
        datasets: [
          {
            label: 'Total de Aluguéis',
            data: this.chartData.map((item) => item.totalRentals),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
          },
        ],
      }
    },
    revenueChartData() {
      if (!this.chartData) return null

      return {
        labels: this.chartData.map((item) => this.formatDate(item.date)),
        datasets: [
          {
            label: 'Receita Total (R$)',
            data: this.chartData.map((item) => item.totalRevenue),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      }
    },
  },
  methods: {
    async loadReport() {
      try {
        this.chartData = await reportService.getRentalReport(this.startDate, this.endDate)
      } catch (error) {
        console.error('Erro ao carregar relatório:', error)
      }
    },
    getLastMonthDate() {
      const date = new Date()
      date.setMonth(date.getMonth() - 1)
      return date.toISOString().split('T')[0]
    },
    getTodayDate() {
      return new Date().toISOString().split('T')[0]
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR')
    },
  },
  mounted() {
    this.loadReport()
  },
}
</script>

<style scoped>
.reports-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.date-filters {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.chart-wrapper {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 400px;
}

h1 {
  margin-bottom: 30px;
  color: #2c3e50;
}

h2 {
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.2em;
}

input[type='date'] {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

label {
  font-weight: 500;
  color: #666;
}
</style>
