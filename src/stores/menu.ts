import type { Menu, MenuState } from '@/types/store/menu'
import { defineStore } from 'pinia'

const menuList: Menu[] = [
  { id: 1, title: '首页', icon: 'home', path: '/' },
  {
    id: 2,
    title: '文章管理',
    icon: 'file',
    subMenu: [
      { id: 3, title: '发布文章', icon: 'write', path: '/article' },
      { id: 4, title: '文章列表', icon: 'list', path: '/article/list' },
      {
        id: 5,
        title: '分类管理',
        icon: 'category',
        path: '/article/categories'
      },
      { id: 6, title: '标签管理', icon: 'tag', path: '/article/tags' }
    ]
  },
  {
    id: 7,
    title: '用户管理',
    icon: 'manager',
    subMenu: [{ id: 8, title: '用户列表', icon: 'user', path: '/user' }]
  }
]

export const useMenuList = defineStore('menuList', {
  state: (): MenuState => {
    return {
      menuList: []
    }
  },
  actions: {
    getMenuList() {
      this.menuList = menuList
    }
  }
})
