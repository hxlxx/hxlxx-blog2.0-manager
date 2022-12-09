export type NavTag = {
  id: number
  tag_name: string
  path: string
  active: boolean
}

export type NavTagState = {
  navTags: NavTag[]
}
