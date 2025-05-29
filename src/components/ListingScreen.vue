<template>
  <div class="listing-screen">
    <div class="header">
      <h1>Motorcycle Listings</h1>
      <el-button type="primary" @click="handleAddMotorcycle">
        <template #icon>
          <Plus />
        </template>
        Cadastrar Moto
      </el-button>
    </div>

    <el-table :data="motorcycles" style="width: 100%">
      <el-table-column prop="name" label="Nome" width="200" />
      <el-table-column prop="description" label="Descrição" />
      <el-table-column prop="price" label="Preço por dia" width="150">
        <template #default="scope"> R$ {{ scope.row.price }} </template>
      </el-table-column>

      <el-table-column label="Ações" width="200">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">
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
</template>

<script setup>
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const motorcycles = ref([
  { id: 1, name: 'Harley Davidson', description: 'A classic cruiser motorcycle.', price: 100 },
  { id: 2, name: 'Kawasaki Ninja', description: 'A sport bike with high performance.', price: 120 },
  { id: 3, name: 'Yamaha MT-07', description: 'A versatile naked bike.', price: 90 },
])

const handleAddMotorcycle = () => {
  ElMessage({
    message: 'Função de cadastrar moto ainda não implementada.',
    type: 'info',
  })
}

const handleEdit = (motorcycle) => {
  ElMessageBox.prompt('Edite as informações da moto:', 'Editar Moto', {
    inputValue: motorcycle.name,
    confirmButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
  }).then(({ value }) => {
    motorcycle.name = value
    ElMessage({
      type: 'success',
      message: `Moto "${motorcycle.name}" editada com sucesso!`,
    })
  })
}

const handleDelete = (motorcycle) => {
  ElMessageBox.confirm(
    `Tem certeza que deseja excluir a moto "${motorcycle.name}"?`,
    'Excluir Moto',
    {
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      type: 'warning',
    },
  ).then(() => {
    motorcycles.value = motorcycles.value.filter((m) => m.id !== motorcycle.id)
    ElMessage({
      type: 'success',
      message: `Moto "${motorcycle.name}" excluída com sucesso!`,
    })
  })
}
</script>

<style scoped>
.listing-screen {
  padding: 20px;
}

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
