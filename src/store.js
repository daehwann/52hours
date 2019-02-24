import Vue from 'vue'
import Vuex from 'vuex'
import qs from 'query-string'
import jsonp from 'jsonp'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    manager: {},
    managerList: [],
    history: [],
    historyProgress: false,
    newDateFromHistory: '',
    newDateSubmitted: '',
    contentURL: 'https://cnx-go-home.firebaseio.com/app-contents/request.json',
    historyURL: 'https://script.google.com/macros/s/AKfycbxnqs8LDRyDxvT0smyGqY1OMuHLqWbNe4v34HRt0vHJarbxIwYO/exec',
    content: {}
  },
  getters: {
    history: state => {
      return state.history
        .filter(v => v && v!='undefined') // 텍스트예외
        .filter((v, i, a) => a.indexOf(v) === i)  //  중복제거
        .sort((a, b) => b.localeCompare(a))
    },
    managername: state => {
      return state.manager ? state.manager.name : ''
    },
    managerSheet: state => {
      return state.manager ? state.manager.sheet : ''
    },
    managerFormList: state => {
      return state.managerList.map(m => m.name)
    }
  },
  mutations: {
    init (state, { username, managername }) {
      state.username = username
      state.manager = state.managerList.find(m => m.name == managername) || {}
    },
    username (state, username) {
      if (username) {
        localStorage.username = username
        state.username = username
  
        if (username && this._vm.$rollbar) {
          this._vm.$rollbar.configure({
            payload: {
              person: {
                id: username, // required
              }
            }
          });
        }
      }
    },
    manager (state, managername) {
      if (managername) {
        localStorage.managername = managername
        state.manager = state.managerList.find(m => m.name === managername)
      }
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
    async loadContent ({ state }) {
      const { data: contents } = await this._vm.$http.get(state.contentURL)
      state.content = contents
        
      const { data: managerList } = await this._vm.$http.get('/manager.json')
      state.managerList = managerList
      
    },
    async loadHistory ({ commit, state, getters}) {
      if (state.username && getters.managerSheet) {
        state.historyProgress = true
        
        const params = { 
          username: state.username,
          startDate: new Date().toISOString().substr(0,10),
          sheetId: state.manager.sheet,
        }

        return new Promise((resolve, reject) => {
            jsonp(`${state.historyURL}?${qs.stringify(params)}`, {
              timeout: 5000
            }, (err, data) => {
              err ? reject(err) : resolve(data.result)
            })
          })
          .then( (data) => {
            return data.map( ([date, , startTime, endTime, breakingTime]) => {
                            
                const getTimestamp = (year, month, day, textTime /*"오전 9:00:00" format*/) => {
                  if (!textTime) return Date.UTC(year, month, day)

                  const [ampmhour, min, sec] = textTime.split(':')
                  const [ampm, hourStr] = ampmhour.split(' ') // '오전 9'
                  const hour = ampm == '오후' ? Number(hourStr) + 12 : Number(hourStr)
                  return Date.UTC(year, month, day, hour+9, min, sec)
                }
                
                const workingDate = new Date(date)
                const year = workingDate.getFullYear()
                const month = workingDate.getMonth()
                const day = workingDate.getDate()
                
                const workingMin = (getTimestamp(year, month, day, endTime) - getTimestamp(year, month, day, startTime)) / 1000 / 60
                const breakingTimeMin = (getTimestamp(year, month, day, breakingTime) - workingDate.getTime()) / 1000 / 60
                const totalMin = workingMin - breakingTimeMin - 60 /*lunchtime */

                return {
                  date: workingDate,
                  workingHour: Math.floor(totalMin / 60),
                  workingMinute: totalMin % 60
                }
              })
          })
          .then( history => {
            console.log(history)

            const localStorageHistory = (localStorage.history||'').split('|')
            commit('history', localStorageHistory.concat(history||[]))
            state.historyProgress = false

            return state.history
          })
      }
    },
    async storeHistory ({ commit, getters }, newDate) {
      commit('addHistory', newDate)
      const { data: result } = await this._vm.$http.put(getters.dbpath+'.json', getters.history)
      console.log('History Stored', result)

      return result
    }
  }
})
