import Layout from '@/layout/index.vue'
import { Message } from '@/utils'
import type { RouteLocationNormalized } from 'vue-router'

export const routes = [
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', activePath: '/home' }
      }
    ],
    beforeEnter: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized
    ) => {
      if (from.path.indexOf('/login') !== -1) {
        Message({
          type: 'success',
          message: '登录成功！'
        })
      }
      return true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue')
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
    path: '/article',
    redirect: '/article/publish',
    component: Layout,
    meta: { title: '文章管理' },
    children: [
      {
        path: 'publish',
        name: 'article',
        component: () => import('@/views/article-manager/article-publish.vue'),
        meta: { title: '发布文章', activePath: '/article' }
      },
      {
        path: ':id',
        name: 'edit-article',
        component: () => import('@/views/article-manager/article-publish.vue'),
        meta: { title: '编辑文章' }
      },
      {
        path: 'list',
        name: 'list',
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
        meta: { title: '用户列表', activePath: '/user' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]
