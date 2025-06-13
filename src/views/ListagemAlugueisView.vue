<template>
  <div>
    <div class="header">
      <h1>Listagem de Aluguéis</h1>
      <el-button type="primary" @click="handleAddAluguel">
        <el-icon><Plus /></el-icon>
        Novo Aluguel
      </el-button>
    </div>

    <div class="table-container">
      <el-table :data="alugueis" style="width: 80%; justify-content: center" empty-text="Sem Dados">
        <el-table-column prop="moto.modelo" label="Modelo" />
        <el-table-column prop="moto.marca" label="Marca" />
        <el-table-column prop="moto.placa" label="Placa" />
        <el-table-column prop="locatario.nome" label="Locatário" />
        <el-table-column prop="dataInicio" label="Data Início" />
        <el-table-column prop="dataFim" label="Data Fim" />
        <el-table-column label="Ações" width="120">
          <template #default="scope">
            <el-dropdown trigger="click">
              <el-button type="primary" size="small">
                Ações
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="abrirDialogEditar(scope.row)">
                    <el-icon><Edit /></el-icon>
                    Editar
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.dataFim >= new Date().toISOString().split('T')[0]"
                    @click="finalizarAluguel(scope.row)"
                  >
                    <el-icon><Check /></el-icon>
                    Finalizar
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleDelete(scope.row)">
                    <el-icon><Delete /></el-icon>
                    Excluir
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Modal de cadastro -->
    <el-dialog v-model="showDialog" title="Novo Aluguel" width="40%" @close="resetNewAluguelForm">
      <el-form ref="formAluguel" label-position="top" :rules="rules" :model="newAluguel">
        <el-form-item label="Locatário" prop="locatarioId">
          <el-select
            v-model="newAluguel.locatarioId"
            placeholder="Selecione um locatário"
            style="width: 100%"
          >
            <el-option
              v-for="locatario in locatarios"
              :key="locatario.id"
              :label="locatario.nome"
              :value="locatario.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Moto" prop="motoId">
          <el-select
            v-model="newAluguel.motoId"
            placeholder="Selecione uma moto"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="moto in motosDisponiveis"
              :key="moto.id"
              :label="`${moto.marca} ${moto.modelo} (${moto.ano})`"
              :value="moto.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Data de Início" prop="dataInicio">
          <el-date-picker
            v-model="newAluguel.dataInicio"
            type="date"
            placeholder="Escolha uma data"
            style="width: 100%"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            :disabled-date="disablePastDates"
          />
        </el-form-item>

        <el-form-item label="Data de Fim" prop="dataFim">
          <el-date-picker
            v-model="newAluguel.dataFim"
            type="date"
            placeholder="Escolha uma data"
            style="width: 100%"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            :disabled-date="disablePastDates"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">Cancelar</el-button>
        <el-button type="primary" @click="criarNovoAluguel">Salvar</el-button>
      </template>
    </el-dialog>

    <!-- Modal de edição -->
    <el-dialog
      v-model="showEditDialog"
      title="Editar Aluguel"
      width="40%"
      @close="resetEditAluguelForm"
    >
      <el-form ref="formEdicao" label-position="top" :rules="rules" :model="editAluguel">
        <el-form-item label="Locatário" prop="locatarioId">
          <el-select
            v-model="editAluguel.locatarioId"
            placeholder="Selecione um locatário"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="locatario in locatarios"
              :key="locatario.id"
              :label="locatario.nome"
              :value="locatario.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Moto" prop="motoId">
          <el-select
            v-model="editAluguel.motoId"
            placeholder="Selecione uma moto"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="moto in motosDisponiveis"
              :key="moto.id"
              :label="`${moto.marca} ${moto.modelo} (${moto.ano})`"
              :value="moto.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Data de Início" prop="dataInicio">
          <el-date-picker
            v-model="editAluguel.dataInicio"
            type="date"
            placeholder="Escolha uma data"
            style="width: 100%"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            :disabled-date="disablePastDates"
          />
        </el-form-item>

        <el-form-item label="Data de Fim" prop="dataFim">
          <el-date-picker
            v-model="editAluguel.dataFim"
            type="date"
            placeholder="Escolha uma data"
            style="width: 100%"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            :disabled-date="disablePastDates"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">Cancelar</el-button>
        <el-button type="primary" @click="enviarEditarAluguel">Atualizar</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/services/axios'
import { ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Check, ArrowDown } from '@element-plus/icons-vue'

export default {
  components: { Plus, Edit, Delete, Check, ArrowDown },
  data() {
    return {
      alugueis: [],
      locatarios: [],
      motos: [],
      motosDisponiveis: [],
      showDialog: false,
      showEditDialog: false,
      rules: {
        locatarioId: [{ required: true, message: 'O locatário é obrigatório', trigger: 'change' }],
        motoId: [{ required: true, message: 'A moto é obrigatória', trigger: 'change' }],
        dataInicio: [
          { required: true, message: 'A data de início é obrigatória', trigger: 'change' },
        ],
        dataFim: [{ required: true, message: 'A data de fim é obrigatória', trigger: 'change' }],
      },
      newAluguel: {
        locatarioId: null,
        motoId: null,
        dataInicio: null,
        dataFim: null,
      },
      editAluguel: {},
    }
  },
  created() {
    this.buscarAlugueis()
    this.buscarLocatarios()
    this.buscarMotos()
  },
  methods: {
    disablePastDates(date) {
      return date < new Date(new Date().setHours(0, 0, 0, 0))
    },
    async buscarAlugueis() {
      try {
        const { data } = await api.get('/alugueis')
        this.alugueis = data
      } catch (error) {
        this.$notify({
          title: 'Erro ao carregar lista de aluguéis.',
          message: 'Houve um erro ao carregar lista de aluguéis. Tente novamente mais tarde.',
          type: 'error',
          customClass: 'dark-notify',
        })
      }
    },
    async buscarLocatarios() {
      try {
        const { data } = await api.get('/locatarios')
        this.locatarios = data
      } catch (error) {
        this.$notify({
          title: 'Erro ao carregar locatários.',
          message: 'Houve um erro ao carregar lista de locatários.',
          type: 'error',
          customClass: 'dark-notify',
        })
      }
    },
    async buscarMotos() {
      try {
        const { data } = await api.get('/motos')
        this.motos = data
        this.motosDisponiveis = data.filter((moto) => moto.status === 'DISPONIVEL')
      } catch (error) {
        this.$notify({
          title: 'Erro ao carregar motos.',
          message: 'Houve um erro ao carregar lista de motos.',
          type: 'error',
          customClass: 'dark-notify',
        })
      }
    },
    handleAddAluguel() {
      this.showDialog = true
    },
    async criarNovoAluguel() {
      const form = this.$refs.formAluguel
      if (!form) return

      const isValid = await form.validate().catch(() => false)
      if (!isValid) return
      try {
        const payload = {
          dataInicio: this.newAluguel.dataInicio,
          dataFim: this.newAluguel.dataFim,
          motoId: this.newAluguel.motoId,
          locatarioId: this.newAluguel.locatarioId,
        }

        const { data } = await api.post('/alugueis', payload)
        this.alugueis.push(data)
        this.showDialog = false

        this.$notify({
          title: 'Aluguel cadastrado com sucesso!',
          type: 'success',
          customClass: 'dark-notify',
        })

        this.resetNewAluguelForm()
        this.buscarMotos()
        this.buscarLocatarios()
        this.buscarAlugueis()
      } catch (error) {
        const message =
          error.response?.data || 'Houve um erro ao cadastrar aluguel. Tente novamente mais tarde.'
        this.$notify({
          title: 'Erro ao cadastrar aluguel.',
          message,
          type: 'error',
          customClass: 'dark-notify',
        })
      }
    },
    abrirDialogEditar(aluguel) {
      this.motosDisponiveis.push(aluguel.moto)
      this.editAluguel = {
        id: aluguel.id,
        locatarioId: aluguel.locatario.id,
        motoId: aluguel.moto.id,
        dataInicio: aluguel.dataInicio,
        dataFim: aluguel.dataFim,
      }
      this.showEditDialog = true
    },
    async enviarEditarAluguel() {
      const form = this.$refs.formEdicao
      if (!form) return

      const isValid = await form.validate().catch(() => false)
      if (!isValid) return
      try {
        const payload = {
          dataInicio: this.editAluguel.dataInicio,
          dataFim: this.editAluguel.dataFim,
          motoId: this.editAluguel.motoId,
          locatarioId: this.editAluguel.locatarioId,
        }

        const { data } = await api.put(`/alugueis/${this.editAluguel.id}`, payload)
        const idx = this.alugueis.findIndex((a) => a.id === this.editAluguel.id)
        if (idx > -1) this.alugueis.splice(idx, 1, data)
        this.showEditDialog = false

        this.$notify({
          title: 'Aluguel atualizado com sucesso!',
          type: 'success',
          customClass: 'dark-notify',
        })
        this.resetEditAluguelForm()
        this.buscarMotos()
        this.buscarLocatarios()
        this.buscarAlugueis()
      } catch (error) {
        const message =
          error.response?.data || 'Houve um erro ao atualizar aluguel. Tente novamente mais tarde.'
        this.$notify({
          title: 'Erro ao atualizar aluguel.',
          message,
          type: 'error',
          customClass: 'dark-notify',
        })
      }
    },
    async finalizarAluguel(aluguel) {
      try {
        await ElMessageBox.confirm(
          `Tem certeza que deseja finalizar o aluguel da moto "${aluguel.moto.modelo}"?`,
          'Finalizar Aluguel',
          {
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            type: 'warning',
          },
        )

        await api.post(`/alugueis/${aluguel.id}/finalizar`)
        this.$notify({
          title: 'Aluguel finalizado com sucesso!',
          type: 'success',
          customClass: 'dark-notify',
        })
        this.buscarAlugueis()
        this.buscarMotos()
      } catch (error) {
        if (error !== 'cancel') {
          const message =
            error.response?.data ||
            'Houve um erro ao finalizar o aluguel. Tente novamente mais tarde.'
          this.$notify({
            title: 'Erro ao finalizar aluguel.',
            message,
            type: 'error',
            customClass: 'dark-notify',
          })
        }
      }
    },
    handleDelete(aluguel) {
      ElMessageBox.confirm(
        `Tem certeza que deseja excluir o aluguel da moto "${aluguel.moto.modelo}"?`,
        'Excluir Aluguel',
        {
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não',
          type: 'warning',
        },
      ).then(async () => {
        try {
          await api.delete(`/alugueis/${aluguel.id}`)
          this.alugueis = this.alugueis.filter((a) => a.id !== aluguel.id)
          this.$notify({
            title: `Aluguel da moto "${aluguel.moto.modelo}" excluído com sucesso!`,
            type: 'success',
            customClass: 'dark-notify',
          })
          this.buscarMotos()
        } catch (error) {
          const message =
            error.response?.data ||
            'Houve um erro ao tentar excluir o aluguel. Tente novamente mais tarde.'
          this.$notify({
            title: 'Erro ao excluir aluguel.',
            message,
            type: 'error',
            customClass: 'dark-notify',
          })
        }
      })
    },
    resetNewAluguelForm() {
      this.newAluguel = {
        locatarioId: null,
        motoId: null,
        dataInicio: null,
        dataFim: null,
      }
      if (this.$refs.formAluguel) {
        this.$refs.formAluguel.resetFields()
      }
    },
    resetEditAluguelForm() {
      this.editAluguel = {}
      if (this.$refs.formEdicao) {
        this.$refs.formEdicao.resetFields()
      }
    },
  },
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
  color: var(--el-color-primary);
}

.el-dropdown-menu__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
}

.el-dropdown-menu__item .el-icon {
  margin-right: 4px;
}

.el-dropdown .el-button {
  width: 100%;
  justify-content: space-between;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.table-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.el-table {
  width: 80%;
}
</style>
