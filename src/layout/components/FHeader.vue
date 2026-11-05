<template>
  <div class="f-header">
    <span class="logo"><el-icon class="mr-1"><eleme-filled></eleme-filled></el-icon>校园二手交易</span>
    <el-icon class="icon-btn" @click="$store.commit('handleAsideWith')">
      <fold v-if="$store.state.asideWith === '250px' " />
      <Expand v-else />
    </el-icon>
    <el-tooltip content="刷新" placement="bottom" effect="dark">
      <el-icon class="icon-btn" @click="handleRefreshClick">
        <refresh />
      </el-icon>
    </el-tooltip>
    <div class="ml-auto flex items-center">
      <el-tooltip content="全屏" placement="bottom" effect="dark">
        <el-icon class="icon-btn" @click="toggle"><full-screen v-if="!isFullscreen" />
          <aim v-else />
        </el-icon>
      </el-tooltip>
      <el-dropdown class="dropdown" @command="handleCommand">
        <span class="flex items-center justify-center text-light-50">
          <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" icon="UserFilled" />
          {{ $store.state.user.username }}

          <el-icon class="el-icon--right"><arrow-down /></el-icon>

        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
 
  <form-drawer ref="formDrawer" @submit="onSubmit" title="修改密码" :destroyOnClose="true" confirmText="修改">
 
     <el-form ref="formRef" :rules="rules" :model="form" label-width="80px" size="small">
      <el-form-item prop="oldPassword" label="旧密码">
        <el-input v-model="form.oldpassword" placeholder="请输入旧密码"  type="password" autocomplete="off" show-password>
          
        </el-input>
      </el-form-item>
      <el-form-item prop="password" label="新密码">
        <el-input v-model="form.password" type="password" autocomplete="new-password" placeholder="请输入密码" show-password
          @keyup.enter="onSubmit">
         
        </el-input>
      </el-form-item>
      <el-form-item prop="repassword" label="确认密码">
        <el-input v-model="form.repassword" type="password" autocomplete="new-password" placeholder="请确认密码" show-password
          @keyup.enter="onSubmit">
         
        </el-input>
      </el-form-item>

      <el-form-item>
       

      </el-form-item>
    </el-form>

    </form-drawer>




</template>
<script setup>
import { useFullscreen } from '@vueuse/core'
import FormDrawer from '@/components/FormDrawer.vue'
import { useRepassword, useLogout } from '@/composables/repassword'
import { ref } from 'vue'
const drawer = ref(false)
const { isFullscreen, toggle } = useFullscreen()
const { formDrawer, rules, formRef, form, loading, onSubmit } = useRepassword()
const { handleLogout } = useLogout()

const handleRefreshClick = () => {
  window.location.reload()
}
const handleCommand = (command) => {
  switch (command) {
    case 'logout':
      handleLogout()
      break;
    case 'changePassword':
      formDrawer.value.open()
      break;
  }
}




</script>
<style>
.f-header {
  @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
  height: 64px;
  z-index: 999;
}

.logo {
  @apply text-xl font-thin flex justify-center items-center;
  width: 250px;

}

.icon-btn {
  @apply flex justify-center items-center;
  width: 42px;
  height: 64px;
  cursor: pointer;
}

.icon-btn:hover {
  @apply bg-indigo-600 text-white;
}

.f-header .dropdown {
  @apply flex items-center justify-center mx-5;
  height: 64px;
  cursor: pointer;
}
</style>
