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
  components: {
    HeaderToolbar
  },
  data () {
    return {
      version: version
    }
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
  height: 100%;
}

table {
  width: 100%;
}
</style>
