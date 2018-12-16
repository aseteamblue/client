import axios from 'axios'
import config from '../../../config'

const state = {
  trophies: []
}

const mutations = {
  loadTrophy (state, data) {
    state.trophies.push(data)
  },
  newRequest (state) {
    state.trophies = []
  }
}

const actions = {
  getTrophies ({ commit }, userTrophies) {
    return new Promise((resolve, reject) => {
      commit('newRequest')
      for (let item in userTrophies) {
        axios({ url: config.api_url + '/trophies/' + userTrophies[item], method: 'GET' })
          .then(resp => {
            commit('loadTrophy', resp.data)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      }
    })
  }
}

export default {
  state,
  mutations,
  actions,
}
