import { useUser, useNavTags, useMenu } from '@/stores'
import type { RouteRecordRaw } from 'vue-router'
import type { Menu, Role } from '@/types'

export const logout = () => {
  const userStore = useUser()
  const navTagStore = useNavTags()
  const menuStore = useMenu()
  userStore.clearUser()
  navTagStore.initNavTag()
  menuStore.clearMenuList()
  location.reload()
}

export const formatMenuTree = (menus: Menu[]) => {
  if (!menus || !Array.isArray(menus)) return []
  const result = JSON.parse(JSON.stringify(menus)) as Menu[]
  result.forEach((menu) => {
    result
      .filter((i) => i.id !== menu.id)
      .forEach((_menu) => {
        if (menu.id === _menu.pid) {
          if (menu.children) {
            menu.children.push(_menu)
          } else {
            menu.children = [_menu]
          }
        }
      })
  })
  return result.filter((menu) => !menu.pid)
}

export const getVisibleMenu = (menus: Menu[], role: Role) => {
  if (!menus || !Array.isArray(menus)) return []
  const isAdmin = role.role_name === 'admin'
  const result = JSON.parse(JSON.stringify(menus)) as Menu[]
  result.forEach((menu) => {
    result
      .filter((i) => i.id !== menu.id)
      .forEach((_menu) => {
        if (menu.id === _menu.pid && (isAdmin ? true : _menu.visible)) {
          if (menu.children) {
            menu.children.push(_menu)
          } else {
            menu.children = [_menu]
          }
        }
      })
  })
  return result.filter((menu) => !menu.pid && (isAdmin ? true : menu.visible))
}

export const mergeAsyncRoutes = (
  menus: Menu[],
  asyncRoutes: RouteRecordRaw[],
  role: Role
) => {
  if (role.role_name === 'admin') {
    asyncRoutes.push({
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    })
    return asyncRoutes
  } else {
    const parent = menus.filter((menu) => !menu.pid && menu.visible)
    const children = menus.filter((menu) => menu.pid && menu.visible)
    const visibleParentRoute = asyncRoutes.filter((route) =>
      parent.some((menu) => menu.path === route.path)
    )
    visibleParentRoute.forEach((pRoute) => {
      if (pRoute.children) {
        pRoute.children = pRoute.children.filter((cRoute) => {
          const fullPath = pRoute.path + '/' + cRoute.path
          return children.some((menu) => menu.path === fullPath)
        })
      }
    })
    visibleParentRoute.push({
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    })
    return visibleParentRoute
  }
}
