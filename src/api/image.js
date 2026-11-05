import axios from '@/axios'
export function getImageList(id,page) {
  return axios.get(`/admin/image_class/${id}/image/${page}`)
}
export const upload_image_action = '/api/admin/image/upload'