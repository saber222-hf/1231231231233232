<template>
  <el-row class="login-container">
    <!-- 左侧：背景图 + 遮罩 + 文字 -->
    <el-col :lg="16" :md="12" class="left">
      <div class="left-bg"></div>
      <div class="left-mask"></div>
      <div class="left-content">
        <h1 class="brand">校园二手交易平台</h1>
        <p class="slogan">让闲置物品重新找到主人</p>
        <div class="features">
          <div class="feature-item">
            <el-icon :size="20"><User /></el-icon>
            <span>真实校园身份</span>
          </div>
          <div class="feature-item">
            <el-icon :size="20"><ChatDotRound /></el-icon>
            <span>线下安全交易</span>
          </div>
          <div class="feature-item">
            <el-icon :size="20"><Coin /></el-icon>
            <span>零手续费</span>
          </div>
        </div>
      </div>
    </el-col>

    <!-- 右侧：登录表单 -->
    <el-col :lg="8" :md="12" class="right">
      <h2 class="title">欢迎回来</h2>
      <div class="divider-line">
        <span></span>
        <span>账号密码登录</span>
        <span></span>
      </div>
      <el-form ref="formRef" :rules="rules" :model="form" class="w-[280px]">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入账号（学号/管理员）">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" autocomplete="off" placeholder="请输入密码" show-password @keyup.enter="onSubmit">
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button round color="#626aef" class="w-[280px]" type="primary" @click="onSubmit" :loading="loading">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="copyright">© 2026 校园二手交易平台 · 让闲置物尽其用</div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { User, Lock, ChatDotRound, Coin } from '@element-plus/icons-vue'
import { login, getInfo } from '@/api/manager'
import { ElNotification } from 'element-plus'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { setToken } from '@/composables/auth'

const router = useRouter()
const store = useStore()

const rules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 20, message: '账号长度必须在3到20之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 20, message: '密码长度必须在3到20之间', trigger: 'blur' },
  ],
})

const formRef = ref(null)
const form = reactive({
  username: '',
  password: '',
})
const loading = ref(false)

const onSubmit = () => {
  formRef.value.validate(valid => {
    if (!valid) return
    loading.value = true
    login(form.username, form.password)
      .then(res => {
        setToken(res.token)
        ElNotification({
          message: '登录成功',
          type: 'success',
          duration: 2500,
        })
        return getInfo()
      })
      .then(() => {
        router.push('/')
      })
      .finally(() => {
        loading.value = false
      })
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
}

/* ========== 左侧 ========== */
.left {
  position: relative;
  height: 100vh;
  overflow: hidden;
}


.left-bg {
  position: absolute;
  inset: 0;
  background-image: url('/login-bg.jpg');
  background-size: cover;          /* 填满容器，不留黑边 */
  background-position: center;
  background-repeat: no-repeat;
}

/* 黑色半透明遮罩层 —— opacity 可调，数值越小越透明 */
.left-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

/* 文字内容层 —— 提高 z-index 到最顶层 */
.left-content {
  position: relative;
  z-index: 2;
  color: #fff;
  padding: 0 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  max-width: 520px;
  margin: 0 auto;
}

.left-content .brand {
  font-size: 44px;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0 0 20px 0;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
}

.left-content .slogan {
  font-size: 16px;
  font-weight: 300;
  margin: 0 0 48px 0;
  opacity: 0.9;
  letter-spacing: 1px;
}

.left-content .features {
  display: flex;
  gap: 28px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

/* ========== 右侧 ========== */
.right {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #2a2d35;        /* 深灰色，与左侧黑色背景协调 */
  position: relative;
}

.right .title {
  font-size: 28px;
  font-weight: 700;
  color: #f5f5f7;              /* 白色标题 */
  margin: 0 0 8px 0;
}

.divider-line {
  display: flex;
  align-items: center;
  margin: 20px 0 32px 0;
  color: #8a8f98;               /* 浅灰分割线文字 */
  font-size: 13px;
  gap: 12px;
}

.divider-line span:first-child,
.divider-line span:last-child {
  width: 60px;
  height: 1px;
  background: #4a4f59;          /* 深灰分割线 */
}

.divider-line span:nth-child(2) {
  flex-shrink: 0;
}

.copyright {
  position: absolute;
  bottom: 32px;
  font-size: 12px;
  color: #5a5f68;
}

/* 右侧表单 —— 深灰背景适配 */
.right :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15) inset;
}
.right :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #626aef inset;
}
.right :deep(.el-input__inner) {
  color: #f5f5f7;
}
.right :deep(.el-input__inner::placeholder) {
  color: #7a7f88;
}
.right :deep(.el-input__prefix .el-icon) {
  color: #7a7f88;
}
.right :deep(.el-input__password .el-icon) {
  color: #7a7f88;
}
</style>
