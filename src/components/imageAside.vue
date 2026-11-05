<template>
  <el-aside width="200px" class="image-aside" v-loading="loading">
        <div class="top">
          <Asidelist v-for="(item,index) in list" :key="index" :active="activeID === item.id" @edit="handleEdit(item)" @click="setActiveID(item.id)" @delate="handleDelate(item.id)">{{item.name}}</Asidelist>

          
        </div>
        <div class="bottom">
           <el-pagination background layout="prev,next" :total="total" :current-page="currentPage" :page-size="limit" 
           @current-change="getData" @size-change="getData"></el-pagination>

        </div>
      </el-aside>
      <FormDrawer ref="formDrawerRef" @submit="submit" :title="Title">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="80px" :inline="false">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
          </el-form-item>
          <el-form-item label="分类排序">
            <el-input-number v-model="form.order" :min="0" :max="100"></el-input-number>
          </el-form-item>
        </el-form>
      </FormDrawer>
  
</template>
<script setup>
import Asidelist from '@/components/Asidelist.vue'
import { getImageClassList, createImageClassList, updateImageClass, deleteImageClass } from '@/api/imageclass.js'
import { ref, reactive, computed } from 'vue'
import FormDrawer from '@/components/FormDrawer.vue'
import { toast } from '@/composables/util.js'

const emit = defineEmits(['change'])
const loading = ref(false)
const activeID = ref(0)
const list = ref([])
const total = ref(0)
const currentPage = ref(1)
const limit = ref(10)
const Edit=ref(0)
const Title=computed(()=>Edit.value ? '修改分类' : '创建分类')
function getData(p=null) {
  if(p) {
    currentPage.value = p
  }
  loading.value = true 
  getImageClassList(currentPage.value).then(res => {
    console.log('分类接口返回:', res)
    list.value = res.list || []
    total.value = res.totalCount ?? res.total ?? 0
    const item = list.value[0]
    if(item) {
      setActiveID(item.id)
    }
  }).finally(() => {
    loading.value = false
  })
}
getData()
const formDrawerRef = ref(null)
const handleCreate = () => {
  Edit.value = 0
  form.name = ''
  form.order = 50
  formDrawerRef.value.open()
}

const form = reactive({
  name: '',
  order: 50
})
const rules = reactive({
  name: [
    { required: true, message: '至少一张图片', trigger: 'blur' }
  ]
})
const formRef = ref(null)
const submit = () => {
  formRef.value.validate().then((valid) => {
    if(!valid)  return
    formDrawerRef.value.showLoading()
    const fun = Edit.value
      ? updateImageClass(Edit.value, form)
      : createImageClassList(form)
    fun.then(res => {
      toast(Title.value + '成功')
      getData(Edit.value ? currentPage.value : 1)

      formDrawerRef.value.close()
    }).finally(() => {
      formDrawerRef.value.hideLoading()
    })
    
  })
}
const handleEdit = (row) => {
  Edit.value = row.id
  form.name = row.name
  form.order = row.order
  formDrawerRef.value.open()
}
const handleDelate = (id) => {
  loading.value = true
  deleteImageClass(id).then(res => {
    toast('删除成功')
    getData()
  }).finally(() => {
    loading.value = false
  })
} 
function setActiveID(id) {
  activeID.value = id
  emit('change', id)
}
defineExpose({
  handleCreate
})
</script>
<style scoped>

.image-aside {
  border-right: 1px solid #eeeeee;
  position: relative;
}
.image-aside .top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow-y: auto;
}
.image-aside .bottom {
  @apply flex items-center justify-center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
}

</style>
