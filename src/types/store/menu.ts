export type Menu = {
  id: number
  title: string
  icon: string
  path?: string
  subMenu?: Menu[]
}

export type MenuState = {
  menuList: Menu[]
}
