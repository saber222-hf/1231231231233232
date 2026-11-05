<template>
  <div class="goods-page">
    <el-header class="page-header">
      <h2>二手物品管理</h2>
      <div>
        <el-select
          v-model="filterCategory"
          placeholder="按分类筛选"
          clearable
          size="small"
          style="width: 160px; margin-right: 10px"
          @change="onFilter"
        >
          <el-option v-for="c in categoryOptions" :key="c.id" :label="c.name" :value="c.id" />
        </el-select>
        <el-select
          v-model="filterStatus"
          placeholder="按状态筛选"
          clearable
          size="small"
          style="width: 140px; margin-right: 10px"
          @change="onFilter"
        >
          <el-option label="在售中" value="on_sale" />
          <el-option label="已售出" value="sold" />
          <el-option label="下架" value="off_shelf" />
        </el-select>
        <el-button type="primary" @click="handleCreate" size="small">发布二手物品</el-button>
      </div>
    </el-header>

    <el-table :data="list" v-loading="loading" stripe border style="width: 100%; margin-top: 16px">
      <el-table-column type="index" label="#" width="60" align="center" />
      <el-table-column prop="id" label="ID" width="70" align="center" />
      <el-table-column label="图片" width="100" align="center">
        <template #default="{ row }">
          <el-image
            v-if="row.img"
            :src="row.img"
            style="width: 60px; height: 60px; border-radius: 6px"
            fit="cover"
            :preview-src-list="[row.img]"
          />
          <div v-else class="img-placeholder">无图</div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="物品名称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="category_name" label="分类" width="120" align="center" />
      <el-table-column label="成色" width="100" align="center">
        <template #default="{ row }">
          <el-tag size="small" :type="conditionTagType(row.condition)">{{ row.condition || '九成新' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" width="100" align="center">
        <template #default="{ row }">
          <span class="price-text">¥{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卖家" width="120" align="center">
        <template #default="{ row }">
          <span>{{ row.seller || '匿名' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag size="small" :type="statusTagType(row.status)">{{ statusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
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
    <FormDrawer ref="formDrawerRef" :title="Edit ? '编辑二手物品' : '发布二手物品'" @submit="submit" size="50%">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="物品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入物品名称，如：高等数学第七版" />
        </el-form-item>
        <el-form-item label="分类" prop="category_id">
          <el-select v-model="form.category_id" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="c in categoryOptions" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <div class="form-row">
          <el-form-item label="价格" prop="price">
            <el-input-number v-model="form.price" :min="0" :precision="2" :step="1" style="width: 100%" />
          </el-form-item>
          <el-form-item label="成色" prop="condition">
            <el-select v-model="form.condition" placeholder="选择成色" style="width: 100%">
              <el-option label="全新" value="全新" />
              <el-option label="九成新" value="九成新" />
              <el-option label="八成新" value="八成新" />
              <el-option label="七成新" value="七成新" />
              <el-option label="有瑕疵" value="有瑕疵" />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="卖家" prop="seller">
            <el-input v-model="form.seller" placeholder="卖家昵称" />
          </el-form-item>
          <el-form-item label="联系方式" prop="contact">
            <el-input v-model="form.contact" placeholder="QQ/微信/手机" />
          </el-form-item>
        </div>
        <el-form-item label="交易地点" prop="location">
          <el-input v-model="form.location" placeholder="如：东区食堂门口、图书馆一楼" />
        </el-form-item>
        <el-form-item label="物品图片">
          <uploadfile :data="{ from: 'goods' }" @success="onUploadSuccess" />
          <div v-if="form.img" class="img-preview">
            <el-image :src="form.img" style="width: 80px; height: 80px; border-radius: 6px" fit="cover" />
            <el-button type="danger" size="small" link @click="form.img = ''">移除</el-button>
          </div>
        </el-form-item>
        <el-form-item label="物品描述">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="详细描述一下物品的情况，方便买家了解~"
          />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import FormDrawer from '@/components/FormDrawer.vue'
import uploadfile from '@/components/uploadfile.vue'
import { toast } from '@/composables/util.js'
import { getGoodsList, createGoods, updateGoods, deleteGoods } from '@/api/goods.js'
import { getAllCategories } from '@/api/category.js'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const currentPage = ref(1)
const limit = ref(10)
const filterCategory = ref(null)
const filterStatus = ref('')
const categoryOptions = ref([])

const formDrawerRef = ref(null)
const formRef = ref(null)
const Edit = ref(null)

const form = reactive({
  name: '',
  category_id: null,
  price: 0,
  condition: '九成新',
  seller: '',
  contact: '',
  location: '',
  img: '',
  content: '',
})

const rules = {
  name: [{ required: true, message: '请输入物品名称', trigger: 'blur' }],
  category_id: [{ required: true, message: '请选择分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  condition: [{ required: true, message: '请选择成色', trigger: 'change' }],
}

// 成色对应的标签颜色
function conditionTagType(condition) {
  const map = {
    '全新': 'success',
    '九成新': '',
    '八成新': 'warning',
    '七成新': 'warning',
    '有瑕疵': 'danger',
  }
  return map[condition] || ''
}

// 状态对应的标签颜色
function statusTagType(status) {
  const map = {
    'on_sale': 'success',
    'sold': 'info',
    'off_shelf': 'danger',
  }
  return map[status] || 'info'
}

function statusText(status) {
  const map = {
    'on_sale': '在售中',
    'sold': '已售出',
    'off_shelf': '下架',
  }
  return map[status] || '未知'
}

// 拉全部分类（用于下拉）
function loadCategories() {
  getAllCategories().then(res => {
    categoryOptions.value = res.list || res || []
  }).catch(() => {
    categoryOptions.value = []
  })
}

function getData(page = currentPage.value) {
  currentPage.value = page
  loading.value = true
  const params = {}
  if (filterCategory.value) params.category_id = filterCategory.value
  if (filterStatus.value) params.status = filterStatus.value
  getGoodsList(page, params).then(res => {
    list.value = res.list || []
    total.value = res.totalCount ?? res.total ?? 0
  }).finally(() => {
    loading.value = false
  })
}

function onFilter() {
  getData(1)
}

function resetForm() {
  form.name = ''
  form.category_id = null
  form.price = 0
  form.condition = '九成新'
  form.seller = ''
  form.contact = ''
  form.location = ''
  form.img = ''
  form.content = ''
}

function handleCreate() {
  Edit.value = null
  resetForm()
  formDrawerRef.value.open()
}

function handleEdit(row) {
  Edit.value = row.id
  form.name = row.name
  form.category_id = row.category_id
  form.price = row.price
  form.condition = row.condition || '九成新'
  form.seller = row.seller || ''
  form.contact = row.contact || ''
  form.location = row.location || ''
  form.img = row.img || ''
  form.content = row.content || ''
  formDrawerRef.value.open()
}

function handleDelete(row) {
  ElMessageBox.confirm(`确定要删除物品「${row.name}」吗？`, '提示', {
    type: 'warning',
  }).then(() => {
    deleteGoods(row.id).then(() => {
      toast('删除成功')
      getData()
    })
  }).catch(() => {})
}

function onUploadSuccess({ response }) {
  form.img = response?.data?.url || response?.url || response
  toast('图片上传成功')
}

function submit() {
  formRef.value.validate(valid => {
    if (!valid) return
    formDrawerRef.value.showLoading()
    const req = Edit.value
      ? updateGoods(Edit.value, form)
      : createGoods(form)
    req.then(() => {
      toast(Edit.value ? '修改成功' : '发布成功')
      getData(Edit.value ? currentPage.value : 1)
      formDrawerRef.value.close()
    }).finally(() => {
      formDrawerRef.value.hideLoading()
    })
  })
}

onMounted(() => {
  loadCategories()
  getData()
})
</script>

<style scoped>
.goods-page {
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
.img-placeholder {
  width: 60px;
  height: 60px;
  margin: 0 auto;
  border-radius: 6px;
  border: 1px dashed #dcdfe6;
  color: #c0c4cc;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-row {
  display: flex;
  gap: 16px;
}
.form-row .el-form-item {
  flex: 1;
}
.img-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}
.price-text {
  color: #f56c6c;
  font-weight: 600;
}
</style>
