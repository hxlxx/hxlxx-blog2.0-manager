<script setup lang="ts">
import { ref, onBeforeMount, reactive, toRaw, nextTick } from 'vue'
import {
  getRoleList,
  createRole,
  updateRolePermission,
  getPermissionMenu,
  removeRoleById
} from '@/api'
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
  id: 0,
  role_name: '',
  permission_menu: []
})
const roleForm = reactive<Role>(formInitial())
const elTreeRef = ref<InstanceType<typeof ElTree>>()
const isEdit = ref<boolean>(false)
const menu = ref<PermissionMenu[]>([])
const loading = ref<boolean>(false)

onBeforeMount(() => {
  initRoleList()
})

const initRoleList = async () => {
  loading.value = true
  const { data: roles } = (await getRoleList()) || {}
  const { data: menus } = (await getPermissionMenu()) || {}
  roleList.value = roles
  menu.value = formatDataTree(menus)
  loading.value = false
}
// 打开对话框
const handleOpenDialog = () => {
  dialogVisible.value = true
  isEdit.value = false
  resetForm()
}
// 重置表单数据
const resetForm = () => {
  Object.assign(roleForm, formInitial())
}
// 编辑菜单权限
const handleEditMenuPermission = async (id: number) => {
  dialogVisible.value = true
  isEdit.value = true
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
  // 子节点为有效权限
  roleForm.permission_menu = elTreeRef.value!.getCheckedKeys(true) as number[]
}
// 提交修改
const handleSubmitMenuPermission = async () => {
  const role = toRaw(roleForm)
  if (!role.role_name.trim()) {
    return Message({
      type: 'error',
      message: '请填写角色名称！'
    })
  }
  const { code } =
    (isEdit.value
      ? await updateRolePermission({ data: role })
      : await createRole({ data: role })) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: isEdit.value ? '修改角色权限成功！' : '创建角色成功！'
    })
    initRoleList()
  }
  dialogVisible.value = false
}
// 确定删除
const handleConfirm = async (id: number) => {
  const { code } = (await removeRoleById(id)) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: '删除角色成功！'
    })
    initRoleList()
  }
}
</script>

<template>
  <div>
    <div class="w-80 flex mb-3">
      <el-button type="primary" class="ml-3" @click="handleOpenDialog">
        <h-icon class="mr-1" icon="plus" />
        <span>添加角色</span>
      </el-button>
    </div>
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
            @click="handleEditMenuPermission(row.id)"
          >
            <h-icon class="mr-1" icon="edit" size="14px" />
            <span>菜单权限</span>
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
      title="角色管理"
      width="30%"
      destroy-on-close
      v-model="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="roleForm">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.role_name" placeholder="请填写角色名称" />
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
