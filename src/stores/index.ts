export * from './article'
export * from './menu'
export * from './nav-tags'
export * from './user'
export * from './talk'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
