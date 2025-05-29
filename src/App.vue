<script>
import { createRouter, createWebHistory } from 'vue-router'
import LoginScreen from './components/LoginScreen.vue'
import ListingScreen from './components/ListingScreen.vue'
import ReportsScreen from './components/ReportsScreen.vue'

const routes = [
  { path: '/', component: LoginScreen },
  { path: '/listings', component: ListingScreen },
  { path: '/reports', component: ReportsScreen },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
</script>

<template>
  <router-view />
</template>

<style>
/* Add any global styles here */
</style>
