<script setup lang="ts">
import type { Comment, QueryInfo } from '@/types'
import { getCommentList, removeCommentById, removeCommentByIds } from '@/api'
import { Confirm, Message } from '@/utils'
import type { Action } from 'element-plus'

const loading = ref<boolean>(false)
const commentList = ref<Comment[]>()
const query = reactive<QueryInfo>({
  skip: 0,
  limit: 10,
  page: 1,
  total: 0
})
const selectedItems = ref<Comment[]>([])

onBeforeMount(() => {
  initCommentList(query)
})

const initCommentList = async (query: QueryInfo) => {
  loading.value = true
  const { data } =
    (await getCommentList({
      skip: (query.page! - 1) * query.limit!,
      limit: query.limit
    })) || {}
  commentList.value = data.res
  query.total = data.count
  loading.value = false
}
// 切换分页
const handleCurrentChange = () => {
  initCommentList(query)
}
// 删除评论
const handleConfirm = async (id: number) => {
  const { code } = (await removeCommentById({ data: { id } })) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: '删除成功！'
    })
    query.page = 1
    initCommentList(query)
  }
}
// 表格多选
const handleSelectionChange = (comments: Comment[]) => {
  selectedItems.value = comments
}
// 删除所有选中项
const handleRemoveAllSelected = () => {
  const ids = selectedItems.value.map((item) => item.id)
  Confirm('是否确定删除选中项？', '批量删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const { code } = (await removeCommentByIds({ data: { ids } })) || {}
      if (code === 200) {
        Message({
          type: 'success',
          message: '批量删除成功！'
        })
        query.page = 1
        initCommentList(query)
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
    </div>
    <el-table
      border
      v-loading="loading"
      :data="commentList"
      :header-cell-style="{
        color: '#606266',
        'text-align': 'center'
      }"
      :cell-style="{ 'text-align': 'center' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="用户名" width="200px">
        <template #default="{ row }">
          <span>{{ row.user.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="120px">
        <template #default="{ row }">
          <el-image
            style="width: 80px; height: 80px; border-radius: 5px"
            :src="row.user.avatar_url"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="回复" width="200px">
        <template #default="{ row }">
          <span v-if="row.reply_to">{{ row.reply_to }}</span>
          <span v-else class="text-gray-300">Null</span>
        </template>
      </el-table-column>
      <el-table-column label="文章id" width="150px">
        <template #default="{ row }">
          <span v-if="row.aid">{{ row.aid }}</span>
          <span v-else class="text-gray-300">Null</span>
        </template>
      </el-table-column>
      <el-table-column label="评论内容" prop="content" />
      <el-table-column label="评论时间" width="160px">
        <template #default="{ row }">
          <h-icon icon="time" />
          {{ dateFormat(row.created_at).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template #default="{ row }">
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
    <div class="w-full flex justify-center mt-3">
      <el-pagination
        v-model:current-page="query.page"
        background
        layout="prev, pager, next, total"
        :pager-count="5"
        :page-size="query.limit"
        :total="query.total"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
