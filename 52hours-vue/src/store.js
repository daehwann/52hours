import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    managername: '',
  },
  getters: {
    username: state => state.username,
    managername: state => state.managername
  },
  mutations: {
    username (state, username) {
      state.username = username
    },
    managername (state, managername) {
      state.managername = managername
    }
  },
  actions: {

  }
})
