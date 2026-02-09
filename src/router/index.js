import { createRouter, createWebHistory } from 'vue-router'
import ScanCode from '../views/ScanCode.vue'

const routes = [
  {
    path: '/',
    name: 'ScanCode',
    component: ScanCode
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('../views/home/index.vue')
      },
      {
        path: 'mine',
        name: 'Mine',
        component: () => import('../views/home/mine.vue')
      },
    ]
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/search/index.vue')
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../views/order/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue')
  },
  // 新增
  {
    path: '/myorder',
    name: 'myorder',
    component: () => import('../views/myorder/index.vue')
  },
  {
    path: '/address',
    name: 'address',
    component: () => import('../views/add/address.vue')
  },
  {
    path: '/editaddress',
    name: 'editaddress',
    component: () => import('../views/add/editaddress.vue')
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/checkout/checkout.vue')
  },
  {
    path: '/checkout2',
    name: 'checkout2',
    component: () => import('../views/checkout/checkout2.vue')
  },
  {
    path: '/coupon',
    name: 'coupon',
    component: () => import('../views/coupon/coupon.vue')
  },
  {
    path: '/personal',
    name: 'personal',
    component: () => import('../views/personal/personal.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/profile/profile.vue')
  },
  {
    path: '/rating',
    name: 'rating',
    component: () => import('../views/rating/rating.vue')
  },
  {
    path: '/orderdel',
    name: 'orderdel',
    component: () => import('../views/orderdel/orderdel.vue')
  },
  {
    path: '/order_success',
    name: 'order_success',
    component: () => import('../views/result/order_success.vue')
  },
  {
    path: '/order_fail',
    name: 'order_fail',
    component: () => import('../views/result/order_fail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router