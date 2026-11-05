import axios from '@/axios'

export function getGoodsList(page = 1, params = {}) {
  const query = new URLSearchParams({ page, limit: 10, ...params }).toString()
  return axios.get(`/admin/goods?${query}`)
}

export function createGoods(data) {
  return axios.post('/admin/goods', data)
}

export function updateGoods(id, data) {
  return axios.post(`/admin/goods/${id}`, data)
}

export function deleteGoods(id) {
  return axios.post(`/admin/goods/${id}/delete`)
}
