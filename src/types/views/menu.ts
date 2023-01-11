export type Menu = {
  id: number
  pid?: number
  label: string
  icon: string
  path: string
  visible: boolean
  children?: Menu[]
}
