import {
  ElMessage,
  ElMessageBox,
  type ElMessageBoxOptions,
  type MessageProps
} from 'element-plus'

export const Message = (options: Partial<MessageProps>) => {
  return ElMessage(options)
}

export const MessageBox = (options: Partial<ElMessageBoxOptions>) => {
  return ElMessageBox(options)
}
