import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    managername: '',
    newDateFromHistory: '',
    newDateSubmitted: '',
  },
  mutations: {
    username (state, username) {
      state.username = username
    },
    managername (state, managername) {
      state.managername = managername
    },
    newDateFromHistory (state, date) {
      state.newDateFromHistory = date
    },
    applyNewDate (state) {
      state.newDateFromHistory = ''
    },
    newDateSubmitted (state, date) {
      state.newDateSubmitted = date
    }
    
  },
  actions: {

  }
})
