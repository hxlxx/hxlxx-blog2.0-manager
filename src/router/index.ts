import { useMenu, useUser } from '@/stores'
import { mergeAsyncRoutes } from '@/utils'
import { createRouter, createWebHistory } from 'vue-router'
import { asyncRoutes } from './asyncRoutes'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory('/manager'),
  routes
})

let newRoutes = []
router.beforeEach((to, from, next) => {
  const userStore = useUser()
  const menuStore = useMenu()
  const token = userStore.getToken()
  if (token) {
    if (to.path === '/login') {
      next('/home')
    }
    if (newRoutes.length) {
      next()
    } else {
      newRoutes = mergeAsyncRoutes(
        menuStore.menuList,
        asyncRoutes,
        userStore.user.role
      )
      newRoutes.forEach((route) => {
        router.addRoute(route)
      })
      next({ ...to, replace: true })
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
