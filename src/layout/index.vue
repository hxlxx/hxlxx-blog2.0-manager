<script setup lang="ts">
import SideBar from './components/side-bar/index.vue'
import AppHeader from './components/app-header/index.vue'
import AppMain from './components/app-main/index.vue'
</script>

<template>
  <el-container direction="vertical">
    <el-container direction="horizontal">
      <el-aside class="translate-all duration-500" width="auto">
        <!-- Aside content -->
        <side-bar />
      </el-aside>
      <el-container direction="vertical" class="bg-gray-100">
        <el-header height="auto" class="bg-white shadow-md">
          <!-- Header content -->
          <app-header />
        </el-header>
        <el-main class="p-2">
          <!-- Main content -->
          <app-main />
        </el-main>
      </el-container>
    </el-container>
    <!-- <el-footer> -->
    <!-- Footer content -->
    <!-- footer -->
    <!-- </el-footer> -->
  </el-container>
</template>
