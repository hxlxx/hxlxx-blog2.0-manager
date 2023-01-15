import {
  ElMessage,
  ElMessageBox,
  type ElMessageBoxOptions,
  type MessageProps
} from 'element-plus'
import type { AppContext } from 'vue'

export const Message = (options: Partial<MessageProps>) => {
  ElMessage(options)
}

export const MessageBox = (options: ElMessageBoxOptions) => {
  ElMessageBox(options)
}

export const Confirm = (
  message: ElMessageBoxOptions['message'],
  title: ElMessageBoxOptions['title'],
  options?: ElMessageBoxOptions,
  appContext?: AppContext | null
) => {
  return ElMessageBox.confirm(message, title, options, appContext)
}
