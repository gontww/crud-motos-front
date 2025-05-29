<template>
  <el-card class="login-screen">
    <h1>Login</h1>
    <el-form @submit.prevent="handleLogin" label-position="top" class="login-form">
      <el-form-item label="Nome de usuário">
        <el-input v-model="username" placeholder="Insira seu nome de usuário" />
      </el-form-item>
      <el-form-item label="Senha">
        <el-input v-model="password" type="password" placeholder="Insira sua senha" />
      </el-form-item>
      <el-form-item>
        <el-button class="login-button" type="primary" @click="handleLogin">Login</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotify } from '../utils/useNotify'

const username = ref('')
const password = ref('')
const router = useRouter()
const notify = useNotify()

const handleLogin = () => {
  notify({
    title: 'Login Successful',
    message: `Welcome, ${username.value}!`,
    type: 'success',
    customClass: 'dark-notify',
  })

  router.push('/listings')
}
</script>

<style scoped>
.login-screen {
  width: 400px;
  margin: 0 auto;
  padding: 2rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background);
  color: var(--color-text);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

h1 {
  text-align: center;
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.login-button {
  display: flex;
  justify-content: center;
  width: 100%;
}

.login-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
