import axios from 'axios'
import config from '../../../config'
import auth from './auth'

const state = {
  sessions: []
}

const mutations = {
  addSession (state, data) {
    state.sessions.push(data)
  },
  searchSession (sate) {
    state.sessions = []
  }
}

const actions = {
  getUserSession ({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      commit('searchSession')
      axios({ url: config.api_url + '/users/' + auth.state.user._id + '/sessions/', method: 'GET' })
        .then(resp => {
          for (let i = 0; i < resp.data.length; i++) {
            actions.getSessionInfo({ commit }, resp.data[i])
          }
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getSessionInfo ({ commit }, sessionId) {
    return new Promise((resolve, reject) => {
      axios({ url: config.api_url + '/sessions/' + sessionId, method: 'GET' })
        .then(resp => {
          let info = resp.data
          commit('addSession', info)
          resolve(resp)
        })
        .catch(err => {
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
