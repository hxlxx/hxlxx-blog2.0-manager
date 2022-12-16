<script setup lang="ts">
import type { ArticleCategory } from '@/types'
import { ref } from 'vue'

type Props = {
  categories: ArticleCategory[]
}

defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
const current = ref<ArticleCategory>()

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
        <template #header>
          <span>请选择分类</span>
        </template>
        <div class="flex gap-3">
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
