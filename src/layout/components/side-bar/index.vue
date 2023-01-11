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
  <div>
    <el-menu
      router
      mode="vertical"
      :default-active="activePath"
      :collapse="menuStore.collapse"
    >
      <template v-for="(menu, index) in menuList" :key="menu.id">
        <el-sub-menu v-if="menu.children?.length" :index="`${index + 1}`">
          <template #title>
            <i class="flex">
              <h-icon class="mr-1.5" :icon="menu.icon" size="20px" />
            </i>
            <span class="pr-5">{{ menu.label }}</span>
          </template>
          <el-menu-item
            v-for="subMenu in menu.children"
            :key="subMenu.id"
            :index="subMenu.path"
            :route="subMenu.path"
          >
            <h-icon class="mr-1.5" :icon="subMenu.icon" size="20px" />
            <template #title>
              <span class="pr-5">{{ subMenu.label }}</span>
            </template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="menu.path" :route="menu.path">
          <h-icon class="mr-1.5" :icon="menu.icon" size="20px" />
          <template #title>
            <span class="pr-5">{{ menu.label }}</span>
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
