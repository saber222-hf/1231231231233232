import { createRouter, createWebHashHistory } from 'vue-router'
import index from '@/pages/index.vue'
import notFound from '@/pages/404.vue'
import login from '@/pages/login.vue'
import admin from '@/layout/admin.vue'
import goodsList from '@/pages/goods/list.vue'
import categoryList from '@/pages/category/list.vue'
import settingBase from '@/pages/setting/base.vue'
import couponList from '@/pages/coupon/list.vue'
import noticeList from '@/pages/notice/list.vue'
import userList from '@/pages/user/list.vue'
import orderList from '@/pages/order/list.vue'
import commentList from '@/pages/comment/list.vue'
import imageList from '@/pages/image/list.vue'
import indexChar from '@/components/indexChar.vue'



const routes = [
  {
    path: '/',
    name: 'admin',
    component: admin,
    children: [
      {
        path: '',
        name: 'admin-home',
        component: index,
        meta: {
          title: '后台首页',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: notFound,
    meta: {
      title: '404',
    }
  },
  {
    path: '/login',
    component: login,
    meta: {
      title: '登录',
    }
  }]

const asyncRoutes = [{
        path: '/goods/list',
        name: 'goods/list',
        component: goodsList,
        meta: {
          title: '二手物品管理',
        }
      },  {
        path: '/category/list', 
        name: 'category/list',
        component: categoryList,
        meta: {
          title: '物品分类管理',
        }
      },{
        path: '/setting/base',
        name: 'setting/base',
        component: settingBase,
        meta: {
          title: '平台配置',
        },
        
      },{
        path: '/coupon/list',
        name: 'coupon/list',
        component: couponList,
        meta: {
          title: '优惠券列表',
        },
      },
      {
        path: '/notice/list',
        name: 'notice/list',
        component: noticeList,
        meta: {
          title: '公告列表',
        },
      },
      {
        path: '/user/list',
        name: 'user/list',
        component: userList,
        meta: {
          title: '用户列表',
        },
      },
      {
        path: '/order/list',
        name: 'order/list',
        component: orderList,
        meta: {
          title: '交易记录',
        },
      },{
        path: '/comment/list',
        name: 'comment/list',
        component: commentList,
        meta: {
          title: '评论列表',
        },

      },{
        path: '/image/list',
        name: 'image/list',
        component: imageList,
        meta: {
          title: '图片列表',
        },
      },{
        path: '/indexChar',
        name: 'indexChar',
        component: indexChar,
        meta: {
          title: '交易统计',
        },
      }

       ]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export function addRoutes(menus = []) {
  let newRoutes =  false
  const findAndAddRoutes = (arr) => {
    arr.forEach(e => {
      
       let item = asyncRoutes.find(item => item.path === e.frontpath)
       if (item && !router.hasRoute(item.name)) {
        router.addRoute("admin", item)
        newRoutes = true
       }
       const children = e.children || e.child
       if (Array.isArray(children) && children.length > 0) {
        findAndAddRoutes(children)
       }

       
      
    })
  }
  findAndAddRoutes(menus)
  return newRoutes
}