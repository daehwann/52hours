<template>
  <v-card>
    <v-card-title primary-title>
      <h3 class="title">History</h3>
    </v-card-title>
    <v-card-text>
      <p class="subheading">최근 4주간의 등록 이력</p>
      <v-layout row wrap my-3>
        <table>
          <thead>
            <tr>
              <td class="py-3 text-xs-center grey lighten-5 grey--text"><b>일</b></td>
              <td class="py-3 text-xs-center grey lighten-5"><b>월</b></td>
              <td class="py-3 text-xs-center grey lighten-5"><b>화</b></td>
              <td class="py-3 text-xs-center grey lighten-5"><b>수</b></td>
              <td class="py-3 text-xs-center grey lighten-5"><b>목</b></td>
              <td class="py-3 text-xs-center grey lighten-5"><b>금</b></td>
              <td class="py-3 text-xs-center grey lighten-5 grey--text"><b>토</b></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(week, i) in weeks" :key="i">
              <td v-for="(day, j) in week" :key="j" class="py-3 text-xs-center grey lighten-5" >
                <span v-if="day && day.type === 'SUBMITTED'" class="caption">
                  {{getMMDD(day.date)}}
                  <v-icon disabled>check_circle_outline</v-icon><br>
                </span>
                <span v-else-if="day && day.type === 'NODATA'"  class="caption" @click="addNewDate(day.date)">
                  {{getMMDD(day.date)}}
                  <v-icon color="primary">add_circle</v-icon><br>
                </span>
                <span v-else-if="day && day.type === 'WEEKEND'" class="caption">
                  {{getMMDD(day.date)}}
                  <v-icon disabled>remove</v-icon><br>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </v-layout>
      
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    completedDate: String,
    // username: String,
    // managername: String,
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
      return (this.managername && this.username) ? `${this.firebase.baseurl}/manager/${this.managername}/user/${this.username}` : ''
    },
    username () {
      return this.$store.getters.username
    },
    managername() {
      console.log('managername computed')
      return this.$store.getters.managername
    }
  },
  watch: {
    managername (newValue) {
      console.log('managername watched', newValue)
      this.refreshCalendar()
    },
    completedDate(date) {

      // update history list
      if (date) {
        // update calendar
        this.history.push(this.getDisplayDate(new Date(date)))
        
        // save new date
        this.storeHistory().then(({data}) => {
          this.$emit('saved', data)
        })
        
      }
    },
    history () {
      this.weeks = this.weeks.map(week => {
        return week.map(day => {
          if (day) {
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
    setHistory ({data: response, error: error}) {
      return new Promise((resolve, reject) => {
        if (error) {
          reject(error)
        } else {
          let localStorageHistory = localStorage.history || ''
          let databaseHistory = response || []
          this.history = databaseHistory.concat(localStorageHistory.split('|'))
            .filter(v => !!v && v!='undefined') // 텍스트예외
            .filter((v, i, a) => a.indexOf(v) === i)  //  중복제거
            .sort((a, b) => b.localeCompare(a)) // 역순 정렬

          resolve()
        }
      })
    },
    setCalendar () {
      this.today = new Date()
      this.today.setHours(0,0,0)
      this.dateList = Array.from(Array(28).keys())
        .map(n=> new Date(this.today.getTime() - (n * 24 * 60 * 60 * 1000)))

      let _dateList = this.dateList.copyWithin().reverse()
      // calendar 의 시작을 일요일로 맞춤
      while (_dateList[0].getDay() != 0) _dateList.shift()
      
      this.weeks = this.weeks.map((week) => {
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
        .catch(console.error)
        .then(this.setHistory)
        .then(this.setCalendar)
    },
    getDisplayDate(date) {
      return date ? `${date.getFullYear()}-${(date.getMonth()+1+'').padStart(2, '0')}-${(date.getDate()+'').padStart(2, '0')}` : ''
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
    
}
</script>
