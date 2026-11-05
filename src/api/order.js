import axios from '@/axios'

// 交易记录列表
export function getTradeList(page = 1, params = {}) {
  const query = new URLSearchParams({ page, limit: 10, ...params }).toString()
  return axios.get(`/admin/order?${query}`)
}

// 获取交易详情
export function getTradeDetail(id) {
  return axios.get(`/admin/order/${id}`)
}

// 更新交易状态
export function updateTradeStatus(id, status) {
  return axios.post(`/admin/order/${id}/status`, { status })
}
