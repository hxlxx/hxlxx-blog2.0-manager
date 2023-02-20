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
    path: '/config',
    redirect: '/config/website',
    component: Layout,
    meta: { title: '系统设置' },
    children: [
      {
        path: 'website',
        name: 'website',
        component: () => import('@/views/config/website.vue'),
        meta: { title: '网站配置', activePath: '/config/website' }
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/config/about.vue'),
        meta: { title: '关于我', activePath: '/config/about' }
      },
      {
        path: 'links',
        name: 'links',
        component: () => import('@/views/config/links.vue'),
        meta: { title: '友链管理', activePath: '/config/links' }
      }
    ]
  },
  {
    path: '/message',
    component: Layout,
    meta: { title: '消息管理' },
    children: [
      {
        path: 'comments',
        name: 'comments',
        component: () => import('@/views/message/comments.vue'),
        meta: { title: '评论管理', activePath: '/message/comments' }
      }
    ]
  },
  {
    path: '/talks',
    redirect: '/talks/publish',
    component: Layout,
    meta: { title: '说说管理' },
    children: [
      {
        path: 'publish',
        name: 'talks',
        component: () => import('@/views/talks/talks-publish.vue'),
        meta: { title: '发布说说', activePath: '/talks/publish' }
      },
      {
        path: 'list',
        name: 'talks-list',
        component: () => import('@/views/talks/talks-list.vue'),
        meta: { title: '说说列表', activePath: '/talks/list' }
      },
      {
        path: ':id(\\d+)',
        name: 'edit-talk',
        component: () => import('@/views/talks/talks-publish.vue'),
        meta: { title: '编辑说说' }
      }
    ]
  }
]
