<script setup lang="ts">
import TagCloud from 'TagCloud'
import { getTagList, getSiteInfo, getArticleTopFive } from '@/api'
import { echarts } from '@/utils'
import type { EchartsData } from '@/types'

const containerRef = ref<HTMLElement>()
const weeklyViewChartRef = ref<HTMLElement>()
const categoryChartRef = ref<HTMLElement>()
const topFiveChartRef = ref<HTMLElement>()
const viewTimes = ref<number>(0)
const userCount = ref<number>(0)
const articleCount = ref<number>(0)
const getPieOption = (data: EchartsData[]) => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    left: 'center',
    top: 'bottom',
    textStyle: {
      textBorderType: 'solid',
      textBorderWidth: 1,
      textBorderColor: '#fff',
      fontSize: 16
    }
  },
  label: {
    fontSize: 16
  },
  series: [
    {
      name: '文章分类统计',
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
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: xData,
    axisTick: {
      alignWithLabel: true
    },
    axisLabel: {
      textBorderType: 'line',
      textBorderWidth: 1,
      textBorderColor: '#fff',
      fontSize: 16
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '浏览量排行',
      type: 'bar',
      barWidth: '40%',
      data: seriesData
    }
  ]
})
const getLineOption = (xData: string[], seriesData: number[]) => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: xData,
    axisTick: {
      alignWithLabel: true
    },
    axisLabel: {
      textBorderType: 'line',
      textBorderWidth: 1,
      textBorderColor: '#fff',
      fontSize: 16
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: seriesData,
      type: 'line',
      smooth: true
    }
  ]
})

onBeforeMount(() => {
  initSiteInfo()
  initTagList()
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
  const { data } = (await getSiteInfo()) || {}
  viewTimes.value = data.viewTimes
  userCount.value = data.userCount
  articleCount.value = data.articleCount
  initWeeklyViewChart(data.weeklyViewTimes)
  initCategoryChart(data.articleCategoryCount)
}
// 初始化周访问量图表
const initWeeklyViewChart = (weeklyViewTimes: any[]) => {
  const viewTimesChart = echarts.init(weeklyViewChartRef.value!)
  const { xData, seriesData } = weeklyViewTimes.reduce(
    (memo, cur) => {
      memo.xData.push(cur.date)
      memo.seriesData.push(cur.count)
      return memo
    },
    {
      xData: [],
      seriesData: []
    }
  )
  viewTimesChart.setOption(getLineOption(xData, seriesData))
}
// 初始化分类图表
const initCategoryChart = (articleCategoryCount: any[]) => {
  const categoryChart = echarts.init(categoryChartRef.value!)
  const data = articleCategoryCount.map((item) => ({
    value: item.article_count,
    name: item.category_name
  })) as EchartsData[]
  categoryChart.setOption(getPieOption(data))
}
// 初始化访问量前五的文章
const initArticleTopFive = async () => {
  const { data } = (await getArticleTopFive()) || {}
  initTopFiveChart(data)
}
// 初始化top5图表
const initTopFiveChart = (topFive: any[]) => {
  const topFiveChart = echarts.init(topFiveChartRef.value!)
  const { xData, seriesData } = topFive.reduce(
    (memo, cur) => {
      memo.xData.push(
        cur.title.length >= 10 ? cur.title.slice(0, 9) + '...' : cur.title
      )
      memo.seriesData.push(cur.view_times)
      return memo
    },
    { xData: [], seriesData: [] }
  )
  topFiveChart.setOption(getBarOption(xData, seriesData))
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
    <div
      class="mb-[20px] pt-[15px] text-center rounded-[10px] shadow-round-lg dark:shadow-round-lg-dark"
    >
      <span class="text-lg font-bold">一周访问量</span>
      <div ref="weeklyViewChartRef" class="w-full h-[400px]"></div>
    </div>
    <div
      class="mb-[20px] pt-[15px] text-center rounded-[10px] shadow-round-lg dark:shadow-round-lg-dark"
    >
      <span class="text-lg font-bold">文章访问量排行</span>
      <div ref="topFiveChartRef" class="w-full h-[600px]"></div>
    </div>
    <div class="flex justify-between text-center">
      <div
        class="w-[49%] h-[328px] py-[15px] rounded-[10px] shadow-round-lg dark:shadow-round-lg-dark box-content"
      >
        <span class="text-lg font-bold">文章分类统计</span>
        <div ref="categoryChartRef" class="w-full h-[300px]"></div>
      </div>
      <div
        class="w-[49%] py-[15px] rounded-[10px] shadow-round-lg dark:shadow-round-lg-dark"
      >
        <span class="text-lg font-bold">文章标签</span>
        <div ref="containerRef" class="flex justify-center items-center"></div>
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
