<template>
  <div>
    <div class="header">
      <h1>Listagem de Aluguéis</h1>
      <el-button type="primary" @click="handleAddAluguel">
        <template #icon>
          <Plus />
        </template>
        Cadastrar Aluguel
      </el-button>
    </div>

    <div class="table-container">
      <el-table :data="alugueis" empty-text="Sem Dados">
        <el-table-column prop="id" label="ID" />
        <el-table-column
          prop="dataInicio"
          label="Data Início"
          :formatter="formatDate"
          width="150"
        />
        <el-table-column prop="dataFim" label="Data Fim" :formatter="formatDate" />
        <el-table-column prop="locatario.nome" label="Locatário" />
        <el-table-column prop="moto.modelo" label="Moto" />

        <el-table-column label="Ações">
          <template #default="scope">
            <el-button size="small" type="primary" @click="openEditDialog(scope.row)">
              <template #icon><Edit /></template>
              Editar
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">
              <template #icon><Delete /></template>
              Excluir
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Modal de cadastro -->
    <el-dialog
      v-model="showDialog"
      title="Cadastrar Novo Aluguel"
      width="40%"
      @close="resetNewAluguelForm"
    >
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
          >
            <el-option
              v-for="moto in motos"
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
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="Data de Fim" prop="dataFim">
          <el-date-picker
            v-model="newAluguel.dataFim"
            type="date"
            placeholder="Escolha uma data"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">Cancelar</el-button>
        <el-button type="primary" @click="submitNewAluguel">Salvar</el-button>
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
          >
            <el-option
              v-for="moto in motos"
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
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">Cancelar</el-button>
        <el-button type="primary" @click="submitEditAluguel">Atualizar</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/services/axios'
import { ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

export default {
  components: { Plus, Edit, Delete },
  data() {
    return {
      alugueis: [],
      locatarios: [],
      motos: [],
      showDialog: false,
      showEditDialog: false,
      rules: {
        locatarioId: [{ required: true, message: 'Selecione um locatário', trigger: 'change' }],
        motoId: [{ required: true, message: 'Selecione uma moto', trigger: 'change' }],
        dataInicio: [{ required: true, message: 'Escolha a data de início', trigger: 'blur' }],
        dataFim: [{ required: true, message: 'Escolha a data de fim', trigger: 'blur' }],
      },
      newAluguel: {
        locatarioId: null,
        motoId: null,
        dataInicio: '',
        dataFim: '',
      },
      editAluguel: {},
    }
  },
  created() {
    this.fetchAlugueis()
    this.fetchLocatarios()
    this.fetchMotos()
  },
  methods: {
    formatDate(row, column, value) {
      if (!value) return ''
      const date = new Date(value)
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${date.getFullYear()}`
    },

    async fetchAlugueis() {
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
    async fetchLocatarios() {
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
    async fetchMotos() {
      try {
        const { data } = await api.get('/motos')
        this.motos = data
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
    async submitNewAluguel() {
      const form = this.$refs.formAluguel
      if (!form) return

      const isValid = await form.validate().catch(() => false)
      if (!isValid) return
      try {
        const payload = {
          dataInicio: this.newAluguel.dataInicio,
          dataFim: this.newAluguel.dataFim,
          moto: { id: this.newAluguel.motoId },
          locatario: { id: this.newAluguel.locatarioId },
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
      } catch (error) {
        this.$notify({
          title: 'Erro ao cadastrar aluguel.',
          message: 'Houve um erro ao cadastrar aluguel. Tente novamente mais tarde.',
          type: 'error',
          customClass: 'dark-notify',
        })
      }
    },
    openEditDialog(aluguel) {
      this.editAluguel = {
        id: aluguel.id,
        locatarioId: aluguel.locatario.id,
        motoId: aluguel.moto.id,
        dataInicio: aluguel.dataInicio,
        dataFim: aluguel.dataFim,
      }
      this.showEditDialog = true
    },
    async submitEditAluguel() {
      const form = this.$refs.formEdicao
      if (!form) return

      const isValid = await form.validate().catch(() => false)
      if (!isValid) return
      try {
        const payload = {
          dataInicio: this.editAluguel.dataInicio,
          dataFim: this.editAluguel.dataFim,
          moto: { id: this.editAluguel.motoId },
          locatario: { id: this.editAluguel.locatarioId },
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
      } catch (error) {
        this.$notify({
          title: 'Erro ao atualizar aluguel.',
          message: 'Houve um erro ao atualizar aluguel. Tente novamente mais tarde.',
          type: 'error',
          customClass: 'dark-notify',
        })
      }
    },
    handleDelete(aluguel) {
      ElMessageBox.confirm(
        `Tem certeza que deseja excluir o aluguel de "${aluguel.locatario.nome}"?`,
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
            title: `Aluguel de "${aluguel.locatario.nome}" excluído com sucesso!`,
            type: 'success',
            customClass: 'dark-notify',
          })
        } catch (error) {
          this.$notify({
            title: 'Erro ao excluir aluguel.',
            message: 'Houve um erro ao excluir aluguel. Tente novamente mais tarde.',
            type: 'error',
            customClass: 'dark-notify',
          })
        }
      })
    },
    resetNewAluguelForm() {
      this.newAluguel = {}
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

.table-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.el-table {
  width: 80%;
}
</style>
