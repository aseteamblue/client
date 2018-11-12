import axios from 'axios'
import config from '../../../config'

const state = {
  sessionData: [],
  sessionInfo: [],
  sessionId: null
}

const mutations = {
  changeId (state, id) {
    state.sessionId = id
  },
  loadSessionInfo (state, data) {
    state.sessionInfo = data
  },
  loadSessionData (state, data) {
    state.sessionData = data
  }
}

const actions = {
  newSession ({ commit, router }) {

  },
  getSessionData ({ commit }) {
    return new Promise((resolve, reject) => {
      var id = state.sessionId
      axios({ url: config.api_url + '/sessions/' + id, method: 'GET' })
        .then(resp => {
          commit('loadSessionInfo', resp.data)
          axios({ url: config.api_url + '/sessions/' + id + '/gps/', method: 'GET' })
            .then(resp => {
              commit('loadSessionData', resp.data)
              resolve(resp)
            })
            .catch(err => {
              reject(err)
            })
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  sessionDetails ({ commit }, id) {
    commit('changeId', id)
  }

}

export default {
  state,
  mutations,
  actions,
}
