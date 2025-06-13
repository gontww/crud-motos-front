<template>
  <div class="relatorio-container">
    <h1>Relatórios de Aluguel</h1>

    <div class="date-filters">
      <el-form :model="filterForm" label-position="top">
        <el-form-item label="Período">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="até"
            start-placeholder="Data inicial"
            end-placeholder="Data final"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadReport" :loading="loading">
            Gerar Relatório
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="relatorio.length > 0" class="report-container">
      <div class="chart-wrapper">
        <h2>Total de Aluguéis por Moto</h2>
        <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
      </div>

      <el-table :data="relatorio" style="width: 100%" border>
        <el-table-column prop="modelo" label="Modelo" />
        <el-table-column prop="marca" label="Marca" />
        <el-table-column prop="placa" label="Placa" />
        <el-table-column prop="totalAlugueis" label="Total de Aluguéis" />
      </el-table>
    </div>

    <div v-else-if="!loading" class="no-data">
      <el-empty description="Nenhum dado encontrado para o período selecionado" />
    </div>
  </div>
</template>

<script>
import api from '@/services/axios'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
  components: {
    Bar,
  },
  data() {
    return {
      filterForm: {
        dateRange: [],
      },
      relatorio: [],
      loading: false,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    }
  },
  computed: {
    chartData() {
      if (!this.relatorio.length) return null

      return {
        labels: this.relatorio.map((item) => `${item.marca} ${item.modelo}`),
        datasets: [
          {
            label: 'Total de Aluguéis',
            data: this.relatorio.map((item) => item.totalAlugueis),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
          },
        ],
      }
    },
  },
  methods: {
    async loadReport() {
      if (!this.filterForm.dateRange || this.filterForm.dateRange.length !== 2) {
        this.$notify({
          title: 'Erro',
          message: 'Selecione um período válido',
          type: 'error',
          customClass: 'dark-notify',
        })
        return
      }

      this.loading = true
      try {
        const [startDate, endDate] = this.filterForm.dateRange
        const { data } = await api.get('/relatorio/alugueis', {
          params: { startDate, endDate },
        })
        this.relatorio = data
      } catch (error) {
        this.$notify({
          title: 'Erro ao gerar relatório',
          message: 'Ocorreu um erro ao gerar o relatório. Tente novamente.',
          type: 'error',
          customClass: 'dark-notify',
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.relatorio-container {
  padding: 20px;
  max-width: 1200px;
}

.date-filters {
  max-width: 500px;
  margin-bottom: 30px;
}

.report-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
}

.chart-wrapper {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 400px;
  width: 100%;
  max-width: 800px;
}

h1 {
  margin: 0;
  color: var(--el-color-primary);
}

h2 {
  margin-bottom: 20px;
  color: var(--el-color-primary);
  font-size: 1.2em;
}

.no-data {
  margin-top: 40px;
}

:deep(.chartjs-render-monitor) {
  margin-top: 2px;
}
</style>
