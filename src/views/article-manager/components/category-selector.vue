<script setup lang="ts">
import type { ArticleCategory } from '@/types'

type Props = {
  categories: ArticleCategory[]
  selected?: ArticleCategory
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const current = ref<ArticleCategory | null>()

onBeforeMount(() => {
  if (props.selected) {
    current.value = props.selected
    emit('update:modelValue', props.selected.id)
  }
})

// 选择分类
const handleSelectCategory = (category: ArticleCategory) => {
  const isExist = current.value?.id === category.id
  if (isExist) return
  current.value = category
  emit('update:modelValue', current.value?.id)
}
// 删除分类
const handleRemoveCategory = () => {
  current.value = undefined
  emit('update:modelValue', 0)
}
</script>

<template>
  <div>
    <div class="flex gap-3 mr-3" v-if="current">
      <el-tag
        class="text-sm"
        size="large"
        closable
        @close="handleRemoveCategory"
      >
        {{ current.category_name }}
      </el-tag>
    </div>
    <el-popover
      placement="bottom-start"
      trigger="click"
      :width="360"
      :hide-after="0"
      v-if="!current"
    >
      <el-card shadow="never" class="border-0">
        <span class="text-[18px] inline-block mb-5">请选择分类</span>
        <div class="flex gap-3 flex-wrap">
          <el-tag
            size="large"
            class="text-sm cursor-pointer"
            v-for="category in categories"
            :key="category.id"
            @click="handleSelectCategory(category)"
          >
            {{ category.category_name }}
          </el-tag>
        </div>
      </el-card>
      <template #reference>
        <el-button type="primary" plain> 选择分类 </el-button>
      </template>
    </el-popover>
  </div>
</template>
