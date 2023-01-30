<script setup lang="ts">
import SideBar from './components/side-bar/index.vue'
import AppHeader from './components/app-header/index.vue'
import AppMain from './components/app-main/index.vue'
</script>

<template>
  <el-container class="h-full" direction="vertical">
    <el-container class="bg-gray-100 dark:bg-[#121212]" direction="horizontal">
      <el-aside
        width="auto"
        class="shadow-md"
        style="background-color: var(--el-bg-color-overlay)"
      >
        <!-- Aside content -->
        <side-bar />
      </el-aside>
      <el-container direction="vertical">
        <el-header
          height="auto"
          class="shadow-md p-0 ml-[10px]"
          style="background-color: var(--el-bg-color-overlay)"
        >
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
