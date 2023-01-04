<script setup lang="ts">
import {
  createTag,
  getTagById,
  getTagList,
  removeTagById,
  updateTagById
} from '@/api'
import type { ArticleTag } from '@/types'
import { Message } from '@/utils'
import { onBeforeMount, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const tagList = ref<ArticleTag[]>([])
const dialogVisible = ref<boolean>(false)
const tag = ref<ArticleTag>({ id: 0, tag_name: '' })
const memo = ref<string>('')
const isChanged = ref<boolean>(false)
const tagName = ref<string>('')
const loading = ref<boolean>(false)

onBeforeMount(() => {
  initTagList()
})
// 初始化分类列表
const initTagList = async () => {
  loading.value = true
  const { data } = (await getTagList()) || {}
  tagList.value = data.res
  loading.value = false
}
// 添加分类
const handleAddCategory = async () => {
  const { code } = (await createTag(tagName.value)) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: '新建文章标签成功！'
    })
    tagName.value = ''
    initTagList()
  }
}
// 关闭对话框
const handleCloseDialog = () => {
  dialogVisible.value = false
}
// 打开对话框
const handleOpenDialog = async (id: number) => {
  dialogVisible.value = true
  const { data } = await getTagById(id)
  tag.value = data
  memo.value = tag.value.tag_name
}
// 判断输入框内容是否变化
const handleInput = () => {
  isChanged.value = memo.value !== tag.value.tag_name
}
// 提交修改
const handleSubmitTag = async () => {
  const { code } = await updateTagById(tag.value!)
  if (code === 200) {
    dialogVisible.value = false
    Message({
      type: 'success',
      message: '更新文章分类成功！'
    })
    initTagList()
  }
}
// 确认删除
const handleConfirm = async (id: number) => {
  const { code } = await removeTagById(id)
  if (code === 200) {
    Message({
      type: 'success',
      message: '删除成功！'
    })
    initTagList()
  }
}
</script>

<template>
  <div>
    <div class="w-80 flex mb-3">
      <el-input placeholder="请输入标签名称" v-model="tagName" />
      <el-button
        type="primary"
        class="ml-3"
        :disabled="!tagName.length"
        @click="handleAddCategory"
      >
        <el-icon><Plus /></el-icon>
        <span>添加标签</span>
      </el-button>
    </div>
    <el-table
      border
      v-loading="loading"
      :data="tagList"
      :header-cell-style="{
        color: '#606266',
        'text-align': 'center'
      }"
      :cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="标签名称">
        <template #default="{ row }">
          <el-tag class="text-sm" type="success" size="large">
            {{ row.tag_name }}
          </el-tag>
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
      title="编辑标签"
      width="30%"
      :before-close="handleCloseDialog"
    >
      <el-form label-width="80px">
        <el-form-item label="文章标签">
          <el-input v-model="tag.tag_name" @input="handleInput" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSubmitTag"
            :disabled="!isChanged"
          >
            确认修改
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
