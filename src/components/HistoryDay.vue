<template>
  <div>
    
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-left text-sm-center">
        <div v-if="hours">{{ String(hours).padStart(2,0) }}h {{ String(minutes || 0).padStart(2,0) }}m</div>
        <v-btn class="ma-0" small v-if="!hours && y_m_d" flat icon color="primary" @click="$emit('addNewDate')">
          <v-icon>add_circle</v-icon>
        </v-btn>  
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    workingInfo: Object
  },
  computed: {
    date () {
      return this.workingInfo.date
    },
    y_m_d () {
      return this.workingInfo.y_m_d
    },
    hours () {
      return this.workingInfo.workingHour
    },
    minutes () {
      return this.workingInfo.workingMinute
    }
  },
  data () {
    return {
      
    }
  }
}
</script>

