// Polyfills
// import 'es6-promise/auto'
// import 'babel-polyfill'

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import App from './App'
import store from './store'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import Axios from 'axios'
import VueSidebarMenu from 'vue-sidebar-menu'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue.js'
import config from '../config'
Vue.use(VueSidebarMenu)

// NOTE: workaround for VeeValidate + vuetable-2
Vue.use(VeeValidate, { fieldsBagName: 'formFields' })
Vue.use(BootstrapVue)

router.beforeEach((to, from, next) => {
  store.commit('setLoading', true)
  next()
})

router.afterEach((to, from) => {
  store.commit('setLoading', false)
})

Vue.prototype.$http = Axios
Vue.prototype.$http.defaults.baseURL = config.api_url
const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

Vue.prototype.$http.interceptors.response.use(null, (error) => {
  if (error.response.status === 401) {
    store.dispatch('logout')
      .then(() => router.push('/auth/login'))
  }
  return Promise.reject(error)
})

Vue.config.productionTip = false

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
