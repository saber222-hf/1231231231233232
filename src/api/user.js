import axios from '@/axios'

// 用户列表：页码为路径参数，如 GET /admin/user/1?limit=10
export function getUserList(page = 1, params = {}) {
  return axios.get(`/admin/user/${page}?limit=10`)
}

// 新增用户（注册），对应后端 POST http://ceshi13.dishait.cn/admin/user
export function createUser(data) {
  return axios.post('/admin/user', data)
}

export function deleteUser(id) {
  return axios.post(`/admin/user/${id}/delete`)
}

// 会员等级列表：GET /admin/user_level/1?limit=10
export function getUserLevelList(page = 1) {
  return axios.get(`/admin/user_level/${page}?limit=100`)
}
