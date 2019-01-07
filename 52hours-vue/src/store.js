import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    managername: '',
    history: [],
    newDateFromHistory: '',
    newDateSubmitted: '',
    dburl: 'https://cnx-go-home.firebaseio.com'
  },
  getters: {
    history: state => {
      return state.history
        .filter(v => v && v!='undefined') // 텍스트예외
        .filter((v, i, a) => a.indexOf(v) === i)  //  중복제거
        .sort((a, b) => b.localeCompare(a))
    },
    dbpath: state => {
      return `${state.dburl}/manager/${state.managername}/user/${state.username}`
    }
  },
  mutations: {
    username (state, username) {
      state.username = username
    },
    managername (state, managername) {
      state.managername = managername
    },
    addHistory (state, date) {
      state.history.push(date)
    },
    history (state, list) {
      state.history = list
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
    loadHistory ({ commit, state, getters}) {
      if (state.username && state.managername) {
        this.$http.get(getters.dbpath+'.json')
          .then(({ data }) => {
            commit('history', data)
          })
      }
    },
    storeHistory ({ getters }) {
      this.$http.put(getters.dbpath+'.json')
        .then(() => {
          console.log('Hisotyr')
        })
    }
  }
})
