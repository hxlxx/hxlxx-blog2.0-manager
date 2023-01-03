export const formatDataTree = (data: any[]) => {
  if (!data || !Array.isArray(data)) return []
  data.forEach((item) => {
    data
      .filter((i) => i.id !== item.id)
      .forEach((_item) => {
        if (item.id === _item.pid) {
          if (item.children) {
            item.children.push(_item)
          } else {
            item.children = [_item]
          }
        }
      })
  })
  return data.filter((item) => !item.pid)
}
