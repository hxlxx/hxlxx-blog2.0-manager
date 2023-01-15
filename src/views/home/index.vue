<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import TagCloud from 'TagCloud'
import { getTagList, getSiteInfo } from '@/api'

const containerRef = ref<HTMLElement>()

onBeforeMount(() => {
  initTagList()
})

const initTagList = async () => {
  const { data: tagList } = (await getTagList()) || {}
  const tags = tagList?.res.map((item: any) => item.tag_name)
  TagCloud(containerRef.value!, tags, { useContainerInlineStyles: false })
  const { data: siteInfo } = (await getSiteInfo()) || {}
  console.log(siteInfo)
}
</script>

<template>
  <div>
    <div class="flex justify-around py-5 text-center">
      <div class="w-[300px] h-[100px] bg-cyan-500">
        <header>访问数量</header>
        <section>9999</section>
      </div>
      <div class="w-[300px] h-[100px] bg-cyan-500">
        <header>用户数量</header>
        <section>9999</section>
      </div>
      <div class="w-[300px] h-[100px] bg-cyan-500">
        <header>文章数量</header>
        <section>9999</section>
      </div>
      <div class="w-[300px] h-[100px] bg-cyan-500">
        <header>评论数量</header>
        <section>9999</section>
      </div>
    </div>
    <div class="flex justify-around text-center">
      <div>
        <header class="">文章分类</header>
        <div class="w-[300px] h-[300px] bg-indigo-300"></div>
      </div>
      <div>
        <header>文章标签</header>
        <div ref="containerRef"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.tagcloud) {
  position: relative;
  width: 300px;
  height: 300px;
}
:deep(.tagcloud--item) {
  color: #d0368a;
}
</style>
