import axios from 'axios'
import { ElNotification } from 'element-plus'
import { getToken } from '@/composables/auth'
import store from '@/store'

 const service = axios.create({
  baseURL: "/api",
  
 })
 // 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = getToken()
    if(token){
      
      config.headers["token"] = token
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data.data;
  }, function (error) {
    const msg = error.response.data.msg || '登录失败'
    if(msg === '你运行到这一步，代表已经修改成功了，但由于当前账号是课程演示账号，所以不会真实修改~'){
      store.dispatch('logout').finally(() => {
        location.reload()
       
      })
    }
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
     ElNotification({
          message: error.response.data.msg || '登录失败',
          type: 'error',
          duration: 3000
        })
    return Promise.reject(error);
  });
 export default service