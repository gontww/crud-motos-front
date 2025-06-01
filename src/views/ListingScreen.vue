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

    <el-table :data="motorcycles" style="width: 100%">
      <el-table-column prop="modelo" label="Modelo" width="200" />
      <el-table-column prop="marca" label="Marca" />
      <el-table-column prop="placa" label="Placa" width="120" />
      <el-table-column prop="ano" label="Ano" width="100" />
      <el-table-column prop="cor" label="Cor" width="120" />
      <el-table-column prop="status" label="Status" width="150" />

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

<script setup>
import { ref } from 'vue'
import {
  ElMessageBox,
  ElMessage,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElInputNumber,
} from 'element-plus'
import api from '@/services/axios'

const motorcycles = ref([])

const fetchMotorcycles = async () => {
  try {
    const response = await api.get('/motos')
    motorcycles.value = response.data
  } catch (error) {
    console.error('Erro ao buscar motos:', error)
    ElMessage.error('Erro ao carregar lista de motos.')
  }
}

const showDialog = ref(false)
const newMoto = ref({
  placa: '',
  modelo: '',
  marca: '',
  ano: new Date().getFullYear(),
  cor: '',
  status: 'DISPONIVEL',
})

const handleAddMotorcycle = () => {
  showDialog.value = true
}

const submitNewMoto = async () => {
  try {
    const response = await api.post('/motos', newMoto.value)
    motorcycles.value.push(response.data)
    showDialog.value = false
    ElMessage.success('Moto cadastrada com sucesso!')

    newMoto.value = {
      placa: '',
      modelo: '',
      marca: '',
      ano: new Date().getFullYear(),
      cor: '',
      status: 'DISPONIVEL',
    }
  } catch (error) {
    console.error('Erro ao cadastrar moto:', error)
    ElMessage.error('Erro ao cadastrar moto.')
  }
}

const showEditDialog = ref(false)
const editMoto = ref({})

const openEditDialog = (moto) => {
  editMoto.value = { ...moto }
  showEditDialog.value = true
}

const submitEditMoto = async () => {
  try {
    const response = await api.put(`/motos/${editMoto.value.id}`, editMoto.value)
    const index = motorcycles.value.findIndex((m) => m.id === editMoto.value.id)
    if (index > -1) {
      motorcycles.value[index] = response.data
    }
    showEditDialog.value = false
    ElMessage.success('Moto atualizada com sucesso!')
  } catch (error) {
    console.error('Erro ao editar moto:', error)
    ElMessage.error('Erro ao atualizar moto.')
  }
}

const handleDelete = (motorcycle) => {
  ElMessageBox.confirm(
    `Tem certeza que deseja excluir a moto "${motorcycle.modelo}"?`,
    'Excluir Moto',
    {
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      type: 'warning',
    },
  ).then(async () => {
    try {
      await api.delete(`/motos/${motorcycle.id}`)
      motorcycles.value = motorcycles.value.filter((m) => m.id !== motorcycle.id)
      ElMessage.success(`Moto "${motorcycle.modelo}" excluída com sucesso!`)
    } catch (error) {
      console.error('Erro ao excluir moto:', error)
      ElMessage.error('Erro ao excluir moto.')
    }
  })
}

fetchMotorcycles()
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
}

.el-table {
  margin-top: 20px;
}
</style>
