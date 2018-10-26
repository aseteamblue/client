import axios from 'axios'
import Vue from 'vue'
import config from '../../../config'
const state = {
  status: '',
  token: localStorage.getItem('token') || '',
  user: {},
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
}

const actions = {
  login ({ commit }, user) {
    return new Promise((resolve, reject) => {
      commit('auth_request')
      axios({ url: config.api_url + '/auth/login', data: user, method: 'POST' })
        .then(resp => {
          const token = resp.data.token
          const user = resp.data.user
          localStorage.setItem('token', token)
          // Add the following line:
          axios.defaults.headers.common['Authorization'] = token
          commit('auth_success', { token, user })
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
      delete axios.defaults.headers.common['Authorization']
      resolve()
    })
  }
}

export default {
  state,
  mutations,
  actions,
}
