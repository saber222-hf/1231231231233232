<template>
  <el-row :gutter="20" class="mt-5">
    <el-col :span="3" :offset="0" v-for="(item,index) in iconNavs" :key="index">
      <el-card shadow="hover" @click="$router.push(item.path)">
        <div class="flex justify-between items-center cursor-pointer flex-col">
          <el-icon :class="item.color" :size="3" />
          <component :is="item.icon" />
          <span class="text-sm mt-2">{{ item.title }}</span>
        </div>
      </el-card>
    </el-col>

  </el-row>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const iconNavs = [
  {
    icon: "user",
    color:"text-light-blue-500",
    title: '用户',
    path:'/user/list'
  },
  {
    icon: "shopping-cart",
    color:"text-violet-500",
    title: '二手物品',
    path:'/goods/list'
  },
  {
    icon: "tickets",
    color:"text-fuchsia-500",
    title: '交易记录',
    path:'/order/list'
  },
  {
    icon: "chat-dot-square",
    color:"text-teal-500",
    title: '评论',
    path:'/comment/list'
  },
  {
    icon: "picture",
    color:"text-rose-500",
    title: '图库',
    path:'/image/list'
  },{
    icon: "bell",
    color:"text-green-500",
    title: '公告',
    path:'/notice/list'
  },{
    icon: "set-up",
    title: '配置',
    color:"text-yellow-500",
    path:'/setting/base'
  },{
    icon: "files",
    title: '分类',
    color:"text-yellow-500",
    path:'/category/list'
  }
]
</script>
