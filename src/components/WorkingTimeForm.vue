<template>
  <div>
    <v-card id="newWorkingTime">
      <v-card-title primary-title>
        <h3 class="title">시간 입력</h3>
        <v-spacer></v-spacer>
        <v-btn flat :disabled="!manager" :href="teamOriginalFormURL" @click="goToOriginPage()" target="_blank" class="caption">
            {{ managername }}팀 기존 양식
          <v-icon>link{{ !managername ? '_off' : ''}}</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <p class="caption"><i>사용자이름</i> 과 <i>매니저이름</i> 은 처음 입력 후 브라우저에 저장됩니다</p>
        </v-layout>

        <v-form ref="workingform">
          <v-layout row wrap justify-space-between my-1>
            <v-flex xs6 px-3>
              <!-- Username -->
              <v-text-field 
                v-model="usernameInput" prepend-icon="person" name="username" 
                :rules="inputRules.username"
                @change="usernameChanged"
                label="이름" id="username" required></v-text-field>
            </v-flex>
            <v-flex xs6 px-3>
              <!-- Manager -->
              <v-select  dense prepend-icon="people" name="manager" 
                v-model="manager"
                :rules="inputRules.manager"
                :items="managerList"
                label="매니저" 
                @change="managernameChanged"
                required></v-select>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs6 px-3 my-1>
              <!-- Date -->
              <v-menu ref="menu1" :close-on-content-click="false" v-model="menu1" :nudge-right="40" lazy
                transition="scale-transition" offset-y full-width max-width="290px" min-width="290px">
                <v-text-field readonly slot="activator" v-model="date" label="날짜" persistent-hint prepend-icon="event"></v-text-field>
                <v-date-picker v-model="date" :show-current="today" no-title @input="menu1 = false"></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
          <v-layout row wrap my-1>
            <v-flex xs6 px-3>
              <!-- Start time -->
              <time-picker name="출근" label-name="출근" v-model="startTime"></time-picker>
            </v-flex>
            <v-flex xs6 px-3>
              <!-- End time -->
              <time-picker name="퇴근" label-name="퇴근" v-model="endTime"></time-picker>
            </v-flex>
          </v-layout>
          <v-layout row wrap my-1>
            <!-- Breaktime -->
            <v-flex xs6 sm4 px-3>
              <v-text-field
                prepend-icon="free_breakfast"
                readonly
                name="breaktimeDisplay"
                label="휴식"
                :value="displayHour(breaktimeMinutes)"
                persistent-hint
                hint="점심시간 제외"
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm8 pr-3>
              <v-slider label-name="휴식시간" ticks step="10" v-model="breaktimeMinutes" min="0" max="120"></v-slider>
            </v-flex>
          </v-layout>
          
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-layout row wrap my-3>
          <v-flex xs3 pl-3 text-xs-right>
              <!-- 반차 여부 -->
              <v-checkbox label="반차" v-model="halftime"></v-checkbox>
          </v-flex>
          <v-flex xs4>
            <v-radio-group v-if="halftime" v-model="halftype" row>
              <v-radio label="오전" value="AM" ></v-radio>
              <v-radio label="오후" value="PM"></v-radio>
            </v-radio-group>
          </v-flex>
          <v-flex xs5 text-xs-right>
            <!-- Submit -->
            <v-btn color="primary" @click="check()" :disabled="!formValid">확인 후 제출</v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>

    <!-- Dialogs-->
    <v-dialog v-if="confirmDialog" v-model="confirmDialog" max-width="290">
      <v-card>
        <v-card-title class="title">제출 하시겠습니까?</v-card-title>
        <v-card-text class="text-xs-center">
          <p class="body-2 subheading">{{ date.replace(/-/g, '. ') }}<br/>{{ startTime }} ~ {{ endTime }}</p>
          <v-divider mb-2></v-divider>
          <p class="body-2 mt-3 caption">
            전체시간: {{ displayHour(officeMinutes) }} <br/>
            점심시간: {{ displayHour(lunchMinute) }} <br/>
            휴식시간: {{ displayHour(breaktimeMinutes) }} <br/>
          </p>
          <p><b>최종업무시간: {{ displayHour(workingMinutes) }}</b></p>
          <v-divider></v-divider>
          <p class="body-2 mt-3 caption">
            정규업무시간: {{ displayHour(regularMinutes) }}
            <br/>
            초과업무시간: {{ displayHour(overtimeMinutes) }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat="flat" @click="confirmDialog = false">
            CANCEL
          </v-btn>
          <v-btn color="primary" flat="flat" @click="confirm()">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="completeDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar primary>
          <v-progress-circular v-show="submitting" :width="4" indeterminate color="primary"></v-progress-circular>
          <v-btn v-show="!submitting" icon @click="closeComplete()">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ submitting ? '전송중...' : '제출 결과' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn :disabled="submitting" flat @click="closeComplete()">Close</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <iframe id="submitresult" name="submitresult" scrolling="yes" @load="complete()">
          <p>Please wait...</p>
        </iframe>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TimePicker from './TimePicker.vue'

export default {
  data () {
    return {
      // menu
      drawer: false,
      
      // user
      usernameInput: this.$store.state.username,
      manager: '',
      managerList: [
        {"text":"한웅 ", "value": "1FAIpQLSeMzqRuE3I6twzxyLZ4y2EwkJyk2NPo09a4p1LvX3AQA7-RIw"},
        {"text":"정진영", "value": "1FAIpQLSc8cUWGrPDHMD7X_JyxrhcqhqkPmALQOsdRR5MZuklvGpCkUA"},
        {"text":"배덕우", "value": "1FAIpQLSd9e9LNYCVM7lUOKnrNMgnC-nAbxTOy7V6rIQ_ExkgRSoZSSQ"},
        {"text":"최인호", "value": "1FAIpQLSdZ3ykSfeJIp94N7zoJuImU-ZglaUkkPc-FLgiUcZkUkkRdgQ"},
        {"text":"조희제", "value": "1FAIpQLSfjiyuJmey5ZUcJYgqqC0fZBlcCtktyeFZwANmym4f1B4QmXQ"},
        {"text":"장예성", "value": "1FAIpQLSdEbsAkX9iHWF8603UXETPKcV3MEna2gOHRekZ1nIcdyU8w5w"},
        {"text":"김경희", "value": "1FAIpQLSd3OeLXwiW9fnAxJQOZwQ_LT2Dk_SROfnE8kOVciueXQsYDcQ"},
        {"text":"김세정", "value": "1FAIpQLScutj6ijHDN1hUZZ1l03lfGLbcSMRMzurq-dMOvx5BFrcUTfA"},
        {"text":"박영서", "value": "1FAIpQLSfFHgRpKJdejDfxakoOIJgXULtGSm2SF3iNlJda0E_cdbdT1w"},
        {"text":"한정훈", "value": "1FAIpQLSfxNENnR9EnB9cTv1oCW9pu_4pZNNoCfXrXILyvCvtqHKCWkg"},
        {"text":"정석안", "value": "1FAIpQLSduhDIFavJYFo1STAhL80kWjH1aKeAjluZnlxE6BTRKnIJJqg"}
      ],
      
      // date & time
      now: new Date(),
      date: '',
      today: '',
      startTime: '09:00',
      endTime: '',
      menu1: false, // for date picker
      breaktimeMinutes: 0,
      halftime: false,
      halftype: 'PM',

      // validations
      inputRules: {
        manager: [ (v) => !!v || '소속을 선택하세요.'],
        username: [ 
          (v) => !!v || '이름을 입력하세요.',
          (v) => !(/^ | $/g.test(v)) || '이름에 공백을 제거해주세요.'
        ]
      },
  
      // dialogs
      confirmDialog: false,
      confirmed: false,
      submitting: false,
      completeDialog: false,
      completed: false,
      completedDate: '',

      // validation
      formValid: true
    }
  },
  
  mounted () {
    // set date
    if (this.$store.state.newDateFromHistory) {
      this.date = this.$store.state.newDateFromHistory
      this.$store.commit('applyNewDate')
    } else {
      let month = this.now.getMonth() + 1 + ''
      let day = this.now.getDate() + ''
      this.date = `${this.now.getFullYear()}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    this.today = this.date
    let hour = this.now.getHours() + ''
    let min = this.now.getMinutes() + ''
    this.endTime = `${hour.padStart(2, '0')}:${min.padStart(2, '0')}`
    if ('18:00'.localeCompare(this.endTime) === 1) { // 18시 이전일 경우
      this.endTime = '18:00'
    }

    // set manager
    this.manager = this.managerList
        .filter(m => m.text === this.managername)
        .map(m => m.value).pop() || ''
    
  },
  watch: {
    usernameInput (name) {
      this.$store.commit('username', name)
    },
    halftype (type) {
      this.startTime = (type === 'PM') ? '09:00' : '14:00'
      this.endTime = (type === 'PM') ? '14:00' : '18:00'
    }
  },
  computed: {
    username () {
      return this.$store.state.username
    },
    managername () {
      return this.$store.state.managername
    },
    // manager () {
    //   return (this.managerList.find(m => m.text == this.managername) || {manager:''}).manager
    // },
    teamResponseURL() {
      return `https://docs.google.com/forms/d/e/${this.manager}/formResponse`
    },
    teamOriginalFormURL() {
      if (!this.manager) {
        return "javascript:alert('소속을 선택하세요')"
      }
      return `https://docs.google.com/forms/d/e/${this.manager}/viewform`
    },
    startDatetime () {
      return new Date(`${this.date}T${this.startTime}+09:00`)
    },
    endDatetime () {
      return new Date(`${this.date}T${this.endTime}+09:00`)
    },

    // officeMinutes = endDatetime - startDatetime
    // workingMinutes = officeMinutes - lunchHour - breaktimeHour
    // overtimeMinutes = workingMinutes - regularMinutes
    officeMinutes () {
      return Math.floor( (this.endDatetime - this.startDatetime) / 1000 / 60)
    },
    workingMinutes () {
      return this.officeMinutes - this.lunchMinute - this.breaktimeMinutes
    },
    lunchMinute () {
      // 오후 반차만 점심시간 인정
      return (this.halftime && this.halftype === 'AM') ? 0 : 60
    },
    regularMinutes () {
      return (this.halftime ? 4 : 8) * 60
    },
    overtimeMinutes () {
      const gap = this.workingMinutes - this.regularMinutes
      return (gap > 0 )? gap : 0
    },
    isFormValid() {
      return this.$refs.workingform && this.$refs.workingform.validate()
    }
  },
  methods: {
    usernameChanged (name) {
      localStorage.username = name
      this.$store.commit('username', name)
    },
    managernameChanged (managerID) {
      let name = this.managerList
        .filter(m => m.value === managerID)
        .map(m => m.text).pop() || ''

      localStorage.managername = name

      this.$store.commit('managername', name)
      this.$store.dispatch('loadHistory')
    },
    goToOriginPage () {
      // analytics
      this.$gtag && this.$gtag('event', 'original page', {
        'event_category': 'link',
        'event_label': this.managername
      });
    },
    displayHour (min) {
      return min ? `${Math.floor(min / 60)}h ${min % 60}m` : '0h 0m'
    },
    minuteToHour (min) {
      return min ? Math.round(min / 60 * 100) / 100 : 0
    },
    check() {
      if (!this.$refs.workingform.validate()) return;

      this.confirmDialog = true

      // analytics
      this.$gtag && this.$gtag('event', 'check', {
        'event_category': 'form',
        'event_label': this.managername
      });
    },
    confirm () {
      this.confirmed = true
      this.confirmDialog = false

      this.submit()
    },
    changeDate (displayDate) {
      this.date = displayDate
    },
    submit() {

      var f = document.createElement('form')
      f.setAttribute('method', 'POST')
      f.setAttribute('action', this.teamResponseURL)
      f.target = 'submitresult' // in the complete dialog iframe
      f.style = 'display:none'
      document.body.append(f)

      var param;
      if (this.managername === 'TEST') {
        /*** TEST FORM ***/
        param = {
          'entry.49582767_year': 2018,
          'entry.49582767_month': 12,
          'entry.49582767_day': 12,
          'entry.2048335593': '조대환',
          'entry.1435532183_hour': 1,
          'entry.1435532183_minute': 0,
          fvv: 1,
          pageHistory: 0
        }
      } else {
        param = {
          'entry.1065843082_year': this.endDatetime.getFullYear(),
          'entry.1065843082_month': this.endDatetime.getMonth() + 1,
          'entry.1065843082_day': this.endDatetime.getDate(),
          'entry.1467693251': this.username,
          'entry.2119704746_hour': this.startDatetime.getHours(),
          'entry.2119704746_minute': this.startDatetime.getMinutes(),
          'entry.680657899_hour': this.endDatetime.getHours(),
          'entry.680657899_minute': this.endDatetime.getMinutes(),
          'entry.1760268447_hour': this.breaktimeMinutes > 0 ? Math.floor(this.breaktimeMinutes / 60) : 0,
          'entry.1760268447_minute': this.breaktimeMinutes % 60,
          fvv: 1,
          pageHistory: 0
        }
      }

      Object.keys(param).forEach(key => {
        var el = document.createElement('input')
        el.name = key
        el.value = param[key]
        f.append(el)
      })
      
      f.submit()
      f.remove()
      this.completeDialog = true

      // save history
      this.$store.dispatch('storeHistory', this.date)

      this.submitting = true;

      // analytics
      if (this.$gtag) {
        this.$gtag('event', 'submit', {
          'event_category': 'form',
          'event_label': this.managername,
        })

        this.$gtag('event', this.managername + '-' + this.username, {
          'event_category': (date => {
            const year = date.getFullYear()
            const onejan = new Date(year, 0, 1)
            const weekOfYear = Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7)
            return `${year}년 ${weekOfYear}주`;
          })(this.endDatetime),
          'event_label': this.date,
          'value': this.minuteToHour(this.workingMinutes),
          'username': this.username,
          'managername': this.managername,
          'regulartime': this.minuteToHour(this.regularMinutes),
          'overtime': this.minuteToHour(this.overtimeMinutes),
          'breaktime': this.minuteToHour(this.breaktimeMinutes)
        })
      }
    },
    complete () {
      this.submitting = false;
      this.completed = true;
    },
    closeComplete () {
      document.getElementById('submitresult').src = ''
      this.completed = false
      this.completeDialog = false

      this.$router.push({path:'/history'})
    }
  },
  components: {
    TimePicker,
  }
}
</script>

<style>
[v-cloak] {
  display: none;
}
iframe {
  border: 0em;
  width: 100%;
  height: 100vh;
}

table {
  width: 100%;
}
</style>
