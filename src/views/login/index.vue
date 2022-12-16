<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormRules } from 'element-plus'
import { login } from '@/api'
import { Loading, setToken } from '@/utils'
import router from '@/router'
import { Message } from '@/utils'
import type { LoginInfo } from '@/types'

const loginRuleForm = reactive<LoginInfo>({
  username: '',
  password: '',
  code: ''
})
const captchaUrl = ref<string>('/api/captcha?' + Math.random())

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 5, max: 30, message: '账号长度在5 - 30位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6 - 20位', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 4, message: '验证码格式错误', trigger: 'blur' }
  ]
})

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
  const res = await login({ data: loginRuleForm })
  if (res?.data) {
    setToken(res.data.access_token)
    const loading = Loading({
      fullscreen: true,
      body: true
    })
    setTimeout(() => {
      loading.close()
      router.push({ path: '/' })
    }, 1000)
  }
}
// 切换验证码
const handleChangeCaptcha = () => {
  captchaUrl.value = captchaUrl.value + '?' + Math.random()
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
          <el-input
            placeholder="账号"
            v-model="loginRuleForm.username"
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="密码"
            type="password"
            show-password
            v-model="loginRuleForm.password"
            :prefix-icon="Lock"
          />
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            placeholder="验证码"
            v-model="loginRuleForm.code"
            class="code"
          />
          <img
            class="ml-[10px] rounded-md cursor-pointer"
            title="看不清？点击切换下一张"
            :src="captchaUrl"
            @click="handleChangeCaptcha"
          />
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
