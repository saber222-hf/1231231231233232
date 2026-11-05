<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div>
    <el-button type="primary" @click="count++">Click me</el-button>
    <h1>Hello World</h1>
  </div>
</template>
