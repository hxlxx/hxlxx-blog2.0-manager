<script setup lang="ts">
import { ref, reactive, toRaw, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { Menu } from '@/types'
import {
  addMenu,
  removeMenu,
  getMenuById,
  updateMenu,
  updateMenuVisible,
  getMenuList
} from '@/api'
import { formatDataTree, Message } from '@/utils'
import type { TabPaneName } from 'element-plus'

const menuDialogVisible = ref<boolean>(false)
const menuSelectorVisible = ref<boolean>(false)
const tabsActiveName = ref<string>('first')
const formInitial = () => ({
  pid: undefined,
  label: '',
  path: '',
  icon: '',
  visible: true
})
const menuForm = reactive<Menu>(formInitial())
const menuList = ref<Menu[]>([])
const isMain = ref<boolean>(true)
const isSub = ref<boolean>(true)
const isEdit = ref<boolean>(false)
const loading = ref<boolean>(false)

onMounted(() => {
  initMenuList()
})

const initMenuList = async () => {
  loading.value = true
  const { data } = (await getMenuList()) || {}
  menuList.value = formatDataTree(data)
  loading.value = false
}

// 打开对话框
const handleOpenDialog = () => {
  resetForm()
  menuDialogVisible.value = true
  isMain.value = true
  isSub.value = true
}
// 关闭对话框
const handleCloseDialog = () => {
  menuDialogVisible.value = false
  menuSelectorVisible.value = false
  resetForm()
}
// 切换 tab 栏
const handleChangeTab = (name: TabPaneName) => {
  if (name === 'second') {
    menuSelectorVisible.value = true
  } else {
    menuSelectorVisible.value = false
    menuForm.pid = undefined
  }
}
// 提交或更新菜单
const handleSubmitMenu = async () => {
  const menu = toRaw(menuForm)
  const { code } =
    (isEdit.value
      ? await updateMenu({ data: menu })
      : await addMenu({ data: menu })) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: isEdit.value ? '编辑菜单成功！' : '添加菜单成功！'
    })
    initMenuList()
    resetForm()
  }
  menuDialogVisible.value = false
  isEdit.value = false
}
// 更新菜单显示
const handleChangeMenuVisible = async (id: number, value: boolean) => {
  loading.value = true
  const { code } =
    (await updateMenuVisible({ data: { id, visible: value } })) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: '修改菜单状态成功！'
    })
  }
  loading.value = false
}
// 重置表单
const resetForm = () => {
  Object.assign(menuForm, formInitial())
  tabsActiveName.value = 'first'
}
// 添加子菜单
const handleAddSubMenu = async (id: number) => {
  const { data } = (await getMenuById(id)) || {}
  isMain.value = false
  isSub.value = true
  menuSelectorVisible.value = true
  menuForm.pid = id
  menuForm.path = data.path
  menuDialogVisible.value = true
}
// 编辑菜单
const handleEditMenu = async (id: number) => {
  const { data } = (await getMenuById(id)) || {}
  if (data.pid) {
    isMain.value = false
    isSub.value = true
    menuSelectorVisible.value = true
  } else {
    isMain.value = true
    isSub.value = false
    menuSelectorVisible.value = false
  }
  Object.assign(menuForm, data)
  isEdit.value = true
  menuDialogVisible.value = true
}
// 删除菜单
const handleConfirm = async (id: number) => {
  const { code } = (await removeMenu(id)) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: '删除菜单成功！'
    })
    initMenuList()
  }
}
</script>

<template>
  <div>
    <div class="w-80 flex mb-3">
      <el-button type="primary" class="ml-3" @click="handleOpenDialog">
        <el-icon><Plus /></el-icon>
        <span>添加菜单</span>
      </el-button>
    </div>
    <el-table
      border
      v-loading="loading"
      row-key="label"
      :data="menuList"
      :header-cell-style="{
        color: '#606266',
        'text-align': 'center'
      }"
      :cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column label="菜单名称" prop="label" width="150px" />
      <el-table-column label="菜单路径">
        <template #default="{ row }">
          <el-tag effect="plain">{{ row.path }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="菜单图标">
        <template #default="{ row }">
          <el-tag type="success" effect="plain">{{ row.icon }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="显示菜单">
        <template #default="{ row }">
          <el-switch
            v-model="row.visible"
            @change="(value: boolean) => {handleChangeMenuVisible(row.id, value)}"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            v-if="!row.pid"
            plain
            type="primary"
            size="small"
            @click="handleAddSubMenu(row.id)"
          >
            <el-icon><Plus /></el-icon>
            <span>添加子菜单</span>
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="handleEditMenu(row.id)"
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
      v-model="menuDialogVisible"
      width="360px"
      align-center
      :title="isMain && isSub ? '添加菜单' : '编辑菜单'"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="tabsActiveName" @tab-change="handleChangeTab">
        <el-tab-pane
          class="pr-6"
          :label="isMain && isSub ? '添加一级菜单' : '编辑一级菜单'"
          name="first"
          v-if="isMain"
        />
        <el-tab-pane
          class="pr-6"
          :label="isMain && isSub ? '添加子菜单' : '编辑子菜单'"
          name="second"
          v-if="isSub"
        />
        <el-form label-width="80px" class="pr-10">
          <el-form-item label="一级菜单" v-if="menuSelectorVisible">
            <el-select v-model="menuForm.pid" placeholder="请选择">
              <el-option
                v-for="menu in menuList"
                :key="menu.id"
                :label="menu.label"
                :value="menu.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="菜单名称">
            <el-input
              clearable
              v-model="menuForm.label"
              placeholder="例：首页"
            />
          </el-form-item>
          <el-form-item label="菜单路径">
            <div class="flex gap-3">
              <el-input
                clearable
                v-model="menuForm.path"
                placeholder="例：/home"
              />
            </div>
          </el-form-item>
          <el-form-item label="菜单图标">
            <el-input
              clearable
              v-model="menuForm.icon"
              placeholder="例：home"
            />
          </el-form-item>
        </el-form>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="handleCloseDialog"> 关闭 </el-button>
          <el-button type="primary" @click="handleSubmitMenu"> 提交 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
