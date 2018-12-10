import axios from 'axios'
import config from '../../../config'

const state = {
  sessions: [],
  sessionData: []
}

const mutations = {
  addSession (state, data) {
    state.sessions.push(data)
  },
  searchSession (state) {
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
      axios({ url: config.api_url + '/user/sessions/', method: 'GET' })
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
          info['startDate'] = info['dateStart']
          info['endDate'] = info['dateEnd']
          info['id'] = info['_id']
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
  },
  postSession ({ commit }, session) {
    return new Promise((resolve, reject) => {
      axios.post(config.api_url + '/sessions', session)
        .then(resp => {
          commit('addSession', resp.data)
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
