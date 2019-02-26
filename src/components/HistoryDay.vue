<template>
  <div>
    
    <v-layout row wrap class="text-xs-center">
      <v-flex xs1>
        <v-chip small v-if="hours">{{ hours }}H {{ minutes || 0 }}M</v-chip>
        <v-btn small v-if="!hours" flat icon color="primary" @click="$emit('addNewDate')">
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

