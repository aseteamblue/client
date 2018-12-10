import axios from 'axios'
import Vue from 'vue'
import config from '../../../config'
const state = {
  status: '',
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user') || '{}') || {},
}

const mutations = {
  auth_request (state) {
    state.status = 'loading'
  },
  auth_success (state, { token, user }) {
    state.status = 'success'
    Vue.set(state, 'token', token)
    state.user = user
  },
  auth_error (state) {
    state.status = 'error'
  },
  logout (state) {
    state.status = ''
    state.token = ''
  },
  refresh_request (state) {
    state.status = 'loading_refresh'
  },
  refresh_success (state, token) {
    state.status = 'success'
    state.token = token
  },
  refresh_error (state) {
    state.status = 'refresh_error'
  }
}

let interval = null

const actions = {
  login ({ commit, dispatch }, user) {
    return new Promise((resolve, reject) => {
      commit('auth_request')
      axios({ url: config.api_url + '/auth/login', data: user, method: 'POST' })
        .then(resp => {
          const token = resp.data.token
          const user = resp.data.user
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))
          // Add the following line:
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
          commit('auth_success', { token, user })
          interval = setInterval(function () { dispatch('refresh') }, 10000)
          resolve(resp)
        })
        .catch(err => {
          commit('auth_error')
          localStorage.removeItem('token')
          reject(err)
        })
    })
  },
  logout ({ commit }) {
    return new Promise((resolve, reject) => {
      commit('logout')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      clearInterval(interval)
      delete axios.defaults.headers.common['Authorization']
      resolve()
    })
  },
  refresh ({ commit }) {
    return new Promise((resolve, reject) => {
      commit('refresh_request')
      axios({ url: config.api_url + '/auth/refresh', method: 'GET' })
        .then(resp => {
          const token = resp.data
          localStorage.setItem('token', token)
          // Add the following line:
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
          commit('refresh_success', token)
          resolve(resp)
        })
        .catch(err => {
          commit('refresh_error')
          reject(err)
        })
    })
  }
}

export default {
  state,
  mutations,
  actions,
}
