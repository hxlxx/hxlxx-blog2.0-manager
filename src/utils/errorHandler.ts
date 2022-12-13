import type { ComponentPublicInstance } from 'vue'

export const errorHandler = (
  error: unknown,
  instance: ComponentPublicInstance | null,
  info: string
) => {
  console.log(error)
  console.log('info :>> ', info)
}
