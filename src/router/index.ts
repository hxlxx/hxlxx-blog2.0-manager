import { getToken, Message } from '@/utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path.indexOf('login') === -1) {
    const token = getToken()
    if (token) {
      if (from.path === '/login' && to.path === '/home') {
        Message({
          type: 'success',
          message: '登录成功！'
        })
      }
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
