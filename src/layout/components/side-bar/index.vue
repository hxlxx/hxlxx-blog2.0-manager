<script setup lang="ts">
import { useMenuList } from '@/stores/menu'
import { useNavTags } from '@/stores/nav-tags'
import type { Menu } from '@/types/store/menu'
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const menuList = ref<Menu[]>([])

const route = useRoute()
const navTagStore = useNavTags()
const menuListStore = useMenuList()

const activePath = computed(() => {
  return route.meta.activePath ? route.meta.activePath : route.path
})

onMounted(() => {
  menuListStore.getMenuList()
  navTagStore.initNavTag()
})

watch(
  () => menuListStore.menuList,
  (newVal) => {
    newVal.length && (menuList.value = newVal)
  }
)

const handleClickMenuItem = ({ id, title, path }: Menu) => {
  const tag = { id, tag_name: title, path: path as string, active: true }
  navTagStore.setNavTag(tag)
}
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
            @click="handleClickMenuItem(subMenu)"
          >
            <i :class="['iconfont', `icon-${subMenu.icon}`, 'mx-1']"></i>
            {{ subMenu.title }}
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item
          v-else
          :index="menu.path"
          :route="menu.path"
          @click="handleClickMenuItem(menu)"
        >
          <i :class="['iconfont', `icon-${menu.icon}`, 'mx-1']"></i>
          {{ menu.title }}
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
