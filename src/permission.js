import { router, addRoutes } from '@/router/index.js'
import { getToken } from '@/composables/auth.js'
import { toast,showFullLoading,hideFullLoading } from '@/composables/util.js'
import store from '@/store/index.js'
 
let hasGetInfo = false
router.beforeEach(async (to, from, next) => {
  showFullLoading()
  const token = getToken()
  if (!token&&to.path!=='/login') {
    toast('请先登录')
    return next({path: '/login'})
  } 
  if (token&&to.path=='/login') {
    toast('您已登录，无需重复登录')
    return next({path:from.path ? from.path : '/'})
   } 
   let newRoutes = false

   if (token && !hasGetInfo) {
    try {
       const { menus } = await store.dispatch('getInfo')
       newRoutes = addRoutes(menus || [])
       hasGetInfo = true
    } catch (error) {
       await store.dispatch('logout')
       return next({ path: '/login', query: { redirect: to.fullPath } })
    }
   }

   const title = to.meta.title ? `${to.meta.title} - 项目后台管理系统` : '项目后台管理系统'
   document.title = title

   if (newRoutes) {
     return next(to.fullPath)
   }

   return next()
  }

)
router.afterEach(() => {
  hideFullLoading()
})
