<template>
  <div>
    <h1>可根据实际后端接口进行操作，右边报错的原因是没有相应后端接口</h1>
  </div>
  <div class="category-page">
    <el-header class="page-header">
      <h2>物品分类管理</h2> 
      <el-button type="primary" @click="handleCreate" size="small">新增分类</el-button>
    </el-header>

    <el-table :data="list" v-loading="loading" stripe border style="width: 100%; margin-top: 16px">
      <el-table-column type="index" label="#" width="60" align="center" />
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="order" label="排序" width="100" align="center" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      v-if="total > 0"
      background
      layout="prev, pager, next, total"
      :total="total"
      :current-page="currentPage"
      :page-size="limit"
      @current-change="getData"
    />

    <!-- 抽屉表单 -->
    <FormDrawer ref="formDrawerRef" :title="Edit ? '修改分类' : '新增分类'" @submit="submit">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="999" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import FormDrawer from '@/components/FormDrawer.vue'
import { toast } from '@/composables/util.js'
import { getCategoryList, createCategory, updateCategory, deleteCategory } from '@/api/category.js'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const currentPage = ref(1)
const limit = ref(10)

const formDrawerRef = ref(null)
const formRef = ref(null)
const Edit = ref(null)

const form = reactive({ name: '', order: 50 })
const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
}

function getData(page = currentPage.value) {
  currentPage.value = page
  loading.value = true
  getCategoryList(page, limit.value).then(res => {
    list.value = res.list || []
    total.value = res.totalCount ?? res.total ?? 0
  }).finally(() => {
    loading.value = false
  })
}

function handleCreate() {
  Edit.value = null
  form.name = ''
  form.order = 50
  formDrawerRef.value.open()
}

function handleEdit(row) {
  Edit.value = row.id
  form.name = row.name
  form.order = row.order
  formDrawerRef.value.open()
}

function handleDelete(row) {
  ElMessageBox.confirm(`确定要删除分类「${row.name}」吗？`, '提示', {
    type: 'warning',
  }).then(() => {
    deleteCategory(row.id).then(() => {
      toast('删除成功')
      getData()
    })
  }).catch(() => {})
}

function submit() {
  formRef.value.validate(valid => {
    if (!valid) return
    formDrawerRef.value.showLoading()
    const req = Edit.value
      ? updateCategory(Edit.value, form)
      : createCategory(form)
    req.then(() => {
      toast(Edit.value ? '修改成功' : '新增成功')
      getData(Edit.value ? currentPage.value : 1)
      formDrawerRef.value.close()
    }).finally(() => {
      formDrawerRef.value.hideLoading()
    })
  })
}

onMounted(() => {
  getData()
})
</script>

<style scoped>
.category-page {
  padding: 16px;
}
.page-header {
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  height: auto;
  margin-bottom: 8px;
}
.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
