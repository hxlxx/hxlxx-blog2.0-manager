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
      <h1 class="text-xl font-semibold">{{ route.meta.title }}</h1>
    </template>
    <router-view v-slot="{ Component }">
      <transition
        appear
        mode="out-in"
        enter-active-class="relative transition-all duration-500 cus-in-out"
        enter-from-class="opacity-0 -left-[50px]"
        enter-to-class="opacity-100 left-0"
        leave-active-class="relative transition-all duration-500 cus-in-out"
        leave-from-class="opacity-100 left-0"
        leave-to-class="opacity-0 left-[50px]"
      >
        <keep-alive :max="3">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </el-card>
</template>

<style scoped>
:deep(.el-card__header) {
  position: relative;
  border-bottom: none;
}
:deep(.el-card__header::before) {
  display: block;
  position: absolute;
  top: 0;
  left: -4px;
  content: '';
  width: 8px;
  height: 65px;
  background-image: linear-gradient(180deg, #d0368a, #708ad4);
  border-radius: 4px;
}
</style>
