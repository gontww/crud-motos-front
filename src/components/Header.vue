<template>
  <header class="header">
    <div class="left-section">
      <h1>Locadora de Motos</h1>
    </div>
    <div class="right-section">
      <el-button icon="User" @click="goToProfile">Perfil</el-button>
      <el-button icon="SwitchButton" @click="logout">Logout</el-button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToProfile = () => {
  // Implementação futura
  alert('Funcionalidade de perfil ainda não implementada.')
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--color-border);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: none;
  z-index: 1000;
}

.left-section h1 {
  margin: 0;
  font-size: 20px;
}

.right-section .el-button {
  margin-left: 10px;
}
</style>
