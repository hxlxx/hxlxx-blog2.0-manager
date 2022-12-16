<script setup lang="ts">
import { useMenuList } from '@/stores/menu'
import type { Menu } from '@/types'
import { ref, watch, onBeforeMount, computed } from 'vue'
import { useRoute } from 'vue-router'

const menuList = ref<Menu[]>([])

const route = useRoute()
const menuListStore = useMenuList()

const activePath = computed(() => {
  return route.meta.activePath ? route.meta.activePath : route.path
})

onBeforeMount(() => {
  menuListStore.getMenuList()
})

watch(
  () => menuListStore.menuList,
  (newVal) => {
    newVal.length && (menuList.value = newVal)
  }
)
</script>

<template>
  <div class="h-screen border-r scrollbar-custom">
    <el-menu
      :default-active="activePath"
      class="el-menu-vertical-demo border-none"
      router
    >
      <template v-for="(menu, index) in menuList" :key="menu.id">
        <el-sub-menu v-if="menu.subMenu?.length" :index="`${index + 1}`">
          <template #title>
            <i :class="['iconfont', `icon-${menu.icon}`, 'mx-1']"></i>
            {{ menu.title }}
          </template>
          <el-menu-item
            v-for="subMenu in menu.subMenu"
            :key="subMenu.id"
            :index="subMenu.path"
            :route="subMenu.path"
          >
            <i :class="['iconfont', `icon-${subMenu.icon}`, 'mx-1']"></i>
            {{ subMenu.title }}
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="menu.path" :route="menu.path">
          <i :class="['iconfont', `icon-${menu.icon}`, 'mx-1']"></i>
          {{ menu.title }}
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
