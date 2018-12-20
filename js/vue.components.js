Vue.component('working-time', {
  template: '#working-time-template',
  props: {
    labelName: String,
    value: String
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
    displayDate: String,
    submittedDate: Array
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
      ]
    }
  },
  watch: {
    displayDate (newValue, oldValue) {
      if (!!oldValue) return; // render calendar once

      this.today = new Date(`${newValue}T00:00:00+09:00`)
      this.dateList = Array.from(Array(28).keys())
        .map(n=> new Date(this.today.getTime() - (n * 24 * 60 * 60 * 1000)))

      let tempDateList = this.dateList.copyWithin().reverse()
      while (!!tempDateList[0] && tempDateList[0].getDay() != 0) {
        tempDateList.shift()
      }
      
      let datePointer = tempDateList.shift()
      this.weeks = this.weeks.map((week, i) => {
        return week.map((date, dayIndex) => {
          if (!!datePointer && datePointer.getDay() == dayIndex) {
            let matchDay = datePointer
            datePointer = tempDateList.shift()
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
    submittedDate () {
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
      } else if (this.submittedDate.indexOf(this.getDisplayDate(date)) > -1) {
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
    }
  },
})