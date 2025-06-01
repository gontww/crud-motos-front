import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import ListagemMotosView from '@/views/ListagemMotosView.vue'
import ListagemLocatariosView from '@/views/ListagemLocatariosView.vue'
import ListagemAlugueisView from '@/views/ListagemAlugueisView.vue'
import { isAuthenticated } from '@/services/auth'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false },
    redirectIfLoggedIn: true,
  },
  {
    path: '/listagem-moto',
    name: 'Listagem de Motos',
    component: ListagemMotosView,
    meta: { requiresAuth: true },
  },
  {
    path: '/listagem-locatario',
    name: 'Listagem de Locatários',
    component: ListagemLocatariosView,
    meta: { requiresAuth: true },
  },
  {
    path: '/listagem-aluguel',
    name: 'Listagem de Aluguéis',
    component: ListagemAlugueisView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const loggedIn = isAuthenticated()

  if (to.name === 'Login' && loggedIn && to.route?.redirectIfLoggedIn) {
    return next({ name: 'Listagem de Motos' })
  }

  if (to.meta.requiresAuth && !loggedIn) {
    return next({ name: 'Login' })
  }

  next()
})

export default router
