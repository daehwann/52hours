<template>
  <v-menu
    ref="menu"
    :close-on-content-click="false"
    v-model="menu2"
    :nudge-right="40"
    :return-value.sync="time"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    max-width="290px"
    min-width="290px"
  >
    <v-text-field
      slot="activator"
      v-model="time"
      label="Picker in menu"
      prepend-icon="access_time"
      readonly
    ></v-text-field>
    <v-time-picker
      v-if="menu2"
      v-model="time"
      full-width
      @change="$refs.menu.save(time)"
    ></v-time-picker>
  </v-menu>
  <!-- <v-menu ref="menu" @input="$emit('input', time)" :close-on-content-click="false" v-model="timemodal" :nudge-right="40" :return-value.sync="time"
    lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px">
    <v-text-field slot="activator" v-model="time" :label="labelName" prepend-icon="access_time" 
        readonly></v-text-field>
    <v-time-picker v-if="timemodal" v-model="time" full-width @change="$refs.menu.save(time)"></v-time-picker>
  </v-menu> -->
</template>

<script>
export default {
  props: {
    labelName: String,
    value: String,
  },
  data () {
    return {
      menu: false,
      time: this.value,
      timemodal: false,
      workingAt: '',
    }
  },
  watch: {
    value (newValue) {
      this.time = newValue
    }
  }
}
</script>

