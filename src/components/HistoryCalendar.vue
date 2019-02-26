<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="title">근무 시간</h3>
          <div>2주간의 근무시간</div>
        </div>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap align-end justify-space-around>
          <v-flex xs6 px-2 v-for="(week,key,i) in weeklyMinuteSum" :key="key">
            <v-card v-if="i<2" height="200" :color="i==0 ? 'primary' : ''" :dark="i==0">
              <v-card-title primary-title >
                <div class="display-2">{{ String(Math.floor(week.totalMinute / 60)).padStart(2,0) }}h</div>
                <div class="display-1">{{ String(week.totalMinute % 60).padStart(2,0) }}m</div>
              </v-card-title>
              <v-card-text>
                  <div>{{getDisplayDate(week.start)}} ~</div>
                  <div>{{getDisplayDate(week.end)}}</div>
              </v-card-text>
            </v-card>
          </v-flex>

          
          
        </v-layout>
      </v-card-text>
      <!-- <v-card-actions>
        <v-btn flat color="primary">text</v-btn>
        <v-btn flat color="primary">text</v-btn>
      </v-card-actions> -->
    </v-card>
    <v-layout  mb-3>
    </v-layout>
    <v-card>
      <v-card-title primary-title>
        <h3 class="title">전송 이력</h3>
        <v-spacer></v-spacer>
        <v-btn flat :loading="progress" />
        <v-btn flat @click="refresh" v-if="!progress" icon>
          <v-icon>refresh</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <!-- <p class="caption">최근 4주간의 등록 이력 (<i>매니저 - 사용자</i> 기준으로 저장)</p> -->
        </v-layout>
        <v-layout>
          <v-flex>
            <v-sheet height="300" v-if="calendarStart && calendarEnd" elevation="3">
              <v-calendar
                :start="calendarStart"
                :end="calendarEnd"
                :value="calendarEnd"
                color="primary"
                type="custom-weekly"
              >
                <template
                  slot="day"
                  slot-scope="{ date }"
                >
                  <history-day 
                    v-on:addNewDate="addNewDate(date)"
                    v-if="!progress && history && history.length" 
                    :working-info="historyMap[date] || {}"
                    
                  ></history-day>
                </template>
              </v-calendar>
            </v-sheet>
          </v-flex>
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
import HistoryDay from './HistoryDay.vue'

export default {
  data () {
    return {
      today: new Date(),
      calendarStart: '',
      calendarEnd: '',

      // date - history map
      historyMap: {},

      weeklyMinuteSum: {},
      // dialog
      dialog: false
    }
  },
  mounted () {
    this.$store.dispatch('loadHistory')

    this.calendarStart = this.getDisplayDate(new Date(this.today.getTime() - (14 + this.today.getDay()) * 24 * 60 * 60 * 1000))
    this.calendarEnd = this.getDisplayDate(this.today)
  },
  computed: {
    username () {
      return this.$store.state.username
    },
    managername () {
      return this.$store.getters.managername
    },
    history () {
      return this.$store.getters.history
    },
    userValid () {
      return !!this.username && !!this.managername
    },
    progress () {
      return this.$store.state.historyProgress
    },
    page () {
      return this.$route.path
    }
  },
  watch: {
    page () {
      console.log('page changed')
    },
    userValid () {
      this.dialog = !this.userValid
    },
    history () {
      if (this.history.length) {
        this.setHistory()

        this.setWeeklyMinuteSum()
      }
    },
    progress (progress) {
      if (!progress && this.userValid) {
        this.setHistory()
      } else if (!this.userValid) {
        this.dialog = true
      }
    },
  },
  methods: {
    refresh () {
      this.weeklyMinuteSum = {}
      this.$store.dispatch('loadHistory')
    },
    setHistory () {
      if (this.history && this.history.length) {
        Array.from(Array(21).keys())
          .map(n=> new Date(this.today.getTime() - (n * 24 * 60 * 60 * 1000)))
          .map(this.getDisplayDate) // yyyy-mm-dd
          .forEach(y_m_d => {
            const item = this.history.find(item => item.y_m_d === y_m_d)
            this.historyMap[y_m_d] = item || { y_m_d: y_m_d, date: new Date(y_m_d) }
          })
      }
    },
    getDisplayDate(date) {
      return date ? `${date.getFullYear()}-${(date.getMonth()+1+'').padStart(2, '0')}-${(date.getDate()+'').padStart(2, '0')}` : ''
    },
    addNewDate (date) {
      this.$emit('add', date)

      // window.scrollTo(0, '#app')
      // this.$vuetify.goTo('#newWorkingTime', {
      //   duration: 300,
      //   offset: 0,
      //   easing: 'easeInOutCubic'
      // })
      this.$store.commit('newDateFromHistory', date)
      this.$router.push({path:'/'})

      // analytics
      this.$gtag && this.$gtag('event', 'click', {
        'event_category': 'history',
        'event_label': date
      });
      
    },
    setWeeklyMinuteSum () {
      Object.values(this.historyMap)
        .map( item => {
          item.totalMinute = item.workingHour ? (item.workingHour * 60 + item.workingMinute) : 0
          return item
        })
        .forEach( item => {
          const year = item.date.getFullYear()
          const onejan = new Date(year, 0, 1)
          const weekOfYear = Math.ceil((((item.date - onejan) / 86400000) + onejan.getDay()) / 7)
          const weekInfo = this.weeklyMinuteSum['w'+weekOfYear] || {}
          const prevSum = weekInfo.totalMinute || 0

          if (item.date.getDay() == 0) { // start of the week
            weekInfo.start = item.date
          } else if (item.date.getDay() == 6) {
            weekInfo.end = item.date
          }
          weekInfo.totalMinute = prevSum + item.totalMinute

          this.weeklyMinuteSum['w'+weekOfYear] = weekInfo
        })
    }
  },
  components: {
    HistoryDay
  }
}
</script>

<style scoped>
span.add-date {
  cursor: pointer;
}
</style>
