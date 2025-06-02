<template>
  <div>
    <div class="header">
      <h1>Listagem de Locatários</h1>
      <el-button type="primary" @click="handleAddLocatario">
        <template #icon>
          <Plus />
        </template>
        Cadastrar Locatário
      </el-button>
    </div>

    <div class="table-container">
      <el-table :data="locatarios" empty-text="Sem Dados">
        <el-table-column prop="nome" label="Nome" width="220" />
        <el-table-column prop="cpf" label="CPF" width="180" />
        <el-table-column prop="telefone" label="Telefone" width="160" />
        <el-table-column prop="email" label="E‑mail" />

        <el-table-column label="Ações" width="200">
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
    <el-dialog v-model="showDialog" title="Cadastrar Novo Locatário" width="40%">
      <el-form label-position="top">
        <el-form-item label="Nome">
          <el-input v-model="newLocatario.nome" placeholder="Ex: João da Silva" />
        </el-form-item>
        <el-form-item label="CPF">
          <el-input v-model="newLocatario.cpf" placeholder="Ex: 123.456.789-00" />
        </el-form-item>
        <el-form-item label="Telefone">
          <el-input v-model="newLocatario.telefone" placeholder="Ex: (11) 91234‑5678" />
        </el-form-item>
        <el-form-item label="E‑mail">
          <el-input v-model="newLocatario.email" placeholder="Ex: joao@email.com" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">Cancelar</el-button>
        <el-button type="primary" @click="submitNewLocatario">Salvar</el-button>
      </template>
    </el-dialog>

    <!-- Modal de edição -->
    <el-dialog v-model="showEditDialog" title="Editar Locatário" width="40%">
      <el-form label-position="top">
        <el-form-item label="Nome">
          <el-input v-model="editLocatario.nome" placeholder="Ex: João da Silva" />
        </el-form-item>
        <el-form-item label="CPF">
          <el-input v-model="editLocatario.cpf" placeholder="Ex: 123.456.789-00" />
        </el-form-item>
        <el-form-item label="Telefone">
          <el-input v-model="editLocatario.telefone" placeholder="Ex: (11) 91234‑5678" />
        </el-form-item>
        <el-form-item label="E‑mail">
          <el-input v-model="editLocatario.email" placeholder="Ex: joao@email.com" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">Cancelar</el-button>
        <el-button type="primary" @click="submitEditLocatario">Atualizar</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/services/axios'
import { ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

export default {
  components: {
    Plus,
    Edit,
    Delete,
  },
  data() {
    return {
      locatarios: [],
      showDialog: false,
      showEditDialog: false,
      newLocatario: {
        nome: '',
        cpf: '',
        telefone: '',
        email: '',
      },
      editLocatario: {},
    }
  },
  created() {
    this.fetchLocatarios()
  },
  methods: {
    async fetchLocatarios() {
      try {
        const response = await api.get('/locatarios')
        this.locatarios = response.data
      } catch (error) {
        this.$notify({
          title: 'Erro ao carregar lista.',
          message: 'Houve um erro ao carregar lista de locatários. Tente novamente mais tarde.',
          type: 'error',
          customClass: 'dark-notify',
        })
      }
    },
    handleAddLocatario() {
      this.showDialog = true
    },
    async submitNewLocatario() {
      try {
        const response = await api.post('/locatarios', this.newLocatario)
        this.locatarios.push(response.data)
        this.showDialog = false
        this.$notify({
          title: 'Locatário cadastrado com sucesso!',
          type: 'success',
          customClass: 'dark-notify',
        })
        this.newLocatario = { nome: '', cpf: '', telefone: '', email: '' }
      } catch (error) {
        this.$notify({
          title: 'Erro ao cadastrar.',
          message: 'Houve um erro ao cadastrar locatário. Tente novamente mais tarde.',
          type: 'error',
          customClass: 'dark-notify',
        })
      }
    },
    openEditDialog(locatario) {
      this.editLocatario = { ...locatario }
      this.showEditDialog = true
    },
    async submitEditLocatario() {
      try {
        const response = await api.put(`/locatarios/${this.editLocatario.id}`, this.editLocatario)
        const idx = this.locatarios.findIndex((l) => l.id === this.editLocatario.id)
        if (idx > -1) this.locatarios.splice(idx, 1, response.data)
        this.showEditDialog = false
        this.$notify({
          title: 'Locatário atualizado com sucesso!',
          type: 'success',
          customClass: 'dark-notify',
        })
      } catch (error) {
        console.error('Erro ao atualizar locatário:', error)
        this.$notify({
          title: 'Erro ao atualizar.',
          message: 'Houve um erro ao atualizar locatário. Tente novamente mais tarde.',
          type: 'error',
          customClass: 'dark-notify',
        })
      }
    },
    handleDelete(locatario) {
      ElMessageBox.confirm(
        `Tem certeza que deseja excluir o locatário "${locatario.nome}"?`,
        'Excluir Locatário',
        {
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não',
          type: 'warning',
        },
      ).then(async () => {
        try {
          await api.delete(`/locatarios/${locatario.id}`)
          this.locatarios = this.locatarios.filter((l) => l.id !== locatario.id)
          this.$notify({
            title: `Locatário "${locatario.nome}" excluído com sucesso!`,
            type: 'success',
            customClass: 'dark-notify',
          })
        } catch (error) {
          console.error('Erro ao excluir locatário:', error)
          this.$notify({
            title: 'Erro ao excluir.',
            message: 'Houve um erro ao excluir locatário. Tente novamente mais tarde.',
            type: 'error',
            customClass: 'dark-notify',
          })
        }
      })
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
