import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { router } from '@/router'
import App from '@/App.vue'
import store from '@/store/index.js'
import 'virtual:windi.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(store)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
import '@/permission.js'  
import "nprogress/nprogress.css"
import permission from '@/directives/permission.js'
app.use(permission)
app.mount('#app')
