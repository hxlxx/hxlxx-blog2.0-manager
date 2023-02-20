<script setup lang="ts">
import { getLinkList, removeLinkById, removeLinkByIds, updateLink } from '@/api'
import type { Link, QueryInfo } from '@/types'
import { Confirm, Message } from '@/utils'
import type { Action } from 'element-plus'

const linkList = ref<Link[]>([])
const selectedItems = ref<Link[]>([])
const loading = ref<boolean>(false)
const query = reactive<QueryInfo>({
  skip: 0,
  limit: 10,
  page: 1,
  total: 0
})
const linkForm = reactive<Link>({} as Link)
const dialogVisible = ref<boolean>(false)

onBeforeMount(() => {
  initLinkList()
})

const initLinkList = async () => {
  const { data } =
    (await getLinkList({
      skip: (query.page! - 1) * query.limit!,
      limit: query.limit
    })) || {}
  linkList.value = data.res
  query.total = data.count
}
// 切换分页
const handleCurrentChange = () => {
  initLinkList()
}
// 编辑
const handleEditLink = (link: Link) => {
  Object.assign(linkForm, link)
  dialogVisible.value = true
}
// 修改友链状态
const handleChangeStatus = async (link: Link) => {
  const { code } = (await updateLink({ data: link })) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: '修改链接状态成功！'
    })
    initLinkList()
  }
}
// 提交修改
const handleSubmit = async () => {
  dialogVisible.value = false
  const { code } = (await updateLink({ data: toRaw(linkForm) })) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: '修改链接信息成功！'
    })
    initLinkList()
  }
}
// 删除友链
const handleConfirm = async (id: number) => {
  const { code } = (await removeLinkById({ data: { id } })) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: '删除成功！'
    })
    query.page = 1
    initLinkList()
  }
}
// 表格多选
const handleSelectionChange = (links: Link[]) => {
  selectedItems.value = links
}
// 删除所有选中项
const handleRemoveAllSelected = () => {
  const ids = selectedItems.value.map((item) => item.id)
  Confirm('是否确定删除选中项？', '批量删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const { code } = (await removeLinkByIds({ data: { ids } })) || {}
      if (code === 200) {
        Message({
          type: 'success',
          message: '批量删除成功！'
        })
        query.page = 1
        initLinkList()
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
      :data="linkList"
      :header-cell-style="{
        color: '#606266',
        'text-align': 'center'
      }"
      :cell-style="{ 'text-align': 'center' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="链接头像" width="150px">
        <template #default="{ row }">
          <el-image
            style="width: 80px; height: 80px; border-radius: 50%"
            :src="row.link_avatar"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="链接名称" prop="link_name" width="200px" />
      <el-table-column label="链接地址" prop="link_url" />
      <el-table-column label="链接介绍" prop="link_intro" />
      <el-table-column label="创建日期" width="200px">
        <template #default="{ row }">
          <h-icon icon="time" />
          {{ dateFormat(row.created_at).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="200px">
        <template #default="{ row }">
          <el-switch v-model="row.status" @change="handleChangeStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template #default="{ row }">
          <el-button
            plain
            type="primary"
            size="small"
            @click="handleEditLink(row)"
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
    <el-dialog v-model="dialogVisible" title="编辑链接" width="30%">
      <el-form>
        <el-form-item label="链接头像">
          <el-input v-model.trim="linkForm.link_avatar" />
        </el-form-item>
        <el-form-item label="链接名称">
          <el-input v-model.trim="linkForm.link_name" />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model.trim="linkForm.link_url" />
        </el-form-item>
        <el-form-item label="链接介绍">
          <el-input v-model.trim="linkForm.link_intro" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit"> 提交 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
