import type { User } from './user'

export type Comment = {
  id: number
  uid: number
  aid: number
  parentId: number
  replyTo: string
  address: string
  content: string
  createTime: string
  user: User
}
