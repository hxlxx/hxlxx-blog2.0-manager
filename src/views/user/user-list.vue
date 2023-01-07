<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { getUserList } from '@/api'

const userList = ref<any[]>([])
const loading = ref<boolean>(false)

onBeforeMount(() => {
  initUserList()
})

const initUserList = async () => {
  loading.value = true
  const { data } = (await getUserList()) || {}
  userList.value = data?.res
  loading.value = false
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
      <el-table-column label="头像">
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
      <el-table-column label="角色">
        <template #default="{ row }">
          <el-tag effect="plain">{{ row.role.role_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template #default="{ row }">
          <h-icon icon="time" />
          {{ dateFormat(row.created_at).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column label="ip" prop="ip" />
      <el-table-column label="地址" prop="address" />
      <el-table-column label="操作">
        <template #default>
          <el-button plain type="primary" size="small">
            <h-icon class="mr-1" icon="edit" size="14px" />
            <span>编辑</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
