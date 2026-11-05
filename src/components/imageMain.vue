<template>
  <el-main class="image-main" v-loading="loading">
    <div class="top">
      <el-row :gutter="10">
      <el-col v-for="item in list" :key="item.id" :span="6" >
       <el-card shadow="hover" class="image-card" :body-style="{ padding: '0', height: '100%', display: 'flex', flexDirection: 'column' }">
        <div class="image-wrap">
          <el-image :src="item.url" alt="" fit="cover" style="width: 100%; height: 100%;" :preview-src-list="[item.url]" :initial-index="0"></el-image>
          <div class="image-title">{{item.name}}</div>
        </div>
        
        
       </el-card>
      </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit" 
           @current-change="getData" @size-change="getData"></el-pagination>
    </div>
  </el-main>
  <el-drawer title="上传图片" v-model="drawer">
    <uploadfile :data="{ image_class_id }" @success="handleSuccess"></uploadfile>
  </el-drawer>
</template>
<script setup>
import { getImageList } from '@/api/image.js'
import { ref,reactive } from 'vue'
import uploadfile from '@/components/uploadfile.vue'

const drawer = ref(false)
const open_upload = () => {
  drawer.value = true
}
const total = ref(0)
const currentPage = ref(1)
const limit = ref(10)
const list = ref([])
const loading = ref(false)
const image_class_id = ref(0)

function getData(p=null) {
  if (p) {
    currentPage.value = p
  }
  loading.value = true
  getImageList(image_class_id.value, currentPage.value).then(res => {
    console.log('图片接口返回:', res)
    list.value = res.list || []
    total.value = res.total ?? res.totalCount ?? 0
  }).catch(err => {
    console.error('图片加载失败:', err)
  }).finally(() => {
    loading.value = false
  })
}

const load_data = (id) => {
  currentPage.value = 1
  image_class_id.value = id
  getData()
}
const handleSuccess = (data) => {
  getData()
}

defineExpose({
  load_data,
  open_upload
})
</script>
<style scoped>
.image-main {
  position: relative;
}
.image-main .top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow-y: auto;
}
.image-main .bottom {
  @apply flex items-center justify-center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
}
.image-card {
  height: 180px;
}
.image-wrap {
  position: relative;
  flex: 1;
  width: 100%;
  overflow: hidden;
}
.image-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  @apply text-sm text-gray-100 bg-black bg-opacity-50 px-2 py-1;
  height: 28px;

  opacity: 0;
}
.image-wrap:hover .image-title {
  height: 20%;
  opacity: 1;
  background-color: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
}
</style>
