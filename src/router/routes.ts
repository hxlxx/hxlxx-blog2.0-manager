import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const routes: RouteRecordRaw[] = [
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
    ]
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
  }
  // {
  //   path: '/:pathMatch(.*)*',
  //   redirect: '/404'
  // }
]
