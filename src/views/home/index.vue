<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import TagCloud from 'TagCloud'
import { getTagList, getSiteInfo, getArticleTopFive } from '@/api'
import { echarts } from '@/utils'
import type { EchartsData } from '@/types'

const containerRef = ref<HTMLElement>()
const echartRef = ref<HTMLElement>()
const viewTimes = ref<number>(0)
const userCount = ref<number>(0)
const articleCount = ref<number>(0)
const articleCategoryCount = ref<any[]>([])
const getPieOption = (data: EchartsData[]) => ({
  title: {
    text: '文章分类统计',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    left: 'center',
    top: 'bottom'
  },
  series: [
    {
      name: '文章分类',
      type: 'pie',
      radius: [20, 100],
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 5
      },
      data
    }
  ]
})
const getBarOption = (xData: string[], seriesData: number[]) => ({
  xAxis: {
    type: 'category',
    data: xData
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      type: 'bar',
      data: seriesData
    }
  ]
})

onBeforeMount(() => {
  initTagList()
  initSiteInfo()
  initArticleTopFive()
})

// 标签云
const initTagList = async () => {
  const { data: tagList } = (await getTagList()) || {}
  const tags = tagList?.res.map((item: any) => item.tag_name)
  TagCloud(containerRef.value!, tags, { useContainerInlineStyles: false })
}
// 网站信息
const initSiteInfo = async () => {
  const { data: siteInfo } = (await getSiteInfo()) || {}
  viewTimes.value = siteInfo.viewTimes
  userCount.value = siteInfo.userCount
  articleCount.value = siteInfo.articleCount
  articleCategoryCount.value = siteInfo.articleCategoryCount
  initChart()
}
// 初始化饼图
const initChart = () => {
  const categoryChart = echarts.init(echartRef.value!)
  const data = articleCategoryCount.value.map((item) => ({
    value: item.article_count,
    name: item.category_name
  })) as EchartsData[]
  categoryChart.setOption(getPieOption(data))
}
// 初始化访问量前五的文章
const initArticleTopFive = async () => {
  const { data } = (await getArticleTopFive()) || {}
  console.log(data)
}
</script>

<template>
  <div>
    <div class="flex justify-between p-5 mb-10 text-center font-semibold">
      <div class="w-[360px] h-[120px] site-info-card">
        <h-icon icon="rss" size="60px" />
        <div>
          <span class="text-xl">访问数量</span>
          <div class="text-lg">{{ viewTimes }}</div>
        </div>
      </div>
      <div class="w-[360px] h-[120px] site-info-card">
        <h-icon icon="every-user" size="60px" />
        <div>
          <span class="text-xl">用户数量</span>
          <div class="text-lg">{{ userCount }}</div>
        </div>
      </div>
      <div class="w-[360px] h-[120px] site-info-card">
        <h-icon icon="copy-one" size="60px" />
        <div>
          <span class="text-xl">文章数量</span>
          <div class="text-lg">{{ articleCount }}</div>
        </div>
      </div>
      <div class="w-[360px] h-[120px] site-info-card">
        <h-icon icon="comments" size="60px" />
        <div>
          <span class="text-xl">评论数量</span>
          <div class="text-lg">9999</div>
        </div>
      </div>
    </div>
    <div class="flex justify-around text-center">
      <div ref="echartRef" class="w-[400px] h-[300px]"></div>
      <div>
        <span class="text-lg font-bold">文章标签</span>
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
