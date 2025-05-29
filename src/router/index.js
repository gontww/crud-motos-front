import { createRouter, createWebHistory } from 'vue-router'
import LoginScreen from '../components/LoginScreen.vue'
import ListingScreen from '../components/ListingScreen.vue'
import ReportsScreen from '../components/ReportsScreen.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginScreen,
  },
  {
    path: '/listings',
    name: 'Listings',
    component: ListingScreen,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
