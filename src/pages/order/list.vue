<template>
  <div class="order-page">
    <el-header class="page-header">
      <h2>交易记录</h2>
      <div>
        <el-select
          v-model="filterStatus"
          placeholder="按交易状态筛选"
          clearable
          size="small"
          style="width: 140px; margin-right: 10px"
          @change="onFilter"
        >
          <el-option label="待见面" value="pending" />
          <el-option label="交易中" value="trading" />
          <el-option label="已完成" value="completed" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
        <el-input
          v-model="searchKeyword"
          placeholder="搜索物品名称/卖家"
          clearable
          size="small"
          style="width: 200px; margin-right: 10px"
          @keyup.enter="getData(1)"
          @clear="getData(1)"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </el-header>

    <el-table :data="list" v-loading="loading" stripe border style="width: 100%; margin-top: 16px">
      <el-table-column type="index" label="#" width="60" align="center" />
      <el-table-column prop="id" label="交易编号" width="100" align="center" />
      <el-table-column label="物品信息" min-width="200">
        <template #default="{ row }">
          <div class="item-info">
            <el-image
              v-if="row.item_img"
              :src="row.item_img"
              style="width: 50px; height: 50px; border-radius: 6px"
              fit="cover"
            />
            <div v-else class="img-placeholder-sm">无图</div>
            <div class="item-detail">
              <div class="item-name">{{ row.item_name }}</div>
              <div class="item-price">¥{{ row.price }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="卖家" width="120" align="center">
        <template #default="{ row }">
          <div class="user-cell">
            <el-avatar :size="28" :src="row.seller_avatar">
              {{ (row.seller || 'S').charAt(0).toUpperCase() }}
            </el-avatar>
            <span>{{ row.seller }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="买家" width="120" align="center">
        <template #default="{ row }">
          <div class="user-cell">
            <el-avatar :size="28" :src="row.buyer_avatar">
              {{ (row.buyer || 'B').charAt(0).toUpperCase() }}
            </el-avatar>
            <span>{{ row.buyer }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="location" label="交易地点" width="160" align="center" show-overflow-tooltip />
      <el-table-column label="交易时间" width="170" align="center">
        <template #default="{ row }">
          {{ row.trade_time || row.create_time }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag size="small" :type="statusTagType(row.status)">{{ statusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="handleDetail(row)">详情</el-button>
          <el-button
            v-if="row.status === 'pending' || row.status === 'trading'"
            type="success" size="small" link @click="handleComplete(row)"
          >完成</el-button>
          <el-button
            v-if="row.status === 'pending' || row.status === 'trading'"
            type="danger" size="small" link @click="handleCancel(row)"
          >取消</el-button>
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

    <!-- 交易详情对话框 -->
    <el-dialog v-model="detailVisible" title="交易详情" width="500px">
      <div class="detail-content" v-if="currentDetail">
        <h4>物品信息</h4>
        <div class="detail-row">
          <span class="label">物品名称：</span>
          <span>{{ currentDetail.item_name }}</span>
        </div>
        <div class="detail-row">
          <span class="label">成交价格：</span>
          <span class="price">¥{{ currentDetail.price }}</span>
        </div>
        <el-divider />
        <h4>交易双方</h4>
        <div class="detail-row">
          <span class="label">卖家：</span>
          <span>{{ currentDetail.seller }}（{{ currentDetail.seller_contact || '未填写联系' }}）</span>
        </div>
        <div class="detail-row">
          <span class="label">买家：</span>
          <span>{{ currentDetail.buyer }}（{{ currentDetail.buyer_contact || '未填写联系' }}）</span>
        </div>
        <el-divider />
        <h4>交易信息</h4>
        <div class="detail-row">
          <span class="label">交易地点：</span>
          <span>{{ currentDetail.location || '未指定' }}</span>
        </div>
        <div class="detail-row">
          <span class="label">交易时间：</span>
          <span>{{ currentDetail.trade_time || currentDetail.create_time }}</span>
        </div>
        <div class="detail-row">
          <span class="label">当前状态：</span>
          <el-tag size="small" :type="statusTagType(currentDetail.status)">{{ statusText(currentDetail.status) }}</el-tag>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { toast } from '@/composables/util.js'
import { getTradeList, updateTradeStatus } from '@/api/order.js'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const currentPage = ref(1)
const limit = ref(10)
const filterStatus = ref('')
const searchKeyword = ref('')

const detailVisible = ref(false)
const currentDetail = ref(null)

// 状态对应的标签颜色
function statusTagType(status) {
  const map = {
    'pending': 'warning',
    'trading': '',
    'completed': 'success',
    'cancelled': 'info',
  }
  return map[status] || 'info'
}

function statusText(status) {
  const map = {
    'pending': '待见面',
    'trading': '交易中',
    'completed': '已完成',
    'cancelled': '已取消',
  }
  return map[status] || '未知'
}

function getData(page = currentPage.value) {
  currentPage.value = page
  loading.value = true
  const params = {}
  if (filterStatus.value) params.status = filterStatus.value
  if (searchKeyword.value) params.keyword = searchKeyword.value
  getTradeList(page, params).then(res => {
    list.value = res.list || []
    total.value = res.totalCount ?? res.total ?? 0
  }).finally(() => {
    loading.value = false
  })
}

function onFilter() {
  getData(1)
}

function handleDetail(row) {
  currentDetail.value = row
  detailVisible.value = true
}

function handleComplete(row) {
  ElMessageBox.confirm(`确认物品「${row.item_name}」交易完成？`, '确认完成', {
    type: 'success',
  }).then(() => {
    updateTradeStatus(row.id, 'completed').then(() => {
      toast('交易已标记为完成')
      getData()
    })
  }).catch(() => {})
}

function handleCancel(row) {
  ElMessageBox.confirm(`确认取消物品「${row.item_name}」的交易？`, '确认取消', {
    type: 'warning',
  }).then(() => {
    updateTradeStatus(row.id, 'cancelled').then(() => {
      toast('交易已取消')
      getData()
    })
  }).catch(() => {})
}

onMounted(() => {
  getData()
})
</script>

<style scoped>
.order-page {
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
.item-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.img-placeholder-sm {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  border: 1px dashed #dcdfe6;
  color: #c0c4cc;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.item-detail {
  display: flex;
  flex-direction: column;
}
.item-name {
  font-weight: 500;
  font-size: 13px;
  color: #303133;
}
.item-price {
  font-size: 12px;
  color: #f56c6c;
  font-weight: 600;
}
.user-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
}
.detail-content h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 15px;
}
.detail-row {
  display: flex;
  padding: 6px 0;
  font-size: 13px;
}
.detail-row .label {
  width: 80px;
  color: #909399;
  flex-shrink: 0;
}
.detail-row .price {
  color: #f56c6c;
  font-weight: 600;
  font-size: 15px;
}
</style>
