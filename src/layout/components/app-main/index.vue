<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <el-card
    class="relative box-card h-full"
    shadow="hover"
    body-style="height: 100%;"
  >
    <template #header>
      <h1>{{ route.meta.title }}</h1>
    </template>
    <router-view v-slot="{ Component }">
      <transition
        appear
        mode="out-in"
        enter-active-class="relative transition-all duration-500 cus-in-out"
        enter-from-class="opacity-0 -left-[100px]"
        enter-to-class="opacity-100 left-0"
        leave-active-class="relative transition-all duration-500 cus-in-out"
        leave-from-class="opacity-100 left-0"
        leave-to-class="opacity-0 left-[100px]"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </el-card>
</template>
