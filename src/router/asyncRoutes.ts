import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/article',
    redirect: '/article/publish',
    component: Layout,
    meta: { title: '文章管理' },
    children: [
      {
        path: 'publish',
        name: 'article',
        component: () => import('@/views/article-manager/article-publish.vue'),
        meta: { title: '发布文章', activePath: '/article/publish' }
      },
      {
        path: 'list',
        name: 'article-list',
        component: () => import('@/views/article-manager/article-list.vue'),
        meta: { title: '文章列表', activePath: '/article/list' }
      },
      {
        path: 'categories',
        name: 'categories',
        component: () =>
          import('@/views/article-manager/article-categories.vue'),
        meta: { title: '分类管理', activePath: '/article/categories' }
      },
      {
        path: 'tags',
        name: 'tags',
        component: () => import('@/views/article-manager/article-tags.vue'),
        meta: { title: '标签管理', activePath: '/article/tags' }
      },
      {
        path: ':id(\\d+)',
        name: 'edit-article',
        component: () => import('@/views/article-manager/article-publish.vue'),
        meta: { title: '编辑文章' }
      }
    ]
  },
  {
    path: '/permission',
    redirect: '/permission/menu',
    component: Layout,
    meta: { title: '权限管理' },
    children: [
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/permission/permission-menu.vue'),
        meta: { title: '菜单管理', activePath: '/permission/menu' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/permission/permission-role.vue'),
        meta: { title: '角色管理', activePath: '/permission/role' }
      }
    ]
  },
  {
    path: '/user',
    redirect: '/user/list',
    component: Layout,
    meta: { title: '用户管理' },
    children: [
      {
        path: 'list',
        name: 'user-list',
        component: () => import('@/views/user/user-list.vue'),
        meta: { title: '用户列表', activePath: '/user/list' }
      }
    ]
  },
  {
    path: '/user-center',
    component: Layout,
    meta: { title: '用户中心' },
    children: [
      {
        path: '',
        name: 'user-center',
        component: () => import('@/views/user-center/index.vue')
      }
    ]
  },
  {
    path: '/log',
    redirect: '/log/operation',
    component: Layout,
    meta: { title: '日志管理' },
    children: [
      {
        path: 'operation',
        name: 'log-operation',
        component: () => import('@/views/log/log-operation.vue'),
        meta: { title: '操作日志', activePath: '/log/operation' }
      }
    ]
  },
  {
    path: '/site-config',
    component: Layout,
    meta: { title: '网站配置' },
    children: [
      {
        path: '',
        name: 'site-config',
        component: () => import('@/views/site-config/index.vue')
      }
    ]
  }
]
