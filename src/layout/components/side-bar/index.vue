<script setup lang="ts">
import { getMenuList } from '@/api'
import type { Menu } from '@/types'
import { ref, onBeforeMount, computed } from 'vue'
import { useRoute } from 'vue-router'
import { formatDataTree } from '@/utils'
import { useMenu } from '@/stores'

const route = useRoute()
const menuStore = useMenu()

const menuList = ref<Menu[]>([])

const activePath = computed(() => {
  return route.meta.activePath ? route.meta.activePath : route.path
})

onBeforeMount(() => {
  initMenuList()
})

const initMenuList = async () => {
  const { data } = (await getMenuList()) || {}
  menuList.value = formatDataTree(data)
}
</script>

<template>
  <div class="h-screen border-r scrollbar-custom">
    <el-menu
      mode="vertical"
      router
      :default-active="activePath"
      :collapse="menuStore.collapse"
    >
      <template v-for="(menu, index) in menuList" :key="menu.id">
        <el-sub-menu v-if="menu.children?.length" :index="`${index + 1}`">
          <template #title>
            <i :class="['iconfont', `icon-${menu.icon}`, 'mx-1']"></i>
            <span>{{ menu.label }}</span>
          </template>
          <el-menu-item
            v-for="subMenu in menu.children"
            :key="subMenu.id"
            :index="subMenu.path"
            :route="subMenu.path"
          >
            <template #title>
              <i :class="['iconfont', `icon-${subMenu.icon}`, 'mx-1']"></i>
              <span>{{ subMenu.label }}</span>
            </template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="menu.path" :route="menu.path">
          <i :class="['iconfont', `icon-${menu.icon}`, 'mx-1']"></i>
          <template #title>
            <span>{{ menu.label }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style scoped>
:deep(.el-menu) {
  border: none;
}
</style>
