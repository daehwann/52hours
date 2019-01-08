<template>
  <v-form>
    <v-card id="newWorkingTime">
      <v-card-title primary-title>
        <h3 class="title">New Working Time</h3>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap justify-space-between>
          <v-flex sm6 xs12 px-3>
            <!-- Username -->
            <v-text-field 
              v-model="username" prepend-icon="person" name="username" 
              :rules="inputRules.username"
              @change="usernameChanged"
              label="이름" id="username" required></v-text-field>
          </v-flex>
          <v-flex sm6 xs12 px-3>
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
          <v-flex xs6 px-3>
            <!-- Date -->
            <v-menu ref="menu1" :close-on-content-click="false" v-model="menu1" :nudge-right="40" lazy
              transition="scale-transition" offset-y full-width max-width="290px" min-width="290px">
              <v-text-field readonly slot="activator" v-model="date" label="날짜" persistent-hint prepend-icon="event"></v-text-field>
              <v-date-picker v-model="date" :show-current="today" no-title @input="menu1 = false"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-layout row wrap>
            <v-flex xs6 px-3>
              <!-- Start time -->
              <time-picker name="출근" label-name="출근" v-model="startTime"></time-picker>
            </v-flex>
            <v-flex xs6 px-3>
              <!-- End time -->
              <time-picker name="퇴근" label-name="퇴근" v-model="endTime"></time-picker>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <!-- Breaktime -->
            <v-flex xs6 sm4 px-3>
              <v-text-field
                prepend-icon="free_breakfast"
                readonly
                name="breaktimeDisplay"
                label="휴식"
                v-model="breaktimeDisplay"
                persistent-hint
                hint="점심시간 제외"
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm8 pl-3>
              <v-slider label-name="휴식시간" ticks step="10" v-model="breaktimeMinute" min="0" max="120"></v-slider>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-layout row wrap my-3>
          <v-flex xs12 text-xs-right>
            <!-- Submit -->
            <v-btn color="primary" @click="check()">확인 후 제출</v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>

    <!-- Dialogs-->
    <v-dialog v-model="confirmDialog" max-width="290">
      <v-card>
        <v-card-title class="title">제출 하시겠습니까?</v-card-title>
        <v-card-text class="text-xs-center">
          <p class="body-2">{{ date }}</p>
          <p class="body-2">{{ startTime }} ~ {{ endTime }}</p>
          <p class="body-2">근무시간: {{ workingtime }}h</p>
          <p class="body-2">휴식시간: {{ breaktimeDisplay }}</p>
          <p class="body-2">초과시간: {{ overtime }}h</p>
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
          <v-toolbar-title>{{ submitting ? '전송중...' : '제출 완료' }}</v-toolbar-title>
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
    <time-picker-test/>
  </v-form>
</template>

<script>
import TimePicker from './TimePicker.vue'
import TimePickerTest from './TimePickerTest.vue'


export default {
  data () {
    return {
      // menu
      drawer: false,
  
      // user
      // username: '',
      manager: '',
      managerList: [
        {text:'한웅', value:'1FAIpQLSeMzqRuE3I6twzxyLZ4y2EwkJyk2NPo09a4p1LvX3AQA7-RIw'},
        {text:'정진영', value: '1FAIpQLSc8cUWGrPDHMD7X_JyxrhcqhqkPmALQOsdRR5MZuklvGpCkUA'},
        {text:'배덕우', value: '1FAIpQLSepNBfnhWzJYtBJn10qrdVCaQaqiR7LLihL6AdctDay4OTKqw'},
        {text:'최인호', value: '1FAIpQLSdZ3ykSfeJIp94N7zoJuImU-ZglaUkkPc-FLgiUcZkUkkRdgQ'},
        {text:'조희제', value: '1FAIpQLSfjiyuJmey5ZUcJYgqqC0fZBlcCtktyeFZwANmym4f1B4QmXQ'},
        {text:'장예성', value: '1FAIpQLSdEbsAkX9iHWF8603UXETPKcV3MEna2gOHRekZ1nIcdyU8w5w'},
        {text:'김경희', value: '1FAIpQLSd3OeLXwiW9fnAxJQOZwQ_LT2Dk_SROfnE8kOVciueXQsYDcQ'},
        {text:'김세정', value: '1FAIpQLScutj6ijHDN1hUZZ1l03lfGLbcSMRMzurq-dMOvx5BFrcUTfA'},
        {text:'박영서', value: '1FAIpQLSfFHgRpKJdejDfxakoOIJgXULtGSm2SF3iNlJda0E_cdbdT1w'},
        {text:'한정훈', value: '1FAIpQLSfxNENnR9EnB9cTv1oCW9pu_4pZNNoCfXrXILyvCvtqHKCWkg'}
      ],
      
      // date & time
      now: new Date(),
      date: '',
      today: '',
      startTime: '09:00',
      endTime: '',
      menu1: false, // for date picker
      breaktimeMinute: 0,
      
      // validations
      inputRules: {
        manager: [ (v) => !!v || '소속을 선택하세요.'],
        username: [ (v) => !!v || '이름을 입력하세요.']
      },
  
      // dialogs
      confirmDialog: false,
      confirmed: false,
      submitting: false,
      completeDialog: false,
      completed: false,
      completedDate: ''
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

    // set manager
    this.manager = this.managerList
        .filter(m => m.text === this.managername)
        .map(m => m.value).pop() || ''
  },
  watch: {
    // username(newValue) {
    //   localStorage.username = newValue
    //   this.$store.commit('username', newValue)
    // },
    // managername(name) {
    //   this.manager = this.managerList
    //     .filter(m => m.text === name)
    //     .map(m => m.value).pop() || ''

    //   // localStorage.managername = managername
    //   // //todo filter manager
    //   // this.$store.commit('managername', managername)
    // }
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
    standardDatetime () {
      return new Date(`${this.date}T18:00:00+09:00`)
    },
    overtime () {
      return this.workingtime < 8 ? 0 : this.gapHours(this.standardDatetime, this.endDatetime)
    },
    breaktimeDisplay () {
      if (this.breaktimeMinute == 0) {
        return '0h 0m'
      } else {
        return `${Math.floor(this.breaktimeMinute / 60)}h ${this.breaktimeMinute % 60}m`
      }
    },
    workingtime () {
      return this.gapHours(this.startDatetime, this.endDatetime)-1
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
      // this.$store.dispatch('loadHistory')
    },
    goToOriginPage () {
      // analytics
      this.$gtag && this.$gtag('event', 'original page', {
        'event_category': 'link',
        'event_label': this.managername
      });
    },
    gapHours (start, end) {
      return Math.floor( (end - start) / 1000 / 60 / 60)
    },
    check() {
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
          'entry.1760268447_hour': this.breaktimeMinute > 0 ? Math.floor(this.breaktimeMinute / 60) : 0,
          'entry.1760268447_minute': this.breaktimeMinute % 60,
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
      // this.completedDate = `${this.endDatetime.getFullYear()}-${this.endDatetime.getMonth()+1}-${this.endDatetime.getDate()}`
      this.$store.dispatch('storeHistory', this.date)
      // this.history.push(this.date)
      // localStorage.history = this.history.join('|')

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
          'value': this.workingtime
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
    TimePickerTest
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
