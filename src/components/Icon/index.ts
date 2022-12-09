import { createVNode } from 'vue'
import * as ElementPlusIcon from '@element-plus/icons-vue'

export default (props: { icon: string }) => {
  const { icon } = props
  return createVNode(ElementPlusIcon[icon as keyof typeof ElementPlusIcon])
}
