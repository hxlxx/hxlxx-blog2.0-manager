<script setup lang="ts">
import { onBeforeMount, ref, reactive } from 'vue'
import {
  getOperationLog,
  removeOperationLogById,
  removeOperationLogByIds
} from '@/api'
import { Confirm, Message } from '@/utils'
import type { OperationLog, QueryInfo } from '@/types'
import type { Action } from 'element-plus'

const logList = ref<OperationLog[]>([])
const loading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)
const logDetail = ref<OperationLog>()
const query = reactive<QueryInfo>({
  skip: 0,
  limit: 10,
  page: 1,
  total: 0
})
const selectedItems = ref<OperationLog[]>([])
const tag_type = (type: string) => {
  switch (type) {
    case 'POST':
      return 'success'
    case 'PATCH':
      return 'warning'
    case 'DELETE':
      return 'danger'
    default:
      return ''
  }
}

onBeforeMount(() => {
  initLogList()
})

const initLogList = async () => {
  loading.value = true
  const { data } =
    (await getOperationLog({
      skip: (query.page! - 1) * query.limit!,
      limit: query.limit
    })) || {}
  logList.value = data?.res
  query.total = data?.count
  loading.value = false
}
// 表格多选
const handleSelectionChange = (logs: OperationLog[]) => {
  selectedItems.value = logs
}
// 查看详情
const handleOpenDetail = (log: OperationLog) => {
  dialogVisible.value = true
  logDetail.value = log
}
// 确认删除
const handleConfirm = async (id: number) => {
  const { code } = (await removeOperationLogById({ data: { id } })) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: '删除日志成功！'
    })
    initLogList()
  }
}
// 删除所有选中项
const handleRemoveAllSelected = () => {
  const ids = selectedItems.value.map((item) => item.id)
  Confirm('是否确定删除选中项？', '批量删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const { code } = (await removeOperationLogByIds({ data: { ids } })) || {}
      if (code === 200) {
        Message({
          type: 'success',
          message: '批量删除成功！'
        })
        initLogList()
      }
    })
    .catch((action: Action) => {
      Message({
        type: action === 'cancel' ? 'info' : 'success',
        message: action === 'cancel' ? '已取消删除' : '批量删除成功！'
      })
    })
}
// 分页
const handleCurrentChange = () => {
  initLogList()
}
</script>

<template>
  <div>
    <el-button
      class="mb-3"
      type="danger"
      :disabled="selectedItems.length === 0"
      @click="handleRemoveAllSelected"
    >
      <h-icon class="mr-1" icon="delete-three" />
      批量删除
    </el-button>
    <el-table
      border
      v-loading="loading"
      :data="logList"
      :header-cell-style="{
        color: '#606266',
        'text-align': 'center'
      }"
      :cell-style="{ 'text-align': 'center' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column label="操作用户" prop="username" />
      <el-table-column label="用户IP" prop="ip" width="100px" />
      <el-table-column label="用户地址" prop="address" />
      <el-table-column label="操作路径">
        <template #default="{ row }">
          <el-tag color="var(--primary-bg-color)" size="large">
            <span class="text-white">{{ row.path }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="请求方式" width="100px">
        <template #default="{ row }">
          <el-tag :type="tag_type(row.request_type)">
            {{ row.request_type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="响应状态码" prop="status_code" width="120px" />
      <el-table-column label="操作结果" width="100px">
        <template #default="{ row }">
          <el-tag
            :type="
              row.status_code >= 200 && row.status_code < 400
                ? 'success'
                : 'danger'
            "
          >
            {{
              row.status_code >= 200 && row.status_code < 400 ? '成功' : '失败'
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" width="160px">
        <template #default="{ row }">
          <h-icon icon="time" />
          {{ dateFormat(row.created_at).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            plain
            type="primary"
            size="small"
            @click="handleOpenDetail(row)"
          >
            <h-icon class="mr-1" icon="view-grid-detail" size="14px" />
            <span>查看详情</span>
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
    <el-dialog v-model="dialogVisible" title="日志详情" width="30%">
      <el-row :gutter="20">
        <el-col :span="6"><strong>操作用户</strong></el-col>
        <el-col :span="18">{{ logDetail!.username }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6"><strong>用户IP</strong></el-col>
        <el-col :span="18">{{ logDetail!.ip }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6"><strong>用户地址</strong></el-col>
        <el-col :span="18">{{ logDetail!.address }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6"><strong>操作路径</strong></el-col>
        <el-col :span="18">{{ logDetail!.path }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6"><strong>请求方式</strong></el-col>
        <el-col :span="18">{{ logDetail!.request_type }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6"><strong>操作时间</strong></el-col>
        <el-col :span="18">
          {{ dateFormat(logDetail!.updated_at).format('YYYY-MM-DD') }}
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6"><strong>请求参数</strong></el-col>
        <el-col :span="18">{{ logDetail!.parameter }}</el-col>
      </el-row>
    </el-dialog>
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

<style scoped>
:deep(.el-row) {
  margin-bottom: 10px;
}
:deep(.el-col:first-child) {
  text-align: center;
}
</style>
