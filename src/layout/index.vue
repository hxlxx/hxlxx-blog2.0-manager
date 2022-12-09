<script setup lang="ts">
import {} from 'vue'
import SideBar from './components/side-bar/index.vue'
import AppHeader from './components/app-header/index.vue'
</script>

<template>
  <el-container direction="vertical">
    <el-container direction="horizontal">
      <el-aside width="200px">
        <!-- Aside content -->
        <SideBar />
      </el-aside>
      <el-container direction="vertical">
        <el-header height="">
          <!-- Header content -->
          <AppHeader />
        </el-header>

        <el-main height="">
          <!-- Main content -->
          main
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-footer height="">
      <!-- Footer content -->
      footer
    </el-footer>
  </el-container>
</template>
