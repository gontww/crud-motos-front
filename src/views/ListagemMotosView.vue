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
    <el-dialog v-model="showDialog" title="Cadastrar Nova Moto" width="40%">
      <el-form label-position="top">
        <el-form-item label="Placa">
          <el-input v-model="newMoto.placa" placeholder="Ex: ABC1234" />
        </el-form-item>
        <el-form-item label="Modelo">
          <el-input v-model="newMoto.modelo" placeholder="Ex: MT-07" />
        </el-form-item>
        <el-form-item label="Marca">
          <el-input v-model="newMoto.marca" placeholder="Ex: Yamaha" />
        </el-form-item>
        <el-form-item label="Ano">
          <el-input-number v-model="newMoto.ano" :min="1900" :max="2100" />
        </el-form-item>
        <el-form-item label="Cor">
          <el-input v-model="newMoto.cor" placeholder="Ex: Preto" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="newMoto.status" placeholder="Selecione o status">
            <el-option label="Disponível" value="DISPONIVEL" />
            <el-option label="Alugada" value="ALUGADA" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">Cancelar</el-button>
        <el-button type="primary" @click="submitNewMoto">Salvar</el-button>
      </template>
    </el-dialog>

    <!-- Modal de edição -->
    <el-dialog v-model="showEditDialog" title="Editar Moto" width="40%">
      <el-form label-position="top">
        <el-form-item label="Placa">
          <el-input v-model="editMoto.placa" placeholder="Ex: ABC1234" />
        </el-form-item>
        <el-form-item label="Modelo">
          <el-input v-model="editMoto.modelo" placeholder="Ex: MT-07" />
        </el-form-item>
        <el-form-item label="Marca">
          <el-input v-model="editMoto.marca" placeholder="Ex: Yamaha" />
        </el-form-item>
        <el-form-item label="Ano">
          <el-input-number v-model="editMoto.ano" :min="1900" :max="2100" />
        </el-form-item>
        <el-form-item label="Cor">
          <el-input v-model="editMoto.cor" placeholder="Ex: Preto" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="editMoto.status" placeholder="Selecione o status">
            <el-option label="Disponível" value="DISPONIVEL" />
            <el-option label="Alugada" value="ALUGADA" />
          </el-select>
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
      newMoto: {
        placa: '',
        modelo: '',
        marca: '',
        ano: new Date().getFullYear(),
        cor: '',
        status: 'DISPONIVEL',
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
        console.error('Erro ao buscar motos:', error)
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
