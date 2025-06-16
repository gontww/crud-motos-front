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
import { ElMessage } from 'element-plus'
import axios from 'axios'

export default {
  name: 'PerfilView',
  data() {
    return {
      formRef: null,
      loading: false,
      form: {
        nome: '',
        login: '',
        senha: '',
      },
      rules: {
        nome: [{ required: true, message: 'Por favor, insira seu nome', trigger: 'blur' }],
        login: [{ required: true, message: 'Por favor, insira seu login', trigger: 'blur' }],
        senha: [{ min: 6, message: 'A senha deve ter pelo menos 6 caracteres', trigger: 'blur' }],
      },
    }
  },
  mounted() {
    this.carregarPerfil()
  },
  methods: {
    async carregarPerfil() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8080/usuarios/perfil', {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.form.nome = response.data.nome
        this.form.login = response.data.login
        this.form.senha = '' // não preencher a senha por segurança
      } catch (error) {
        ElMessage.error('Erro ao carregar perfil')
      }
    },
    async salvarPerfil() {
      if (!this.$refs.formRef) return

      try {
        await this.$refs.formRef.validate()
        this.loading = true

        const token = localStorage.getItem('token')
        const dadosParaEnviar = {
          nome: this.form.nome,
          login: this.form.login,
          senha: this.form.senha || undefined,
        }

        await axios.put('http://localhost:8080/usuarios/perfil', dadosParaEnviar, {
          headers: { Authorization: `Bearer ${token}` },
        })

        ElMessage.success('Perfil atualizado com sucesso!')
        this.form.senha = ''
      } catch (error) {
        ElMessage.error('Erro ao atualizar perfil')
      } finally {
        this.loading = false
      }
    },
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
