<template>
  <div>
    <div class="header">
      <h1>Relatório de Situação de Motos</h1>
    </div>

    <div class="filter-container">
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
          <el-button type="primary" @click="gerarRelatorio" :loading="loading">
            Gerar Relatório
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="relatorio.length > 0" class="report-container">
      <el-table :data="relatorio" style="width: 100%" border>
        <el-table-column prop="modelo" label="Modelo" />
        <el-table-column prop="marca" label="Marca" />
        <el-table-column prop="placa" label="Placa" />
        <el-table-column prop="status" label="Status" />
        <el-table-column prop="dataInicio" label="Data Início Aluguel" />
        <el-table-column prop="dataFim" label="Data Fim Aluguel" />
        <el-table-column prop="locatario" label="Locatário" />
      </el-table>
    </div>

    <div v-else-if="!loading" class="no-data">
      <el-empty description="Nenhum dado encontrado para o período selecionado" />
    </div>
  </div>
</template>

<script>
import api from '@/services/axios'

export default {
  data() {
    return {
      filterForm: {
        dateRange: [],
      },
      relatorio: [],
      loading: false,
    }
  },
  methods: {
    async gerarRelatorio() {
      if (!this.filterForm.dateRange || this.filterForm.dateRange.length !== 2) {
        this.$notify({
          title: 'Período inválido',
          message: 'Selecione um período válido para gerar o relatório',
          type: 'warning',
          customClass: 'dark-notify',
        })
        return
      }

      this.loading = true
      try {
        const [dataInicio, dataFim] = this.filterForm.dateRange
        const response = await api.get('/motos/relatorio', {
          params: {
            dataInicio,
            dataFim,
          },
        })
        this.relatorio = response.data
      } catch (error) {
        this.$notify({
          title: 'Erro ao gerar relatório',
          message: 'Houve um erro ao gerar o relatório. Tente novamente mais tarde.',
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
.header {
  margin-bottom: 20px;
}

h1 {
  margin: 0;
  color: var(--el-color-primary);
}

.filter-container {
  max-width: 600px;
  margin-bottom: 20px;
}

.report-container {
  margin-top: 20px;
}

.no-data {
  margin-top: 40px;
}
</style> 