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
            <el-button size="small" type="primary" @click="abrirDialogEditar(scope.row)">
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
      title="Cadastrar Novo Locatário"
      @close="resetNewLocatarioForm"
      width="40%"
    >
      <el-form ref="newLocatarioForm" :model="newLocatario" :rules="rules" label-position="top">
        <el-form-item label="Nome" prop="nome">
          <el-input v-model="newLocatario.nome" placeholder="Ex: João da Silva" />
        </el-form-item>

        <el-form-item label="CPF" prop="cpf">
          <el-input
            v-model="newLocatario.cpf"
            v-mask="'###.###.###-##'"
            placeholder="Ex: 123.456.789-00"
          />
        </el-form-item>

        <el-form-item label="Telefone" prop="telefone">
          <el-input
            v-model="newLocatario.telefone"
            v-mask="'(##) #####-####'"
            placeholder="Ex: (11) 91234-5678"
          />
        </el-form-item>

        <el-form-item label="E-mail" prop="email">
          <el-input v-model="newLocatario.email" placeholder="Ex: joao@email.com" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">Cancelar</el-button>
        <el-button type="primary" @click="criarNovoLocatario">Salvar</el-button>
      </template>
    </el-dialog>

    <!-- Modal de edição -->
    <el-dialog
      v-model="showEditDialog"
      title="Editar Locatário"
      @close="resetEditLocatarioForm"
      width="40%"
    >
      <el-form ref="editLocatarioForm" :model="editLocatario" :rules="rules" label-position="top">
        <el-form-item label="Nome" prop="nome">
          <el-input v-model="editLocatario.nome" placeholder="Ex: João da Silva" />
        </el-form-item>
        <el-form-item label="CPF" prop="cpf">
          <el-input
            v-model="editLocatario.cpf"
            v-mask="'###.###.###-##'"
            placeholder="Ex: 123.456.789-00"
          />
        </el-form-item>
        <el-form-item label="Telefone" prop="telefone">
          <el-input
            v-model="editLocatario.telefone"
            v-mask="'(##) #####-####'"
            placeholder="Ex: (11) 91234‑5678"
          />
        </el-form-item>
        <el-form-item label="E‑mail" prop="email">
          <el-input v-model="editLocatario.email" placeholder="Ex: joao@email.com" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">Cancelar</el-button>
        <el-button type="primary" @click="enviarEditarLocatario">Atualizar</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/services/axios'
import { ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { validateCPF } from '@/utils/validacoes.js'

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
      rules: {
        nome: [{ required: true, message: 'O nome é obrigatório', trigger: 'blur' }],
        cpf: [
          { required: true, message: 'O CPF é obrigatório', trigger: 'blur' },
          { validator: validateCPF, trigger: 'blur' },
        ],
        telefone: [{ required: true, message: 'O telefone é obrigatório', trigger: 'blur' }],
        email: [
          { required: true, message: 'O e-mail é obrigatório', trigger: 'blur' },
          { type: 'email', message: 'Formato de e-mail inválido', trigger: 'blur' },
        ],
      },
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
    this.buscarLocatarios()
  },
  methods: {
    async buscarLocatarios() {
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
    async criarNovoLocatario() {
      const form = this.$refs.newLocatarioForm
      if (!form) return

      const isValid = await form.validate().catch(() => false)
      if (!isValid) return
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
    abrirDialogEditar(locatario) {
      this.editLocatario = { ...locatario }
      this.showEditDialog = true
    },
    async enviarEditarLocatario() {
      const form = this.$refs.editLocatarioForm
      if (!form) return

      const isValid = await form.validate().catch(() => false)
      if (!isValid) return
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
          this.$notify({
            title: 'Erro ao excluir.',
            message: 'Houve um erro ao excluir locatário. Tente novamente mais tarde.',
            type: 'error',
            customClass: 'dark-notify',
          })
        }
      })
    },
    resetNewLocatarioForm() {
      this.newLocatario = { nome: '', cpf: '', telefone: '', email: '' }
      if (this.$refs.newLocatarioForm) {
        this.$refs.newLocatarioForm.resetFields()
      }
    },
    resetEditLocatarioForm() {
      this.editLocatario = {}
      if (this.$refs.editLocatarioForm) {
        this.$refs.editLocatarioForm.resetFields()
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
