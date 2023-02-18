import type { User } from './user'

export type Comment = {
  id: number
  uid: number
  topic_id: number
  pid: number
  reply_to: string
  content: string
  created_at: string
  user: User
}
