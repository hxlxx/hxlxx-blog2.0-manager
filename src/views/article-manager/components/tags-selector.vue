<script setup lang="ts">
import type { ArticleTag } from '@/types'
import { ref, onBeforeMount } from 'vue'

type Props = {
  tags: ArticleTag[]
  selected?: ArticleTag[]
  modelValue: any[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const current = ref<any[]>([])

onBeforeMount(() => {
  if (props.selected) {
    current.value = props.selected.map((item) => ({
      id: item.id,
      label: item.tag_name
    }))
    // 渲染时需要主动触发一次变量绑定
    emit(
      'update:modelValue',
      props.selected.map((item) => item.id)
    )
  }
})

const handleSelectTag = (tag: ArticleTag) => {
  emit('update:modelValue', tag)
}
</script>

<template>
  <el-select
    v-model="current"
    value-key="id"
    style="width: 200px"
    multiple
    filterable
    collapse-tags
    collapse-tags-tooltip
    placeholder="请选择标签(最多三个)"
    tag-type="success"
    :multiple-limit="3"
    @change="handleSelectTag"
  >
    <el-option
      v-for="tag in tags"
      :key="tag.id"
      :label="tag.tag_name"
      :value="tag.id"
    />
  </el-select>
</template>
