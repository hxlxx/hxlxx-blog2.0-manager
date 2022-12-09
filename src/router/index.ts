import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: '/article',
      redirect: '/article/index',
      component: Layout,
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
})

export default router
