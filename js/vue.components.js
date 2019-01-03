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
    submittedDate: Array,
    completedDate: String

  },
  data () {
    return {
      today: new Date(),
      dateList: [],
      weeks: [
        Array(7).fill(null),
        Array(7).fill(null),
        Array(7).fill(null),
        Array(7).fill(null),
      ],
      history
    }
  },
  mounted () {
    console.log('MOUNTED')

    let history = localStorage.history || Cookies.get('h') || ''
    this.history = history.split('|')
      .filter(v => !!v && v!='undefined')
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => b.localeCompare(a))

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
  watch: {
    completedDate(date) {
      // update history list
      if (!!date) {
        // save new date
        setTimeout(() => {
          this.$emit('saved', true)
          console.log('saved', date)
        }, 2000)
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
    dbsync () {
      
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