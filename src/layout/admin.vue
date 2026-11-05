<template>
  <el-container>
    <el-header><FHeader /></el-header>
    <el-container>
      <el-aside :width="$store.state.asideWith"><FMune /></el-aside>
      <el-main>
       
       <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import FHeader from '@/layout/components/FHeader.vue'
import FMune from '@/layout/components/FMune.vue'
import FTagList from '@/layout/components/FTagList.vue'
</script>
<style scoped>
.el-aside {
  transition: all 0.2s ease-in-out;
}
.el-main {
  background-color: rgb(247, 247, 247);
  flex: 1;
}

</style>
