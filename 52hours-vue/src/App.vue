<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>

    <header-toolbar/>

    <v-content>
      <v-container>
        <!-- Form -->
        <working-time-form />
      </v-container>

      <v-divider></v-divider>

      <!-- History -->
      <v-container grid-list-xs>
        <history-calendar
          :manager="managerName"
          :username="username"
          :completed-date="completedDate" 
          v-on:saved="completedDate = null" 
          v-on:add="changeDate">
        </history-calendar>
      </v-container>
    </v-content>

    <v-footer app height="50">
      <div class="pa-4">52hours v{{ $version }}</div>
      <v-spacer></v-spacer>
      <div class="pa-4"> &copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
  </div>
</template>

<script>
// import HeaderToolbar from './components/HeaderToolbar'
import WorkingTimeForm from './components/WorkingTime'
import HistoryCalendar from './components/HistoryCalendar'


export default {
  components: {
    HeaderToolbar,
    WorkingTimeForm,
    HistoryCalendar
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
