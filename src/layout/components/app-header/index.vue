<script setup lang="ts">
import { useNavTags } from '@/stores/nav-tags'
import type { NavTag } from '@/types/store/nav-tags'
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const navTagStore = useNavTags()
const router = useRouter()

const tags = ref<NavTag[]>([])

onMounted(() => {
  tags.value = navTagStore.navTags
})

watch(
  () => navTagStore.navTags,
  (newVal) => {
    tags.value = newVal
  }
)

// 关闭标签
const handleCloseTag = (tag: NavTag, index: number) => {
  navTagStore.removeNavTag(tag.id, tag.active)
  if (tag.active && index > 0) {
    const path = tags.value[index - 1].path
    router.push({ path })
  }
}

// 点击标签，切换路由
const handleClickTag = (tag: NavTag) => {
  navTagStore.setCurrentNavTag(tag.id)
  router.push({ path: tag.path })
}
</script>

<template>
  <div class="">
    <h1>header</h1>
    <div class="nav-tags">
      <el-tag
        class="mx-1"
        type="success"
        effect="dark"
        :closable="index > 0"
        v-for="(tag, index) in tags"
        :key="tag.id"
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
    </div>
  </div>
</template>
