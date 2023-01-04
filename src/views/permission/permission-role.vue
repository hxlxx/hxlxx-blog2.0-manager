<script setup lang="ts">
import { ref, onBeforeMount, reactive, toRaw, nextTick } from 'vue'
import { getRoleList, updateRolePermission, getPermissionMenu } from '@/api'
import { Clock } from '@element-plus/icons-vue'
import type { PermissionMenu, Role } from '@/types'
import { formatDataTree, Message } from '@/utils'
import type { ElTree } from 'element-plus'

const roleList = ref<Role[]>([])
const dialogVisible = ref<boolean>(false)
const elTreeProps = {
  label: 'label',
  children: 'children'
}
const formInitial = () => ({
  id: undefined,
  role_name: '',
  permission_menu: []
})
const roleForm = reactive<Role>(formInitial())
const elTreeRef = ref<InstanceType<typeof ElTree>>()
const menu = ref<PermissionMenu[]>([])
const loading = ref<boolean>(false)

onBeforeMount(() => {
  initRoleList()
})

const initRoleList = async () => {
  loading.value = true
  const { data } = (await getRoleList()) || {}
  roleList.value = data
  loading.value = false
}
// 编辑菜单权限
const handleEditMenuPermission = async (id: number) => {
  const { data } = (await getPermissionMenu()) || {}
  menu.value = formatDataTree(data)
  dialogVisible.value = true
  const role = roleList.value.find((role) => role.id === id)!
  Object.assign(roleForm, role)
  const checkedKeys = roleForm.permission_menu
  nextTick(() => {
    elTreeRef.value!.setCheckedKeys(checkedKeys)
  })
}
// 修改菜单权限
const handleCheckChange = (data: PermissionMenu, checked: boolean) => {
  if (checked) {
    !data.children &&
      !roleForm.permission_menu.includes(data.id) &&
      roleForm.permission_menu.push(data.id)
  } else {
    roleForm.permission_menu = roleForm.permission_menu.filter(
      (item) => item !== data.id
    )
  }
  roleForm.permission_menu = elTreeRef.value!.getCheckedKeys() as number[]
}
// 提交修改
const handleSubmitMenuPermission = async () => {
  const role = toRaw(roleForm)
  const { code } = await updateRolePermission({ data: role })
  if (code === 200) {
    Message({
      type: 'success',
      message: '修改菜单权限成功！'
    })
  }
  initRoleList()
  dialogVisible.value = false
}
</script>

<template>
  <div>
    <el-table
      border
      v-loading="loading"
      :data="roleList"
      :header-cell-style="{
        color: '#606266',
        'text-align': 'center'
      }"
      :cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column label="角色名称" prop="role_name" />
      <el-table-column label="权限标签">
        <template #default="{ row }">
          <el-tag>{{ row.role_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template #default="{ row }">
          <div class="flex gap-2 justify-center items-center">
            <el-icon><Clock /></el-icon>
            <span>{{ dateFormat(row.created_at).format('YYYY-MM-DD') }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="handleEditMenuPermission(row.id)"
          >
            菜单权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogVisible"
      title="角色管理"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="roleForm">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.role_name" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            ref="elTreeRef"
            show-checkbox
            node-key="id"
            :data="menu"
            :props="elTreeProps"
            @check-change="handleCheckChange"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitMenuPermission">
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
