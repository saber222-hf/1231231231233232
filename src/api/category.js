import axios from '@/axios'

export function getCategoryList(page = 1, limit = 10) {
  return axios.get(`/admin/goods_category/${page}?limit=${limit}`)
}

export function createCategory(data) {
  return axios.post('/admin/goods_category', data)
}

export function updateCategory(id, data) {
  return axios.post(`/admin/goods_category/${id}`, data)
}

export function deleteCategory(id) {
  return axios.post(`/admin/goods_category/${id}/delete`)
}

// 下拉选项用的全部分类（不分页）
export function getAllCategories() {
  return axios.get('/admin/goods_category/all')
}
