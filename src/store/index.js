import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import auth from './modules/auth'
import user from './modules/user'
import session from './modules/session'
import trophies from './modules/trophies'

import * as getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true, // process.env.NODE_ENV !== 'production',
  getters,
  modules: {
    app,
    auth,
    user,
    session,
    trophies
  },
  state: {},
  mutations: {}
})

export default store
