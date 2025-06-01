<template>
  <div v-if="$route.name !== 'Login'" class="app-container">
    <Header />
    <div class="main-layout">
      <Sidebar />
      <router-view class="router-view" />
    </div>
  </div>
  <div v-else>
    <router-view />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'

export default {
  components: {
    Header,
    Sidebar,
  },
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-layout {
  display: flex;
  flex: 1;
  margin-top: 60px;
  min-height: 0;
}

.router-view {
  flex: 1;
  margin-left: 220px;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
  height: calc(100vh - 60px);
  width: calc(100vw - 220px);
}
</style>
