<script setup lang="ts">
import {
  getRoleList,
  getUserList,
  updateUserRole,
  updateUserStatus
} from '@/api'
import type { QueryInfo, Role, User, UserForm } from '@/types'
import { Message } from '@/utils'

const userList = ref<User[]>([])
const roleList = ref<Role[]>([])
const loading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)
const userForm = reactive<UserForm>({
  id: 0,
  username: '',
  role_id: 0,
  status: true
})
const query = reactive<QueryInfo>({
  skip: 0,
  limit: 5,
  page: 1,
  total: 0
})

onBeforeMount(() => {
  initUserList()
  initRoleList()
})

const initUserList = async () => {
  loading.value = true
  const { data } =
    (await getUserList({
      skip: (query.page! - 1) * query.limit!,
      limit: query.limit
    })) || {}
  userList.value = data.res
  query.total = data.count
  loading.value = false
}

const initRoleList = async () => {
  const { data } = (await getRoleList()) || {}
  roleList.value = data
}

// 编辑用户
const handleEditUser = ({ id, username, role, status }: User) => {
  userForm.id = id
  userForm.username = username
  userForm.role_id = role.id
  userForm.status = status
  dialogVisible.value = true
}
// 提交修改
const handleSubmitUser = async () => {
  const user = toRaw(userForm)
  const { code } = (await updateUserRole({ data: user })) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: '更新用户角色成功！'
    })
    initUserList()
  }
  dialogVisible.value = false
}
// 修改用户状态
const handleChangeUserStatus = async (status: boolean, id: number) => {
  const { code } = (await updateUserStatus({ data: { status, id } })) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: '更新用户状态成功！'
    })
    initUserList()
  }
}
// 切换分页
const handleChangePage = () => {
  initUserList()
}
</script>

<template>
  <div>
    <el-table
      border
      v-loading="loading"
      :data="userList"
      :header-cell-style="{
        color: '#606266',
        'text-align': 'center'
      }"
      :cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column label="头像" width="160px">
        <template #default="{ row }">
          <el-image
            style="width: 80px; height: 80px; border-radius: 5px"
            :src="row.avatar_url"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="username" />
      <el-table-column label="邮箱" prop="email" />
      <el-table-column label="角色" width="120px">
        <template #default="{ row }">
          <el-tag effect="plain">{{ row.role.role_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px">
        <template #default="{ row }">
          <h-icon icon="time" />
          {{ dateFormat(row.created_at).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column label="ip" prop="ip" width="160px" />
      <el-table-column label="地址" prop="address" />
      <el-table-column label="用户状态" width="150px">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            @change="(value: boolean) => handleChangeUserStatus(value, row.id)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template #default="{ row }">
          <el-button
            plain
            type="primary"
            size="small"
            @click="handleEditUser(row)"
          >
            <h-icon class="mr-1" icon="edit" size="14px" />
            <span>编辑</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" title="编辑用户" width="30%">
      <el-form :model="userForm" label-width="60px">
        <el-form-item label="用户名">
          <el-input disabled v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="角色">
          <el-radio-group v-model="userForm.role_id">
            <el-radio v-for="role in roleList" :key="role.id" :label="role.id">
              {{ role.role_name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitUser"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <div class="w-full flex justify-center mt-3">
      <el-pagination
        v-model:current-page="query.page"
        background
        layout="prev, pager, next, total"
        :pager-count="5"
        :page-size="query.limit"
        :total="query.total"
        @current-change="handleChangePage"
      />
    </div>
  </div>
</template>
