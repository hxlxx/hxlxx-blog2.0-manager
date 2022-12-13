import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style/index.css'
import '@/assets/fonts/iconfont.css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/theme-chalk/el-loading.css'
import 'md-editor-v3/lib/style.css'
import { errorHandler } from './utils'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.config.errorHandler = errorHandler

app.mount('#app')
