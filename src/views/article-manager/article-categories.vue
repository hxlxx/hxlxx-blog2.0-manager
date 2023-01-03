<script setup lang="ts">
import {
  createCategory,
  getCategoryById,
  getCategoryList,
  removeCategoryById,
  updateCategoryById
} from '@/api'
import type { ArticleCategory } from '@/types'
import { Message } from '@/utils'
import { onBeforeMount, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const categoryList = ref<ArticleCategory[]>([])
const dialogVisible = ref<boolean>(false)
const category = ref<ArticleCategory>({ id: 0, category_name: '' })
const memo = ref<string>('')
const isChanged = ref<boolean>(false)
const categoryName = ref<string>('')

onBeforeMount(() => {
  initCategoryList()
})
// 初始化分类列表
const initCategoryList = async () => {
  const { data } = (await getCategoryList()) || {}
  categoryList.value = data.res
}
// 添加分类
const handleAddCategory = async () => {
  const { code } = await createCategory(categoryName.value)
  if (code === 200) {
    Message({
      type: 'success',
      message: '新建文章分类成功！'
    })
    categoryName.value = ''
    initCategoryList()
  }
}
// 关闭对话框
const handleCloseDialog = () => {
  dialogVisible.value = false
}
// 打开对话框
const handleOpenDialog = async (id: number) => {
  dialogVisible.value = true
  const { data } = await getCategoryById(id)
  category.value = data
  memo.value = category.value.category_name
}
// 判断输入框内容是否变化
const handleInput = () => {
  isChanged.value = memo.value !== category.value.category_name
}
// 提交修改
const handleSubmitCategory = async () => {
  const { code } = await updateCategoryById(category.value!)
  if (code === 200) {
    dialogVisible.value = false
    Message({
      type: 'success',
      message: '更新文章分类成功！'
    })
    initCategoryList()
  }
}
// 确认删除
const handleConfirm = async (id: number) => {
  const { code } = await removeCategoryById(id)
  if (code === 200) {
    Message({
      type: 'success',
      message: '删除成功！'
    })
    initCategoryList()
  }
}
</script>

<template>
  <div>
    <div class="w-80 flex mb-3">
      <el-input placeholder="请输入分类名称" v-model="categoryName" />
      <el-button
        type="primary"
        class="ml-3"
        :disabled="!categoryName.length"
        @click="handleAddCategory"
      >
        <el-icon><Plus /></el-icon>
        <span>添加分类</span>
      </el-button>
    </div>
    <el-table
      border
      :data="categoryList"
      :header-cell-style="{
        color: '#606266',
        'text-align': 'center'
      }"
      :cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="分类名称">
        <template #default="{ row }">
          <el-tag size="large" class="text-sm">{{ row.category_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="handleOpenDialog(row.id)"
          >
            编辑
          </el-button>
          <el-popconfirm
            title="是否确认删除？"
            confirm-button-text="确认"
            cancel-button-text="取消"
            confirm-button-type="danger"
            cancel-button-type="info"
            @confirm="handleConfirm(row.id)"
            @cancel="Message({ type: 'info', message: '取消删除' })"
          >
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogVisible"
      title="编辑分类"
      width="30%"
      :before-close="handleCloseDialog"
    >
      <el-form label-width="80px">
        <el-form-item label="文章分类">
          <el-input v-model="category.category_name" @input="handleInput" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSubmitCategory"
            :disabled="!isChanged"
          >
            确认修改
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
