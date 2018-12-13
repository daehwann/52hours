const managerList = [
  // {text:'TEST', value: '1FAIpQLScp5JzRN86jDgwsDW2xbbvNoiBS7kt8tBZTJW5MV-iykKd5Vg'},
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
]

new Vue({
  el: '#app',
  data: vm => ({
    // user
    username: '',
    manager: '',
    managerName: '',
    teamList: managerList,
    
    // date & time
    now: new Date(),
    date: '',
    today: '',
    startTime: '09:00',
    endTime: '',
    menu1: false, // for date picker
    
    // validations
    inputRules: {
      manager: [ (v) => !!v || '소속을 선택하세요.'],
      username: [ (v) => !!v || '이름을 입력하세요.']
    },

    // dialogs
    confirmDialog: false,
    confirmed: false,
    completeDialog: false,
    completed: false,

    showResult: false,

    // history
    // 'history' is yyyy-MM-dd formatted text array for history
    history: []
  }),
  mounted () {
    let month = this.now.getMonth() + 1 + ''
    let day = this.now.getDate() + ''
    this.date = `${this.now.getFullYear()}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    this.today = this.date

    let hour = this.now.getHours() + ''
    let min = this.now.getMinutes() + ''
    this.endTime = `${hour.padStart(2, '0')}:${min.padStart(2, '0')}`

    if (localStorage.username) {
      this.username = localStorage.username || Cookies.get('username')
    }

    if (localStorage.manager) {
      this.manager =  localStorage.manager
    }

    let history = localStorage.history || Cookies.get('h') || ''
    this.history = history.split('|')
      .filter(function(v) {return !!v && v!='undefined'})
      .sort(function (a, b) {
        return b.localeCompare(a)
      })
  },
  watch: {
    username(newValue, oldValue) {
      localStorage.username = newValue
    },
    manager(newValue) {
      localStorage.manager = newValue

      this.managerName = managerList.filter(m => m.value == this.manager)[0].text
    }
  },
  computed: {
    teamResponseURL() {
      return `https://docs.google.com/forms/d/e/${this.manager}/formResponse`
    },
    teamOriginalFormURL() {
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
      return this.gapHours(this.standardDatetime, this.endDatetime)
    },
    workingtime () {
      return this.gapHours(this.endDatetime, this.startDatetime)-1
    }
  },
  methods: {
    gapHours (start, end, enableAbs) {
      return Math.floor( Math.abs(start - end) / 1000 / 60 / 60)
    },
    confirm () {
      this.confirmDialog = true
    },
    submit() {

      var f = document.createElement('form')
      f.setAttribute('method', 'POST')
      f.setAttribute('action', this.teamResponseURL)
      f.target = 'submitresult' // in the complete dialog iframe
      f.style = 'display:none'
      document.body.append(f)

      var param;
      if (this.managerName === 'TEST') {
        /*** TEST FORM ***/
        param = {
          'entry.49582767_year': 2018,
          'entry.49582767_month': 12,
          'entry.49582767_day': 12,
          'entry.2048335593': '조대환',
          'entry.1435532183_hour': 01,
          'entry.1435532183_minute': 00,
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
          'entry.1760268447_hour': this.overtime,
          'entry.1760268447_minute': 00,
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
      this.history.push(this.date)
      localStorage.history = this.history.join('|')
    }
  }
})