<script setup lang="ts">
import { useArticle, useMenu, useNavTags, useUser } from '@/stores'
import type { RouteRecord } from 'vue-router'
import type { NavTag, User } from '@/types'
import { logout } from '@/utils'

const router = useRouter()
const route = useRoute()
const userStore = useUser()
const navTagStore = useNavTags()
const menuStore = useMenu()
const articleStore = useArticle()

const tags = ref<NavTag[]>([])
const breadcrumbs = ref<RouteRecord[]>([])
const user = ref<User>({} as User)

onBeforeMount(() => {
  tags.value = navTagStore.navTags
  user.value = userStore.getUser()
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
      breadcrumbs.value = route.matched.filter((route) => route.meta.title)
    } else {
      breadcrumbs.value = []
    }
    const tag = { tag_name: route.meta.title, path: route.path, active: true }
    navTagStore.setNavTag(tag)
  }
)

// 折叠菜单
const handleCollapseMenu = () => {
  menuStore.setMenuCollapse(!menuStore.collapse)
}
// 关闭标签
const handleCloseTag = (tag: NavTag, index: number) => {
  const reg = /article\/(\w+)$/
  const res = tag.path.match(reg)
  if (res) {
    const id = res[1]
    articleStore.clearArticleById(id)
  }
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
  articleStore.clearArticle()
  router.push({ path: '/' })
}
// 用户中心
const handleToUserCenter = () => {
  router.push({ path: '/user-center' })
}
// 退出登录
const handleLogout = () => {
  logout()
  router.push({ path: '/login' })
}
</script>

<template>
  <el-page-header class="py-1 px-2">
    <template #breadcrumb>
      <div class="flex items-center pl-1">
        <div
          class="flex items-center mr-3 cursor-pointer"
          @click="handleCollapseMenu"
        >
          <h-icon v-if="menuStore.collapse" icon="menu-fold-one" size="20px" />
          <h-icon v-else icon="menu-unfold-one" size="20px" />
        </div>
        <el-breadcrumb separator="/" class="text-lg">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="route in breadcrumbs" :key="route.path">
            {{ route.meta.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="ml-[auto] mr-3 flex gap-4 items-center">
          <span>{{ user.username }}</span>
          <toggle-theme />
          <full-screen />
          <el-dropdown>
            <el-avatar
              class="transition-all duration-200 hover:shadow-[0_0_5px_#333]"
              :size="40"
              :src="user.avatar_url"
            />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleToUserCenter">
                  用户中心
                </el-dropdown-item>
                <el-dropdown-item @click="handleLogout">
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </template>
  </el-page-header>
  <div
    class="flex flex-wrap items-center py-1 px-2 border-t border-b-[#dcdfe6]"
  >
    <el-tag
      class="mx-1 my-[1px]"
      type="success"
      v-for="(tag, index) in tags"
      :key="tag.path"
      :closable="index > 0"
      :effect="tag.active ? 'dark' : 'plain'"
      @close="handleCloseTag(tag, index)"
      @click="handleClickTag(tag)"
    >
      <div class="tag-content relative px-2 hover:cursor-pointer">
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
    <el-button class="ml-[auto]" size="small" @click="handleCloseAllNavTag">
      关闭全部
    </el-button>
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
