<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <h3 class="title">전송 이력</h3>
        <v-spacer></v-spacer>
        <v-btn flat :loading="progress" />
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <p class="caption">최근 4주간의 등록 이력 (<i>매니저 - 사용자</i> 기준으로 저장)</p>
        </v-layout>
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
                  <span v-else-if="day && day.type === 'NODATA'"  class="caption add-date" @click="addNewDate(day.date)" >
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
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">사용자 or 매니저 정보 없음</v-card-title>
        <v-card-text>캘린더 관리를 위해서는 사용자와 매니저 정보가 필요합니다.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="$router.push('/')">메인으로 이동</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import mapGetters from 'vuex'

export default {
  data () {
    return {
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
      // dialog
      dialog: false
    }
  },
  mounted () {
    if (!this.username || !this.managername){
      this.dialog = true
    }

    this.setCalendar()
    this.$store.dispatch('loadHistory')
  },
  
  computed: {
    username () {
      return this.$store.state.username
    },
    managername () {
      return this.$store.state.managername
    },
    history () {
      return this.$store.getters.history
    },
    progress () {
      return this.$store.state.historyProgress
    }
  },
  watch: {
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
      // this.$vuetify.goTo('#newWorkingTime', {
      //   duration: 300,
      //   offset: 0,
      //   easing: 'easeInOutCubic'
      // })
      this.$store.commit('newDateFromHistory', this.getDisplayDate(date))
      this.$router.push({path:'/'})

      // analytics
      this.$gtag && this.$gtag('event', 'click', {
        'event_category': 'history',
        'event_label': this.getDisplayDate(date)
      });
    }
  },
    
}
</script>

<style scoped>
span.add-date {
  cursor: pointer;
}
</style>
