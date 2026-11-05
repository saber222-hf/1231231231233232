<template>
  <div class="asidelist" :class="{'active': active}">
          <span class="truncate"><slot></slot></span>
          <el-button text type="primary" size="small" class="ml-auto px-1" @click="$emit('edit')"><el-icon :size="12"><Edit/></el-icon></el-button>
          <el-popconfirm title="确认删除吗？" confirmButtonText="确定" cancelButtonText="取消" @confirm="$emit('delate')">
            <template #reference>
            <el-button text type="primary" size="small" class="px-1" ><el-icon :size="12"><Close/></el-icon></el-button>
            </template>
          </el-popconfirm>
        </div>
</template>
<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  }
})
defineEmits(['edit','delate'])
</script>

<style scoped>
.asidelist {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center justify-between p-3 text-sm text-gray-600;
  cursor: pointer;
}
.asidelist:hover,.active {
  @apply bg-blue-50;
}
</style>
