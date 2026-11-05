<template>
  <el-upload
    :action="upload_image_action"
    :headers="{
      token
    }"
    name="img"
    :data="data"
    :on-success="uploadSuccess"
    :on-error="uploadError"
  >
    <el-icon class="el-icon--upload"><upload-filled/>
    </el-icon>
    <div class="el-upload__text"><em>点击上传</em></div>
    <template #tip>
      <div class="el-upload__tip">
        仅支持上传jpg/png格式图片，且图片大小不超过超过2MB
      </div>
    </template>
  </el-upload>
</template>
<script setup>
import { upload_image_action } from '@/api/image.js'
import { getToken } from '@/composables/auth.js'
import { toast } from '@/composables/util.js'
const token = getToken()
defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['success', 'error'])
const uploadSuccess = (response,uploadFile,uploadFiles) => {
  emit('success', {response,uploadFile,uploadFiles})
}
const uploadError = (error,uploadFile,uploadFiles) => {
  let msg = '上传失败'
  try {
    msg = JSON.parse(error.message).msg || msg
  } catch(e) {}
  toast(msg, 'error')
  emit('error', {error,uploadFile,uploadFiles})
}
</script>
