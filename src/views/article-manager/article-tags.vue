<script setup lang="ts">
import {
  createTag,
  getTagById,
  getTagList,
  removeTagById,
  removeTagByIds,
  updateTagById
} from '@/api'
import type { ArticleTag } from '@/types'
import { Confirm, Message } from '@/utils'
import type { Action } from 'element-plus'

const tagList = ref<ArticleTag[]>([])
const dialogVisible = ref<boolean>(false)
const tag = ref<ArticleTag>({ id: 0, tag_name: '' })
const memo = ref<string>('')
const isChanged = computed(() => memo.value !== tag.value.tag_name)
const tagName = ref<string>('')
const selectedItems = ref<ArticleTag[]>([])
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
    initTagList()
  }
  tagName.value = ''
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
// 提交修改
const handleSubmitTag = async () => {
  const { code } = (await updateTagById(tag.value!)) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: '更新文章分类成功！'
    })
    initTagList()
  }
  dialogVisible.value = false
}
// 确认删除
const handleConfirm = async (id: number) => {
  const { code } = (await removeTagById({ data: { id } })) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: '删除成功！'
    })
    initTagList()
  }
}
// 表格多选
const handleSelectionChange = (category: ArticleTag[]) => {
  selectedItems.value = category
}
// 删除所有选中项
const handleRemoveAllSelected = () => {
  const ids = selectedItems.value.map((item) => item.id)
  Confirm('是否确定删除选中项？', '批量删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const { code } = (await removeTagByIds({ data: { ids } })) || {}
      if (code === 200) {
        Message({
          type: 'success',
          message: '批量删除成功！'
        })
        initTagList()
      }
    })
    .catch((action: Action) => {
      Message({
        type: action === 'cancel' ? 'info' : 'success',
        message: action === 'cancel' ? '已取消删除' : '批量删除成功！'
      })
    })
}
</script>

<template>
  <div>
    <div class="flex mb-3">
      <el-button
        type="danger"
        :disabled="selectedItems.length === 0"
        @click="handleRemoveAllSelected"
      >
        <h-icon class="mr-1" icon="delete-three" />
        批量删除
      </el-button>
      <div class="flex ml-auto">
        <el-input placeholder="请输入标签名称" v-model="tagName" />
        <el-button
          type="primary"
          class="ml-3"
          :disabled="!tagName.trim()"
          @click="handleAddCategory"
        >
          <h-icon class="mr-1" icon="plus" />
          <span>添加标签</span>
        </el-button>
      </div>
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
      @selection-change="handleSelectionChange"
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
            plain
            type="primary"
            size="small"
            @click="handleOpenDialog(row.id)"
          >
            <h-icon class="mr-1" icon="edit" size="14px" />
            <span>编辑</span>
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
              <el-button plain type="danger" size="small">
                <h-icon class="mr-1" icon="delete" size="14px" />
                <span>删除</span>
              </el-button>
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
          <el-input v-model="tag.tag_name" />
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
