<script setup lang="ts">
import { IconPark } from '@icon-park/vue-next/es/all'

type Props = {
  // 图标名称
  icon: string
  // 主题
  theme?: 'outline' | 'filled' | 'two-tone' | 'multi-color'
  // 尺寸
  size?: number | string
  // 带旋转动画的图标
  spin?: boolean
  // 填充
  fill?: string | string[]
  // stroke-linecap 属性
  strokeLinecap?: 'butt' | 'round' | 'square'
  // stroke-linejoin 属性
  strokeLinejoin?: 'miter' | 'round' | 'bevel'
  // stroke-width 属性
  strokeWidth?: number
}

withDefaults(defineProps<Props>(), {
  strokeWidth: 3
})
</script>

<template>
  <icon-park
    :type="icon"
    :theme="theme"
    :size="size"
    :spin="spin"
    :fill="fill"
    :stroke-linecap="strokeLinecap"
    :stroke-linejoin="strokeLinejoin"
    :stroke-width="strokeWidth"
  />
</template>
