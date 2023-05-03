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
    // admin 角色直接渲染所有动态路由
    asyncRoutes.push({
      path: '/:catchError(.*)*',
      redirect: '/404'
    })
    return asyncRoutes
  } else {
    // 非 admin 角色需要根据菜单动态渲染路由
    const parent = menus.filter((menu) => !menu.pid && menu.visible)
    const children = menus.filter((menu) => menu.pid && menu.visible)
    // 过滤所有可见的路由
    const visibleParentRoute = asyncRoutes.filter((route) =>
      parent.some((menu) => menu.path === route.path)
    )
    // 过滤所有可见的子路由
    visibleParentRoute.forEach((pRoute) => {
      if (pRoute.children) {
        pRoute.children = pRoute.children.filter((cRoute) => {
          // 判断子路由路径和父路由路径相同的情况（/user-center）
          if (cRoute.path === '' || cRoute.path.indexOf(':') === 0) return true
          // 判断当前子路由是否和子菜单相匹配
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

export const getType = (target: any): string => {
  if (typeof target === 'object') {
    const typeStr = Object.prototype.toString.call(target).toLowerCase()
    return typeStr.split(' ')[1].slice(0, -1)
  } else {
    return (typeof target).toLowerCase()
  }
}

export const hasObjectChanged = (
  origin: Record<string, any>,
  target: Record<string, any>
): boolean => {
  if (!origin || !target) return false
  if (getType(origin) !== getType(target)) return true
  if (Object.keys(origin).length !== Object.keys(target).length) return true
  let flag: boolean = false
  const objType = ['object', 'array']
  for (const key in origin) {
    if (flag) return true
    if (origin.hasOwnProperty(key)) {
      if (
        objType.includes(getType(origin[key])) &&
        objType.includes(getType(target[key]))
      ) {
        flag = hasObjectChanged(origin[key], target[key])
      } else {
        if (origin[key] !== target[key]) {
          return true
        }
      }
    }
  }
  return flag
}
