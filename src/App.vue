<template>
  <v-app id="app">
    <!-- Header -->
    <header-toolbar/>

    <!-- Contents -->
    <transition name="slide-fade" mode="out-in">
      <router-view></router-view>
    </transition>
    
    <!-- Footer -->
    <v-footer app inset height="50">
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
      version: version,
      transitionName: ''
    }
  },
  created () {
    this.$store.commit('init', {
      username: localStorage.username, 
      managername: localStorage.managername
    })
    this.$store.dispatch('loadContent')
    this.$store.dispatch('loadHistory')
  },
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'

      this.$gtag && this.$gtag('config', 'UA-131329692-1', {
        'page_title': ({
            '/': 'Form', 
            '/history': 'History'
          })[to.path],
        'page_path': to.path,
        'page_location': document.location.href,
        'user_id': this.$store.state.username,
      })
    }
  },
  components: {
    HeaderToolbar
  }

}
</script>

<style>
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>

