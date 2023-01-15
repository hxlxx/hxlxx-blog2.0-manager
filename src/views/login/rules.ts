import type { FormRules } from 'element-plus'

export const loginRules: FormRules = {
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
}
