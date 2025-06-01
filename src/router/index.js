import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/LoginScreen.vue'
import ListingScreen from '@/views/ListingScreen.vue'
import { isAuthenticated } from '@/services/auth'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false },
    redirectIfLoggedIn: true,
  },
  {
    path: '/listagem-moto',
    name: 'Listagem de Motos',
    component: ListingScreen,
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
