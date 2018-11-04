import axios from 'axios'
import config from '../../../config'
import auth from './auth'

const state = {
  sessions: [],
  sessionData: []
}

const mutations = {
  addSession (state, data) {
    state.sessions.push(data)
  },
  searchSession (sate) {
    state.sessions = []
  },
  newSessionData (state) {
    state.sessionData = []
  },
  addSessionData (state, data) {
    state.sessionData.push(data)
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
  },
  getLastData ({ commit }, sessionId) {
    return new Promise((resolve, reject) => {
      commit('newSessionData')
      axios({ url: config.api_url + '/sessions/' + sessionId + '/gps/', method: 'GET' })
        .then(resp => {
          let dataLength = resp.data.length
          let info = resp.data[dataLength - 1]
          commit('addSessionData', info)
          axios({ url: config.api_url + '/sessions/' + sessionId + '/humidities/', method: 'GET' })
            .then(resp => {
              let dataLength = resp.data.length
              let info = resp.data[dataLength - 1]
              commit('addSessionData', info)
              axios({ url: config.api_url + '/sessions/' + sessionId + '/temperatures/', method: 'GET' })
                .then(resp => {
                  let dataLength = resp.data.length
                  let info = resp.data[dataLength - 1]
                  commit('addSessionData', info)
                  resolve(resp)
                }).catch(err => {
                  reject(err)
                })
            }).catch(err => {
              reject(err)
            })
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
