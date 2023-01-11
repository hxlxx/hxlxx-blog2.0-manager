export type PermissionMenu = {
  id: number
  pid?: number
  label: string
  children?: PermissionMenu[]
}

export type Role = {
  id: number
  created_at?: Date
  updated_at?: Date
  role_name: string
  permission_menu: number[]
}
