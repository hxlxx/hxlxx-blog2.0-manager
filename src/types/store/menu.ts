export type Menu = {
  id?: number
  pid?: number
  title: string
  icon: string
  path: string
  visible: boolean
  children?: Menu[]
}

export type MenuState = {
  collapse: boolean
  width?: number
}
