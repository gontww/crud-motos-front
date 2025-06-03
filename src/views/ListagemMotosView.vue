<template>
  <div>
    <div class="header">
      <h1>Listagem de Motos</h1>
      <el-button type="primary" @click="handleAddMotorcycle">
        <template #icon>
          <Plus />
        </template>
        Cadastrar Moto
      </el-button>
    </div>

    <div class="table-container">
      <el-table :data="motorcycles" style="width: 80%" empty-text="Sem Dados">
        <el-table-column prop="modelo" label="Modelo" />
        <el-table-column prop="marca" label="Marca" />
        <el-table-column prop="placa" label="Placa" />
        <el-table-column prop="ano" label="Ano" />
        <el-table-column prop="cor" label="Cor" />
        <el-table-column prop="status" label="Status" />

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
      title="Cadastrar Nova Moto"
      @close="resetNewMotoForm"
      width="40%"
    >
      <el-form ref="newMotoForm" label-position="top" :model="newMoto" :rules="rules">
        <el-form-item label="Placa" prop="placa">
          <el-input
            v-model="newMoto.placa"
            placeholder="Ex: ABC1D23"
            maxlength="7"
            @input="normalizePlaca"
          />
        </el-form-item>

        <el-form-item label="Modelo" prop="modelo">
          <el-input v-model="newMoto.modelo" placeholder="Ex: MT-07" />
        </el-form-item>

        <el-form-item label="Marca" prop="marca">
          <el-input v-model="newMoto.marca" placeholder="Ex: Yamaha" />
        </el-form-item>

        <el-form-item label="Ano" prop="ano">
          <el-input-number v-model="newMoto.ano" :min="1900" :max="2100" />
        </el-form-item>

        <el-form-item label="Cor" prop="cor">
          <el-input v-model="newMoto.cor" placeholder="Ex: Preto" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">Cancelar</el-button>
        <el-button type="primary" @click="submitNewMoto">Salvar</el-button>
      </template>
    </el-dialog>

    <!-- Modal de edição -->
    <el-dialog v-model="showEditDialog" title="Editar Moto" @close="resetEditMotoForm" width="40%">
      <el-form ref="editMotoForm" :model="editMoto" :rules="rules" label-position="top">
        <el-form-item label="Placa" prop="placa">
          <el-input v-model="editMoto.placa" placeholder="Ex: ABC1D23" />
        </el-form-item>
        <el-form-item label="Modelo" prop="modelo">
          <el-input v-model="editMoto.modelo" placeholder="Ex: MT-07" />
        </el-form-item>
        <el-form-item label="Marca" prop="marca">
          <el-input v-model="editMoto.marca" placeholder="Ex: Yamaha" />
        </el-form-item>
        <el-form-item label="Ano" prop="ano">
          <el-input-number v-model="editMoto.ano" :min="1900" :max="2100" />
        </el-form-item>
        <el-form-item label="Cor" prop="cor">
          <el-input v-model="editMoto.cor" placeholder="Ex: Preto" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">Cancelar</el-button>
        <el-button type="primary" @click="submitEditMoto">Atualizar</el-button>
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
      motorcycles: [],
      showDialog: false,
      showEditDialog: false,
      rules: {
        placa: [
          {
            required: true,
            message: 'A placa é obrigatória',
            trigger: 'blur',
          },
          {
            pattern: /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/,
            message: 'Placa inválida. Use o formato ABC1234 ou ABC1D23',
            trigger: 'blur',
          },
        ],
        modelo: [{ required: true, message: 'O modelo é obrigatório', trigger: 'blur' }],
        marca: [{ required: true, message: 'A marca é obrigatória', trigger: 'blur' }],
        ano: [{ required: true, message: 'O ano é obrigatório', trigger: 'change' }],
        cor: [{ required: true, message: 'A cor é obrigatória', trigger: 'blur' }],
      },
      newMoto: {
        placa: '',
        modelo: '',
        marca: '',
        ano: new Date().getFullYear(),
        cor: '',
        status: null,
      },
      editMoto: {},
    }
  },
  created() {
    this.fetchMotorcycles()
  },
  methods: {
    async fetchMotorcycles() {
      try {
        const response = await api.get('/motos')
        this.motorcycles = response.data
      } catch (error) {
        this.$notify({
          title: 'Erro ao carregar lista de motos.',
          message: 'Houve um erro ao carregar lista de motos. Tente novamente mais tarde.',
          type: 'error',
          customClass: 'dark-notify',
        })
      }
    },
    handleAddMotorcycle() {
      this.showDialog = true
    },
    async submitNewMoto() {
      const form = this.$refs.newMotoForm
      if (!form) return

      const isValid = await form.validate().catch(() => false)
      if (!isValid) return
      try {
        const response = await api.post('/motos', this.newMoto)
        this.motorcycles.push(response.data)
        this.showDialog = false
        this.$notify({
          title: 'Moto cadastrada com sucesso!',
          type: 'success',
          customClass: 'dark-notify',
        })
        this.newMoto = {
          placa: '',
          modelo: '',
          marca: '',
          ano: new Date().getFullYear(),
          cor: '',
          status: 'DISPONIVEL',
        }
      } catch (error) {
        this.$notify({
          title: 'Erro ao cadastrar moto.',
          message: 'Houve um erro ao tentar cadastrar a moto. Tente novamente mais tarde.',
          type: 'error',
          customClass: 'dark-notify',
        })
      }
    },
    openEditDialog(moto) {
      this.editMoto = { ...moto }
      this.showEditDialog = true
    },
    async submitEditMoto() {
      const form = this.$refs.editMotoForm
      if (!form) return

      const isValid = await form.validate().catch(() => false)
      if (!isValid) return

      try {
        const response = await api.put(`/motos/${this.editMoto.id}`, this.editMoto)
        const index = this.motorcycles.findIndex((m) => m.id === this.editMoto.id)
        if (index > -1) {
          this.motorcycles.splice(index, 1, response.data)
        }
        this.showEditDialog = false
        this.$notify({
          title: 'Moto atualizada com sucesso!',
          type: 'success',
          customClass: 'dark-notify',
        })
      } catch (error) {
        this.$notify({
          title: 'Erro ao atualizar moto.',
          message: 'Houve um erro ao atualizar moto. Tente novamente mais tarde.',
          type: 'error',
          customClass: 'dark-notify',
        })
      }
    },
    handleDelete(moto) {
      ElMessageBox.confirm(
        `Tem certeza que deseja excluir a moto "${moto.modelo}"?`,
        'Excluir Moto',
        {
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não',
          type: 'warning',
        },
      ).then(async () => {
        try {
          await api.delete(`/motos/${moto.id}`)
          this.motorcycles = this.motorcycles.filter((m) => m.id !== moto.id)
          this.$notify({
            title: `Moto "${moto.modelo}" excluída com sucesso!`,
            type: 'success',
            customClass: 'dark-notify',
          })
        } catch (error) {
          this.$notify({
            title: 'Erro ao excluir moto.',
            message: 'Houve um erro ao tentar excluir a moto. Tente novamente mais tarde.',
            type: 'error',
            customClass: 'dark-notify',
          })
        }
      })
    },
    normalizePlaca() {
      this.newMoto.placa = this.newMoto.placa
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 7)
    },
    resetNewMotoForm() {
      this.newMoto = {
        placa: '',
        modelo: '',
        marca: '',
        ano: new Date().getFullYear(),
        cor: '',
        status: null,
      }
      if (this.$refs.newMotoForm) {
        this.$refs.newMotoForm.resetFields()
      }
    },
    resetEditMotoForm() {
      this.editMoto = {}
      if (this.$refs.editMotoForm) {
        this.$refs.editMotoForm.resetFields()
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
