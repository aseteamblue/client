import axios from 'axios'
import config from '../../../config'

const state = {
  sessionDataTemp: [],
  sessionDataHumidities: [],
  sessionDataCo2: [],
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
  loadSessionData (state, { data, typeOfMeasure }) {
    if (typeOfMeasure === 'temperatures') {
      state.sessionDataTemp = data
    } else if (typeOfMeasure === 'humidities') {
      state.sessionDataHumidities = data
    } else {
      state.sessionDataCo2 = data
    }
  },
  changePrivacy (state) {
    state.sessionInfo.share = !state.sessionInfo.share
  }
}

const actions = {
  newSession ({ commit, router }) {

  },
  getSessionData ({ commit }, typeOfMeasure) {
    return new Promise((resolve, reject) => {
      var id = state.sessionId
      axios({ url: config.api_url + '/sessions/' + id, method: 'GET' })
        .then(resp => {
          commit('loadSessionInfo', resp.data)
          axios({ url: config.api_url + '/sessions/' + id + '/' + typeOfMeasure, method: 'GET' })
            .then(resp => {
              commit('loadSessionData', { data: resp.data, typeOfMeasure })
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
  },
  changePrivacy ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(config.api_url + '/sessions/' + state.sessionId + '/privacy')
        .then(resp => {
          commit('changePrivacy')
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
