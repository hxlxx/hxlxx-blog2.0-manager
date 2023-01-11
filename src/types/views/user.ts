import type { Role } from './permission'

export type User = {
  id: number
  username: string
  avatar_url: string
  address: string
  email: string
  ip: string
  status: boolean
  created_at: Date
  role: Role
}

export type UserForm = {
  id: number
  username: string
  role_id: number
  status: boolean
}
