Vue.component('working-time', {
  template: '#working-time-template',
  props: {
    labelName: String,
    value: String,
  },
  data () {
    return {
      time: this.value,
      timemodal: false,
      workingAt: '',
    }
  },
  watch: {
    value (newValue) {
      this.time = newValue
    }
  },
})

Vue.component('history-calendar', {
  template: '#history-calendar-template',
  props: {
    completedDate: String,
    username: String,
    manager: String,
  },
  data () {
    return {
      
      firebase: {
        baseurl: 'https://cnx-go-home.firebaseio.com'
      },
      today: new Date(),
      // Date Class Array
      dateList: [],
      // For creating calendar
      weeks: [
        Array(7).fill(null),
        Array(7).fill(null),
        Array(7).fill(null),
        Array(7).fill(null),
      ],
      // String date Array
      // the String date formatted as "yyyy-MM-dd"
      history:[]
    }
  },
  mounted () {
  },
  computed: {
    mydbpath() {
      return (this.manager && this.username) ? `${this.firebase.baseurl}/manager/${this.manager}/user/${this.username}` : ''
    }
  },
  watch: {
    manager (newValue, oldValue) {
      this.refreshCalendar()
    },
    completedDate(date) {

      // update history list
      if (!!date) {
        // update calendar
        this.history.push(this.getDisplayDate(new Date(date)))
        
        // save new date
        this.storeHistory().then(({data,error}) => {
          this.$emit('saved', data)
        })
        
      }
    },
    history () {
      this.weeks = this.weeks.map(week => {
        return week.map(day => {
          if (!!day) {
            return {
              date: day.date,
              type: this.getDateType(day.date)
            }
          } else {
            return null
          }
        })
      })
    }
  },
  methods: {
    storeHistory () {
      return this.$http.put(this.mydbpath+'.json', this.history)
    },
    loadHistory () {
      return this.$http.get(this.mydbpath+'.json')
    },
    setHistory (historyResponse) {
      return new Promise((resolve, reject) => {
        let localStorageHistory = localStorage.history || Cookies.get('h') || ''
        let databaseHistory = historyResponse.data || []
        this.history = databaseHistory.concat(localStorageHistory.split('|'))
          .filter(v => !!v && v!='undefined') // 텍스트예외
          .filter((v, i, a) => a.indexOf(v) === i)  //  중복제거
          .sort((a, b) => b.localeCompare(a)) // 역순 정렬

        resolve()
      })
    },
    setCalendar(historyList) {
      this.today = new Date()
      this.today.setHours(0,0,0)
      this.dateList = Array.from(Array(28).keys())
        .map(n=> new Date(this.today.getTime() - (n * 24 * 60 * 60 * 1000)))

      let _dateList = this.dateList.copyWithin().reverse()
      // calendar 의 시작을 일요일로 맞춤
      while (_dateList[0].getDay() != 0) _dateList.shift()
      
      this.weeks = this.weeks.map((week, i) => {
        return week.map((date, dayIndex) => {
          if (_dateList[0] && _dateList[0].getDay() == dayIndex) {
            let matchDay = _dateList.shift()
            return {
              date: matchDay,
              type: this.getDateType(matchDay)
            }
          } else {
            return null
          }
        })
      })
    },
    refreshCalendar() {
      this.loadHistory()
        .catch(error => [])
        .then(this.setHistory)
        .then(this.setCalendar)
    },
    getDisplayDate(date) {
      return !!date ? `${date.getFullYear()}-${(date.getMonth()+1+'').padStart(2, '0')}-${(date.getDate()+'').padStart(2, '0')}` : ''
    },
    getMMDD(date) {
      return this.getDisplayDate(date).substr(5).replace('-', '/')
    },
    getDateType(date) {
      if (!date) return 'NODATA'

      if (/0|6/.test(date.getDay())) {
        return 'WEEKEND'
      } else if (this.history.indexOf(this.getDisplayDate(date)) > -1) {
        return 'SUBMITTED'
      } else {
        return 'NODATA'
      }
    },
    addNewDate (date) {
      this.$emit('add', this.getDisplayDate(date))

      // window.scrollTo(0, '#app')
      this.$vuetify.goTo('#newWorkingTime', {
        duration: 300,
        offset: 0,
        easing: 'easeInOutCubic'
      })

      // analytics
      window.gtag('event', 'click', {
        'event_category': 'history',
        'event_label': this.getDisplayDate(date)
      });
    }
  },
})