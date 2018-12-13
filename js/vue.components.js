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