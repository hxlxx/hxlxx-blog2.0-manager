<script setup lang="ts">
import { ref, reactive, onBeforeMount, computed } from 'vue'
import type {
  FormInstance,
  FormRules,
  UploadProps,
  UploadRawFile
} from 'element-plus'
import { useUser } from '@/stores'
import type { User } from '@/types'
import { Message } from '@/utils'
import { resetAvatar, resetUsername, resetPassword } from '@/api'

const userStore = useUser()

const pwdFormRef = ref<FormInstance>()
const uploadUrl = ref<string>(import.meta.env.VITE_UPLOAD_URL)
const uploadToken = ref<string>(import.meta.env.VITE_UPLOAD_TOKEN)
const imgBaseUrl = import.meta.env.VITE_IMG_BASE_URL
const user = reactive<User>({} as User)
const username_memo = ref<string>('')
const isUsernameChanged = computed(() => username_memo.value !== user.username)
const dialogVisible = ref<boolean>(false)
const pwdForm = reactive<any>({
  oldPwd: '',
  newPwd: ''
})
const checkNewPwd = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else if (value === pwdForm.oldPwd) {
    callback(new Error('新密码与旧密码不能相同'))
  } else {
    callback()
  }
}
const pwdFormRules = reactive<FormRules>({
  oldPwd: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6 - 20位', trigger: 'blur' }
  ],
  newPwd: [{ required: true, validator: checkNewPwd, trigger: 'blur' }]
})

onBeforeMount(() => {
  Object.assign(user, userStore.getUser())
  username_memo.value = user.username
})

// 上传图片校验
const handleBeforeUpload: UploadProps['beforeUpload'] = (
  rawFile: UploadRawFile
) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    Message({
      type: 'error',
      message: '图片大小不能超过2M！'
    })
    return false
  }
  return true
}
// 图片上传成功，更新用户头像
const handleCoverSuccess: UploadProps['onSuccess'] = (response: any) => {
  user.avatar_url = imgBaseUrl + response.hash
  if (!user.avatar_url) {
    return Message({
      type: 'error',
      message: '图片上传错误，请重新上传！'
    })
  }
  resetUserAvatar()
}
// 更新用户头像
const resetUserAvatar = async () => {
  const { code } =
    (await resetAvatar({
      data: { id: user.id, avatar_url: user.avatar_url }
    })) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: '更新头像成功！'
    })
    userStore.setUser(user)
  }
}
// 更新用户名
const handleChangeUsername = async () => {
  const { code } =
    (await resetUsername({ data: { id: user.id, username: user.username } })) ||
    {}
  if (code === 200) {
    Message({
      type: 'success',
      message: '更新用户名成功！'
    })
    userStore.setUser(user)
    username_memo.value = user.username
  }
}
// 确认重置密码
const handleSubmitPassword = () => {
  if (!pwdForm.oldPwd) {
    return Message({
      type: 'error',
      message: '请填写旧密码！'
    })
  }
  if (!pwdForm.newPwd) {
    return Message({
      type: 'error',
      message: '请填写新密码！'
    })
  }
  if (!pwdFormRef.value) return
  pwdFormRef.value.validate(async (valid) => {
    if (valid) {
      const { code } =
        (await resetPassword({
          data: { id: user.id, ...pwdForm }
        })) || {}
      if (code === 200) {
        Message({
          type: 'success',
          message: '重置密码成功！'
        })
        dialogVisible.value = false
      }
    } else {
      Message({
        type: 'error',
        message: '重置密码失败，请检查参数后重试！'
      })
      return false
    }
  })
}
</script>

<template>
  <div>
    <el-form class="w-[20%]" :model="user" label-width="80px">
      <el-form-item>
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :data="{ token: uploadToken }"
          :show-file-list="false"
          :before-upload="handleBeforeUpload"
          :on-success="handleCoverSuccess"
        >
          <el-image
            v-if="user.avatar_url"
            style="width: 160px; height: 160px"
            :src="user.avatar_url"
            fit="cover"
          />
          <h-icon
            v-else
            class="justify-center items-center w-[160px] h-[160px]"
            icon="plus"
            size="28px"
          />
        </el-upload>
      </el-form-item>
      <el-form-item label="用户名">
        <div class="flex gap-1">
          <el-input v-model="user.username" />
          <el-button
            type="danger"
            :disabled="!isUsernameChanged"
            @click="handleChangeUsername"
          >
            修改用户名
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="user.email" disabled />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="user.address" disabled />
      </el-form-item>
      <el-form-item label="角色">
        <el-input v-model="user.role.role_name" disabled />
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="dialogVisible = true">
          重置密码
        </el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      v-model="dialogVisible"
      title="重置密码"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form
        class="pr-5"
        ref="pwdFormRef"
        :model="pwdForm"
        :rules="pwdFormRules"
      >
        <el-form-item prop="oldPwd" label="密码" label-width="80px">
          <el-input v-model="pwdForm.oldPwd" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item prop="newPwd" label="新密码" label-width="80px">
          <el-input v-model="pwdForm.newPwd" placeholder="请输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="handleSubmitPassword">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
:deep(.i-icon-plus) {
  display: flex !important;
}
</style>
