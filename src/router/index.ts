import { useUser } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory('/manager'),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path.indexOf('login') === -1) {
    const userStore = useUser()
    const token = userStore.getToken()
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
