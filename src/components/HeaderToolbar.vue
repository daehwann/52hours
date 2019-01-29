<template>
  <div>
    <v-navigation-drawer v-if="false" v-model="drawer" fixed left app >
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
            <v-icon>history</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>History</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/request">
          <v-list-tile-action>
            <v-icon>history</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>문의</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dense primary fixed app extended>
      <!-- <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon> -->
      <v-spacer></v-spacer>
      <v-toolbar-title>CNX 52Hours</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tabs fixed-tabs color="transparent" slot="extension">
        <v-tabs-slider></v-tabs-slider>
        <v-tab to="/">
          <v-icon left>web</v-icon><span>Form</span>
        </v-tab>
        <v-tab to="/history">
          <v-icon left>date_range</v-icon><span>History</span>
        </v-tab>
        <v-tab to="/request">
          <v-icon left>question_answer</v-icon><span>문의</span>
        </v-tab>
      </v-tabs>
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
