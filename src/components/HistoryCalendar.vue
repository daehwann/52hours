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
        <v-layout>
          <v-flex>
            <v-sheet height="300" v-if="calendarStart && calendarEnd">
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

      // dialog
      dialog: false
    }
  },
  mounted () {


    this.$store.dispatch('loadHistory')

    this.calendarStart = this.getDisplayDate(new Date(this.today.getTime() - 21 * 24 * 60 * 60 * 1000))
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
    }
  },
  watch: {
    history () {
      if (this.history.length) {
        this.setHistory()
      }
    },
    // progress (progress) {
    //   if (!progress && this.userValid) {
    //     this.setHistory()
    //   } 
    // },
  },
  methods: {
    setHistory () {
      if (this.history && this.history.length) {
        Array.from(Array(21).keys())
          .map(n=> new Date(this.today.getTime() - (n * 24 * 60 * 60 * 1000)))
          .map(this.getDisplayDate) // yyyy-mm-dd
          .forEach(date => {
            const item = this.history.find(item => item.y_m_d === date)
            this.historyMap[date] = item || { y_m_d: date }
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
