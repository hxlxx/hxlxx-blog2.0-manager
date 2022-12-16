<script setup lang="ts">
import { useNavTags } from '@/stores'
import type { NavTag } from '@/types'
import { clearToken } from '@/utils'
import { ref, watch, onBeforeMount } from 'vue'
import { useRouter, useRoute, type RouteRecord } from 'vue-router'

const navTagStore = useNavTags()
const router = useRouter()
const route = useRoute()

const tags = ref<NavTag[]>([])
const breadcrumbs = ref<RouteRecord[]>([])

onBeforeMount(() => {
  tags.value = navTagStore.navTags
  navTagStore.initNavTag()
})

watch(
  () => navTagStore.navTags,
  (newVal) => {
    tags.value = newVal
  }
)
watch(
  () => route.path,
  (newVal) => {
    if (newVal !== '/home') {
      breadcrumbs.value = route.matched
    } else {
      breadcrumbs.value = []
    }
    const tag = { tag_name: route.meta.title!, path: route.path, active: true }
    navTagStore.setNavTag(tag)
  }
)
// 关闭标签
const handleCloseTag = (tag: NavTag, index: number) => {
  navTagStore.removeNavTag(tag.path, tag.active)
  if (tag.active && index > 0) {
    const path = tags.value[index - 1].path
    router.push({ path })
  }
}
// 点击标签，切换路由
const handleClickTag = (tag: NavTag) => {
  navTagStore.setCurrentNavTag(tag.path)
  router.push({ path: tag.path })
}
// 关闭所有标签
const handleCloseAllNavTag = () => {
  navTagStore.initNavTag()
  router.push({ path: '/' })
}
// 用户中心
const handleToUserCenter = () => {
  router.push({ path: '/user-center' })
}
// 退出登录
const handleLogout = () => {
  clearToken()
  router.push({ path: '/login' })
}
</script>

<template>
  <el-page-header class="py-1">
    <template #breadcrumb>
      <div class="flex items-center pl-1">
        <el-breadcrumb separator="/" class="text-lg">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="route in breadcrumbs" :key="route.path">
            {{ route.meta.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown class="ml-[auto]">
          <el-avatar
            class="mr-3"
            :size="40"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleToUserCenter"
                >用户中心</el-dropdown-item
              >
              <el-dropdown-item @click="handleLogout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
  </el-page-header>
  <div class="flex items-center py-1 border-t border-b-[#dcdfe6]">
    <el-tag
      class="mx-1"
      type="success"
      effect="dark"
      :closable="index > 0"
      v-for="(tag, index) in tags"
      :key="tag.path"
      @close="handleCloseTag(tag, index)"
      @click="handleClickTag(tag)"
    >
      <div
        class="tag-content relative px-2 hover:cursor-pointer hover:text-gray-200"
      >
        <transition
          appear
          enter-active-class="transition-all duration-1000 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-all duration-1000 ease-out"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <span
            class="block rounded-full bg-green-700 w-2 h-2 absolute top-[50%] left-[-3px] translate-y-[-50%]"
            v-if="tag.active"
          ></span>
        </transition>
        {{ tag.tag_name }}
      </div>
    </el-tag>
    <el-button class="ml-[auto]" size="small" @click="handleCloseAllNavTag"
      >关闭全部</el-button
    >
  </div>
</template>

<style scoped>
:deep(.el-page-header__header) {
  display: none;
}
:deep(.el-page-header__breadcrumb) {
  margin: 0;
}
</style>
