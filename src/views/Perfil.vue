<template>
  <div class="perfil-container">
    <el-card class="perfil-card">
      <template #header>
        <div class="card-header">
          <h2>Editar Perfil</h2>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="salvarPerfil"
      >
        <el-form-item label="Nome" prop="nome">
          <el-input v-model="form.nome" />
        </el-form-item>

        <el-form-item label="Login" prop="login">
          <el-input v-model="form.login" />
        </el-form-item>

        <el-form-item label="Nova Senha" prop="senha">
          <el-input
            v-model="form.senha"
            type="password"
            placeholder="Deixe em branco para manter a senha atual"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading">
            Salvar Alterações
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

export default {
  name: 'PerfilView',
  setup() {
    const formRef = ref(null)
    const loading = ref(false)
    const form = ref({
      nome: '',
      login: '',
      senha: '',
    })

    const rules = {
      nome: [{ required: true, message: 'Por favor, insira seu nome', trigger: 'blur' }],
      login: [{ required: true, message: 'Por favor, insira seu login', trigger: 'blur' }],
      senha: [{ min: 6, message: 'A senha deve ter pelo menos 6 caracteres', trigger: 'blur' }],
    }

    const carregarPerfil = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8080/usuarios/perfil', {
          headers: { Authorization: `Bearer ${token}` },
        })
        form.value = {
          nome: response.data.nome,
          login: response.data.login,
          senha: '', // Não carregamos a senha por segurança
        }
      } catch (error) {
        ElMessage.error('Erro ao carregar perfil')
      }
    }

    const salvarPerfil = async () => {
      if (!formRef.value) return

      try {
        await formRef.value.validate()
        loading.value = true

        const token = localStorage.getItem('token')
        const dadosParaEnviar = {
          nome: form.value.nome,
          login: form.value.login,
          senha: form.value.senha || undefined, // Só envia a senha se foi preenchida
        }

        await axios.put('http://localhost:8080/usuarios/perfil', dadosParaEnviar, {
          headers: { Authorization: `Bearer ${token}` },
        })

        ElMessage.success('Perfil atualizado com sucesso!')
        form.value.senha = '' // Limpa o campo de senha após salvar
      } catch (error) {
        ElMessage.error('Erro ao atualizar perfil')
      } finally {
        loading.value = false
      }
    }

    onMounted(carregarPerfil)

    return {
      formRef,
      form,
      rules,
      loading,
      salvarPerfil,
    }
  },
}
</script>

<style scoped>
.perfil-container {
  padding: 20px;
  max-width: 600px;
}

.perfil-card {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
}
</style>
