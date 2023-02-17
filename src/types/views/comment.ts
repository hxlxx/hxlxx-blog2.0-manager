import type { User } from './user'

export type Comment = {
  id: number
  uid: number
  aid: number
  pid: number
  reply_to: string
  content: string
  created_at: string
  user: User
}
