<template>

  <el-container class="bg-white rounded" :style="{ height: h + 'px' }">
    <el-header class="image-header">
      <el-button type="primary" @click="handleOpenCreate" size="small" >创建分类</el-button>
      <el-button type="primary" @click="handleOpenUpload" size="small" class="mr-220">上传图片</el-button>
    </el-header>
    <el-container>
      <imageAside ref="imageAsideRef" @change="handleChange" />

      <imageMain ref="imageMainRef" />
    </el-container>
  </el-container>
</template>
<script setup>
import { ref } from 'vue'
import imageAside from '@/components/imageAside.vue'
import imageMain from '@/components/imageMain.vue'
const windoeheight = window.innerHeight || document.documentElement.clientHeight
const h = windoeheight - 64 - 44 - 40
const imageAsideRef = ref(null)
const imageMainRef = ref(null)
const handleChange = (image_class_id) => {
  imageMainRef.value.load_data(image_class_id)
}
const handleOpenCreate = () => {
  imageAsideRef.value.handleCreate()
}
const handleOpenUpload = () => {
  imageMainRef.value.open_upload()
}
</script>
<style scoped>
.image-header {
  border-bottom: 1px solid #eeeeee;
  @apply flex justify-between items-center;
}
</style>
