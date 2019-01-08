<template>
  <v-app id="app">
    <!-- Header -->
    <header-toolbar/>

    <!-- Contents -->
    <router-view/>

    <!-- Footer -->
    <v-footer app height="50">
      <div class="pa-4">52hours v{{ version }}</div>
      <v-spacer></v-spacer>
      <div class="pa-4"> &copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
  </v-app>
</template>

<script>
import {version} from '../package.json'
import HeaderToolbar from './components/HeaderToolbar.vue'

export default {
  
  data () {
    return {
      version: version
    }
  },
  created () {
    this.$store.commit('init', {
      username: localStorage.username, 
      managername: localStorage.managername
    })
  },
  mounted () {
    
  },
  components: {
    HeaderToolbar
  }

}
</script>
