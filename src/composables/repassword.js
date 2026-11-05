import { ref, reactive } from 'vue'
import { showModal, toast, } from '@/composables/util'
import { logout } from '@/api/manager'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useFullscreen } from '@vueuse/core'
import { updatepassword } from '@/api/manager'
import FormDrawer from '@/components/FormDrawer.vue'
const store = useStore()
const router = useRouter()
const drawer = ref(false)
const { isFullscreen, toggle } = useFullscreen()
const { formDrawer, rules, formRef, form, loading, onSubmit } = useRepassword()


export function useRepassword() {
  const store = useStore()
  const router = useRouter()
  const formDrawer = ref(null)
  const rules = reactive({
    oldpassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }, { min: 3, max: 10, message: '旧密码长度必须在3到10之间', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 3, max: 12, message: '密码长度必须在6到12之间', trigger: 'blur' }],
    repassword: [{ required: true, message: '请确认密码', trigger: 'blur' }],
  })
  const formRef = ref(null)
  const form = reactive({
    oldpassword: '',
    password: '',
    repassword: ''
  })
  const loading = ref(false)
  const onSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) {

        return
      }

      formDrawer.value.showLoading()
      updatepassword(form).then(res => {

        ElNotification({
          message: '修改密码成功',
          type: 'success',
          duration: 3000
        })
        store.dispatch('logout')
        router.push('/login')


      }).finally(() => {
        formDrawer.value.hideLoading()
      })
    })
  }
  return {
    formDrawer,
    rules,
    formRef,
    form,
    loading,
    onSubmit
  }
}
export function useLogout() {
  const store = useStore()
  const router = useRouter()
  function handleLogout() {
  showModal().then(() => {
    logout().finally(() => {
      store.dispatch('logout')
      router.push('/login')
      toast('退出登录成功')
    })
  }).catch(() => {
    toast('退出登录失败')
  })
}
return{handleLogout}
}

