<template>
  <div class="user-page">
    <el-header class="page-header">
      <h2>校园用户管理</h2>
      <div>
        <el-select
          v-model="filterCollege"
          placeholder="按学院筛选"
          clearable
          size="small"
          style="width: 160px; margin-right: 10px"
          @change="onFilter"
        >
          <el-option v-for="c in collegeOptions" :key="c" :label="c" :value="c" />
        </el-select>
        <el-input
          v-model="searchKeyword"
          placeholder="搜索学号/昵称"
          clearable
          size="small"
          style="width: 180px; margin-right: 10px"
          @keyup.enter="getData(1)"
          @clear="getData(1)"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleCreate" size="small">新增学生</el-button>
      </div>
    </el-header>

    <el-table :data="list" v-loading="loading" stripe border style="width: 100%; margin-top: 16px">
      <el-table-column type="index" label="#" width="60" align="center" />
      <el-table-column prop="id" label="ID" width="70" align="center" />
      <el-table-column label="头像" width="80" align="center">
        <template #default="{ row }">
          <el-avatar :size="40" :src="row.avatar">
            {{ (row.nickname || row.username || '?').charAt(0).toUpperCase() }}
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="student_no" label="学号" width="140" align="center" />
      <el-table-column prop="nickname" label="昵称" width="120" align="center" />
      <el-table-column prop="college" label="学院" width="140" align="center" />
      <el-table-column prop="grade" label="年级" width="90" align="center" />
      <el-table-column label="信用分" width="100" align="center">
        <template #default="{ row }">
          <el-rate
            :model-value="creditToRate(row.credit)"
            disabled
            size="small"
            show-text
            :texts="['差','一般','良好','优秀','极佳']"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag size="small" :type="row.status === 'active' ? 'success' : 'danger'">
            {{ row.status === 'active' ? '正常' : '已禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="注册时间" width="170" align="center" />
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="handleEdit(row)">编辑</el-button>
          <el-button
            v-if="row.status === 'active'"
            type="warning" size="small" link @click="handleBan(row)"
          >禁用</el-button>
          <el-button
            v-else
            type="success" size="small" link @click="handleUnban(row)"
          >启用</el-button>
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
    <FormDrawer ref="formDrawerRef" :title="Edit ? '编辑学生信息' : '新增学生'" @submit="submit" size="45%">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="学号" prop="student_no">
          <el-input v-model="form.student_no" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="学院" prop="college">
          <el-select v-model="form.college" placeholder="请选择学院" style="width: 100%" filterable allow-create>
            <el-option v-for="c in collegeOptions" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-select v-model="form.grade" placeholder="请选择年级" style="width: 100%">
            <el-option v-for="g in gradeOptions" :key="g" :label="g" :value="g" />
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="form.major" placeholder="请输入专业（可选）" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!Edit">
          <el-input v-model="form.password" type="password" show-password placeholder="请设置初始密码" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import FormDrawer from '@/components/FormDrawer.vue'
import { toast } from '@/composables/util.js'
import { getUserList, createUser, deleteUser } from '@/api/user.js'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const currentPage = ref(1)
const limit = ref(10)
const filterCollege = ref('')
const searchKeyword = ref('')

const formDrawerRef = ref(null)
const formRef = ref(null)
const Edit = ref(null)

// 校园常见学院
const collegeOptions = [
  '计算机学院', '电子信息学院', '机械工程学院', '经济管理学院',
  '外国语学院', '数学学院', '物理学院', '化学学院',
  '文学院', '法学院', '医学院', '艺术学院', '体育学院'
]

const gradeOptions = ['大一', '大二', '大三', '大四', '研一', '研二', '研三']

const form = reactive({
  student_no: '',
  nickname: '',
  college: '',
  grade: '',
  major: '',
  password: '',
})

const rules = {
  student_no: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  college: [{ required: true, message: '请选择学院', trigger: 'change' }],
  grade: [{ required: true, message: '请选择年级', trigger: 'change' }],
  password: [{ required: true, message: '请设置密码', trigger: 'blur' }],
}

function creditToRate(credit) {
  // 信用分 0-100 映射到 0-5 星
  const c = Number(credit) || 80
  return Math.min(5, Math.max(0, Math.round(c / 20)))
}

function getData(page = currentPage.value) {
  currentPage.value = page
  loading.value = true
  const params = {}
  if (filterCollege.value) params.college = filterCollege.value
  if (searchKeyword.value) params.keyword = searchKeyword.value
  getUserList(page, params).then(res => {
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
  form.student_no = ''
  form.nickname = ''
  form.college = ''
  form.grade = ''
  form.major = ''
  form.password = ''
}

function handleCreate() {
  Edit.value = null
  resetForm()
  formDrawerRef.value.open()
}

function handleEdit(row) {
  Edit.value = row.id
  form.student_no = row.student_no || row.username || ''
  form.nickname = row.nickname || row.username || ''
  form.college = row.college || ''
  form.grade = row.grade || ''
  form.major = row.major || ''
  formDrawerRef.value.open()
}

function handleBan(row) {
  ElMessageBox.confirm(`确定要禁用学生「${row.nickname || row.username}」的账号吗？`, '禁用账号', {
    type: 'warning',
  }).then(() => {
    toast('已禁用（需后端配合实现状态更新）')
    getData()
  }).catch(() => {})
}

function handleUnban(row) {
  ElMessageBox.confirm(`确定要恢复学生「${row.nickname || row.username}」的账号吗？`, '启用账号', {
    type: 'success',
  }).then(() => {
    toast('已启用（需后端配合实现状态更新）')
    getData()
  }).catch(() => {})
}

function handleDelete(row) {
  ElMessageBox.confirm(`确定要删除学生「${row.nickname || row.username}」吗？此操作不可恢复！`, '警告', {
    type: 'error',
  }).then(() => {
    deleteUser(row.id).then(() => {
      toast('删除成功')
      getData()
    })
  }).catch(() => {})
}

function submit() {
  formRef.value.validate(valid => {
    if (!valid) return
    formDrawerRef.value.showLoading()
    const payload = {
      student_no: form.student_no,
      nickname: form.nickname,
      college: form.college,
      grade: form.grade,
      major: form.major,
    }
    if (!Edit.value) payload.password = form.password

    createUser(payload).then(() => {
      toast(Edit.value ? '修改成功' : '新增成功')
      formDrawerRef.value.close()
      getData(Edit.value ? currentPage.value : 1)
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
.user-page {
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
