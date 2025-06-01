import axios from '../services/axios'

const login = async (login, senha) => {
  try {
    const response = await axios.post('/login', { login, senha })
    const token = response.data

    if (token) {
      localStorage.setItem('token', token)
      return true
    }
    return false
  } catch (error) {
    console.error('Erro ao logar:', error)
    return false
  }
}

const logout = () => {
  localStorage.removeItem('token')
}

const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}

export { login, logout, isAuthenticated }
