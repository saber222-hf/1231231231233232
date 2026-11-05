<template>
  <div>
    <el-row :gutter="20" v-permission="['getStatistics1,GET']">
     <template v-if="panels.length === 0">
       <el-col :span="6" v-for="i in 4" :key="i">
      <el-skeleton style="width:100%" animated loading>
        <template #template>
           <el-card shadow="hover" class="border-0">
          <template #header >
            <div class="flex justify-between">
              <el-skeleton-item variant="text" style="height: 50%;"></el-skeleton-item>
              <el-skeleton-item variant="text" style="height: 10%;"></el-skeleton-item>
            </div>
          </template>
         <el-skeleton-item variant="h3" style="height: 80%;"></el-skeleton-item>
          <el-divider></el-divider>
          <div class="flex justify-between text-sm text-gray-500">
            <el-skeleton-item variant="text" style="height: 50%;"></el-skeleton-item>
          <el-skeleton-item variant="text" style="height: 10%;"></el-skeleton-item>

          </div>
        </el-card>
        </template>
        </el-skeleton>
        </el-col>
     </template>
       
         <el-col :span="6" :offset="0" v-for="(item,index) in panels" :key="index">
        <el-card shadow="hover" class="border-0">
          <template #header >
            <div class="flex justify-between">
              <span text-sm>{{ item.title }}</span>
              <el-tag :type="item.unitColor" effect="plain">{{ item.unit }}</el-tag>
            </div>
          </template>
          <span class="text-3xl font-bold text-gray-500">
            <countTo :value="item.value" />
          </span>
          <el-divider></el-divider>
          <div class="flex justify-between items-sm text-gray-500">
            <span>{{ item.subTitle }}</span>
            <span>{{ item.subValue }}{{ item.subUnit }}</span>
          </div>
        </el-card>
      </el-col>
      </el-row>
      <indexNavs />
      <el-row :gutter="20" class="mt-5">
        <el-col :span="12">
          <indexChar v-permission="['getStatistics3,GET']" />
        </el-col>
        <el-col :span="12" v-permission="['getStatistics2,GET']">
          <indexCard class="mb-3" title="物品提示" tip="待处理二手物品" :btns="goods" />
          <indexCard title="交易提示" tip="需要处理的交易记录" :btns="order" />
        </el-col>
      </el-row>
     
  </div>
</template>

<script setup>
import { getStatistics1, getStatistics2 } from '@/api/index.js'
import { onMounted, ref } from 'vue'
import { toast } from '@/composables/util.js'
import countTo from '@/layout/components/countTo.vue'
import indexNavs from '@/layout/components/indexNavs.vue'
import indexChar from '@/components/indexChar.vue'
import indexCard from '@/components/indexCard.vue'



const panels = ref([])
const goods = ref([])
const order = ref([])

onMounted(() => {
  getStatistics1()
    .then(res => {
      // axios 响应拦截器已经返回 response.data.data，这里不能再次读取 res.data。
      panels.value = Array.isArray(res?.panels) ? res.panels : []
    })
    .catch(() => {
      toast('首页统计数据加载失败', 'error')
    })
  getStatistics2()
    .then(res => {
      // axios 响应拦截器已经返回 response.data.data，这里不能再次读取 res.data。
      goods.value = Array.isArray(res?.goods) ? res.goods : []
      order.value = Array.isArray(res?.order) ? res.order : []
    })
    .catch(() => {
      toast('首页统计数据加载失败', 'error')
    })
})
</script>
