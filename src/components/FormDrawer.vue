<template>
  <el-drawer v-model="drawer" :title="title" :destroy-on-close="destroyOnClose" :size="size" :close-on-click-modal="false">
    <div class="formDrawer"><div class="body"><slot></slot></div><div class="action">
      <el-button type="primary" @click="submit" :loading="loading">
        {{ confirmText }}
      </el-button>
      <el-button type="default" @click="close">取消</el-button>
    </div></div>

  </el-drawer>
</template>
<script setup>
import { ref } from 'vue'
const drawer = ref(false)
const open = () => {
  drawer.value = true
}
const close = () => {
  drawer.value = false
}
const showLoading = () => {
  loading.value = true
}
const hideLoading = () => {
  loading.value = false
}
defineExpose({
  open,
  close,
  showLoading,
  hideLoading
})
const submit = () => {
  emit('submit')
}
const emit = defineEmits(['submit'])
const props = defineProps({
  title: {
    type: String,
    default: '修改密码'
  },
  size: {
    type: String,
    default: '45%'
  },
  destroyOnClose: {
    type: Boolean,
    default: false
  },
  confirmText: {
    type: String,
    default: '提交'
  }
})
const loading = ref(false)

</script>
<style scoped>
.formDrawer {
  @apply flex flex-col items-start;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.formDrawer .body {
  width: 100%;
  padding: 0 16px;
}
.formDrawer .action {
  @apply flex items-center;
  width: 100%;
  padding: 12px 16px;
  margin-top: 8px;
}
</style>
