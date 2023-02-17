import type { User } from './user'

export type Talk = {
  id: number
  uid: number
  content: string
  comment_count: number
  created_at: Date
  user: User
}
