<template>
  <div class="f-mune" :style="{ width: $store.state.asideWith }">
    <el-menu :default-active="$route.path" class="border-0" @select="handleSelect" :unique-opened="true"
      :collapse-transition="false" :collapse="isCollapse">
      <template v-for="(item, index) in asideMenu" :key="index">
        <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>


          <el-menu-item v-for="(item2, index2) in item.child" :key="index2" :index="item2.frontpath">
            <el-icon>
              <component :is="item2.icon"></component>
            </el-icon>
            <span>{{ item2.name }}</span>
          </el-menu-item>

        </el-sub-menu>
        <el-menu-item v-else :index="item.frontpath">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>

    </el-menu>
  </div>
</template>

<script setup>
import { computed,ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()

const router = useRouter()

const isCollapse = computed(() => store.state.asideWith === '64px')

const handleSelect = (index) => {
  router.push(index)
}

const asideMenu = computed(() => store.state.menus)
</script>

<style scoped>
.f-mune {
  transition: all 0.2s ease-in-out;
  top: 64px;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
  @apply shadow-md fixed bg-light-50;
}
.f-menu::-webkit-scrollbar {
  width: 0px;
}
</style>