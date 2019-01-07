<template>
  <div>
    <v-navigation-drawer v-model="drawer" fixed left app >
      <v-list>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/history">
          <v-list-tile-action>
            <v-icon>contact_mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>History</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar primary fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>CNX 52Hours</v-toolbar-title>
      
      <v-spacer></v-spacer>

      <!-- <v-toolbar-items>
        <v-btn flat :disabled="!manager" :href="teamOriginalFormURL" @click="goToOriginPage()" target="_blank" class="caption">
            {{ managerName }} 팀 기존 페이지로 가기
          <v-icon>link{{ !managerName ? '_off' : ''}}</v-icon>
        </v-btn>
      </v-toolbar-items> -->
    </v-toolbar>
  </div>
</template>

<script>
export default {
  prop: {
    managerName: ''
  },
  data () {
    return {
      drawer: false
    }
  }
}
</script>
