import store from '@/store'
function hasPermission(value,el = false){
  if (!Array.isArray(value)) {
    throw new Error('permission value must be an array')
  }
   if (store.state.user.super === 1) {
    return true
   }
   const ruleNames = store.state.ruleNames ?? []
   const has = value.findIndex(item => ruleNames.includes(item)) != -1
   if(!has){
    console.warn('[v-permission] 缺少权限，元素已移除:', value, '当前账号ruleNames:', ruleNames)
    el.parentNode && el.parentNode.removeChild(el)
   }
   return has
  
}
export default {
  install(app){
    app.directive('permission',{
      mounted(el,binding){
        hasPermission(binding.value,el)
      }
    })
  }
}