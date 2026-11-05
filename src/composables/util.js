import { ElNotification, ElMessageBox} from 'element-plus'
import nprogress from "nprogress"
export function toast(message, type = 'success') {
  ElNotification({
    message,
    type,
    duration: 3000
  })
}
export function showModal(content="退出登录",type="warning",title="提示") {
  return ElMessageBox.confirm(content, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type,
  })
}
export function showFullLoading(){
  nprogress.start()
}
export function hideFullLoading(){
  nprogress.done()
}