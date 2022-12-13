import Layout from '@/layout/index.vue'

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
        meta: { title: '首页', activePath: '/' }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
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
    redirect: '/article/index',
    component: Layout,
    meta: { title: '文章管理' },
    children: [
      {
        path: 'index',
        name: 'article',
        component: () => import('@/views/article-manager/index.vue'),
        meta: { title: '发布文章', activePath: '/article' }
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
        meta: { title: '标签管理', activePath: 'tags' }
      }
    ]
  },
  {
    path: '/user',
    redirect: '/user/index',
    component: Layout,
    meta: { title: '用户管理' },
    children: [
      {
        path: 'index',
        name: 'user-list',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '', activePath: '' }
      }
    ]
  }
]
