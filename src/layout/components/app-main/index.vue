<script setup lang="ts">
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
        <component :is="Component" />
      </transition>
    </router-view>
  </el-card>
</template>

<style>
.el-card__header {
  position: relative;
  border-bottom: none;
}
.el-card__header::before {
  display: block;
  position: absolute;
  top: 0;
  left: -4px;
  content: '';
  width: 8px;
  height: 65px;
  background-image: linear-gradient(
    180deg,
    var(--second-bg-color),
    var(--primary-bg-color)
  );
  border-radius: 4px;
}
</style>
