import type { Talk } from '../views/talks'

export type TalkState = {
  talkMap: { [id: string]: Talk }
}
