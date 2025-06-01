<template>
  <aside class="sidebar">
    <el-menu
      :default-active="$route.path"
      class="sidebar-menu"
      background-color="var(--color-border)"
      text-color="white"
      active-text-color="#ffd04b"
      router
    >
      <el-menu-item index="/listagem-moto">
        <el-icon name="Bike"></el-icon>
        <span>Motos</span>
      </el-menu-item>

      <el-menu-item index="/listagem-locatario">
        <el-icon name="User"></el-icon>
        <span>Locatários</span>
      </el-menu-item>

      <el-menu-item index="/listagem-aluguel">
        <el-icon name="Document"></el-icon>
        <span>Aluguéis</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script></script>

<style scoped>
.sidebar-menu {
  border-right: none;
  height: 100%;
}
.sidebar {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  width: 220px;
  color: white;
  overflow-y: auto;
  transition: all 0.3s ease;
  z-index: 999;
}
</style>
