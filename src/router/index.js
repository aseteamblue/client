import Vue from 'vue'
import Router from 'vue-router'
import AppLayout from '../components/app/AppLayout'
import AuthLayout from '../components/auth/AuthLayout'
import lazyLoading from './lazyLoading'
import store from '../store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: { name: 'dashboard' },
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          name: 'login',
          path: 'login',
          component: lazyLoading('auth/login/Login'),
        },
        {
          path: '',
          redirect: { name: 'login' },
        },
      ],
    },
    {
      name: 'App',
      path: '/',
      meta: {
        requiresAuth: true
      },
      component: AppLayout,
      children: [
        {
          name: 'dashboard',
          path: '/',
          component: lazyLoading('dashboard/Dashboard'),
          default: true,
        },
        {
          name: 'user',
          path: '/user',
          component: lazyLoading('user/User'),
          default: false,
        },
        {
          name: 'statistics',
          path: '/statistics',
          component: lazyLoading('statistics/Statistics'),
          default: false,
        },
        {
          name: 'calendar',
          path: '/calendar',
          component: lazyLoading('calendar/Calendar'),
          default: false,
        },
        {
          name: 'wall',
          path: '/wall',
          component: lazyLoading('wall/Wall'),
          default: false,
        }
      ]
    },
    {
      path: '/404',
      component: lazyLoading('errors/PageNotFound')
    },
    { path: '*', redirect: '/404' }
  ],
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/auth/login')
  } else {
    if (!store.getters.isLoggedIn) {
      next()
      return
    }
    next('/')
  }
})

router.beforeEach((to, from, next) => {
  if (!to.matched.length) {
    next('/404')
  } else {
    next()
  }
})

export default router
