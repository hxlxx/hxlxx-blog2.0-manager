<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import type { FormRules } from 'element-plus'
import { login } from '@/api'
import { Loading } from '@/utils'
import { Message } from '@/utils'
import type { LoginInfo } from '@/types'
import { useUser, useMenu } from '@/stores'
import { loginRules } from './rules'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUser()
const menuStore = useMenu()

const loginRuleForm = reactive<LoginInfo>({
  username: '',
  password: '',
  code: ''
})
const baseUrl = '/api/captcha'
const captchaUrl = ref<string>(`${baseUrl}?${Math.random()}`)
const rules = reactive<FormRules>(loginRules)

// 回车登录
const handleEnter = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleLogin()
  }
}
onMounted(() => {
  document.addEventListener('keyup', handleEnter)
})
onBeforeUnmount(() => {
  document.removeEventListener('keyup', handleEnter)
})

// 点击登录
const handleLogin = async () => {
  if (!loginRuleForm.username || !loginRuleForm.password) {
    return Message({
      type: 'warning',
      message: '请先输入账号密码！'
    })
  }
  if (!loginRuleForm.code) {
    return Message({
      type: 'warning',
      message: '请输入验证码！'
    })
  }
  const loading = Loading({
    fullscreen: true,
    body: true
  })
  const { data, code } = (await login({ data: loginRuleForm })) || {}
  if (code === 200) {
    userStore.setUser(data.user)
    userStore.setToken(data.token)
    await menuStore.getMenuList()
    router.push({ path: '/' })
    Message({
      type: 'success',
      message: '登录成功！'
    })
  }
  loading.close()
}
// 切换验证码
const handleChangeCaptcha = () => {
  captchaUrl.value = `${baseUrl}?${Math.random()}`
  loginRuleForm.code = ''
}
</script>

<template>
  <div class="flex h-screen">
    <div class="flex-1 h-[100%] flex justify-center items-center">
      <span class="text-5xl">MANAGER</span>
    </div>
    <div class="w-[600px] h-[100%] flex flex-col justify-center items-center">
      <el-form
        status-icon
        ref="loginRuleFormRef"
        :model="loginRuleForm"
        :rules="rules"
      >
        <el-form-item prop="username">
          <el-input placeholder="账号" v-model="loginRuleForm.username">
            <template #prefix>
              <h-icon icon="user" size="14px" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="密码"
            type="password"
            show-password
            v-model="loginRuleForm.password"
          >
            <template #prefix>
              <h-icon icon="lock" size="14px" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            placeholder="验证码"
            v-model="loginRuleForm.code"
            class="code"
          />
          <div
            class="w-[100px] h-8 ml-1 cursor-pointer"
            @click="handleChangeCaptcha"
          >
            <el-image
              fit="cover"
              class="w-full h-full rounded"
              :src="captchaUrl"
            />
          </div>
        </el-form-item>
        <el-button type="primary" class="w-[100%]" @click="handleLogin">
          登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-form-item__content) {
  flex-wrap: nowrap;
}
.code :deep(.el-input__suffix) {
  display: none;
}
</style>
