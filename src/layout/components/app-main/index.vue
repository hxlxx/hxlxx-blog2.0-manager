<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <el-card class="box-card h-full" shadow="hover" body-style="height: 100%;">
    <template #header>
      <h1>{{ route.meta.title }}</h1>
    </template>
    <router-view></router-view>
  </el-card>
</template>
