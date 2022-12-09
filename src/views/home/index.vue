<script setup lang="ts">
import { onMounted } from 'vue'
import { useNavTags } from '@/stores/nav-tags'
const navTagStore = useNavTags()
onMounted(() => {
  navTagStore.setNavTag({
    id: 1,
    path: '/',
    tag_name: '首页',
    active: true
  })
})
</script>

<template>
  <div class="">
    <h1>home</h1>
  </div>
</template>
