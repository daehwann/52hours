<template>
  <v-content>
    <v-container v-if="faq">
      <v-card>
        <v-card-title primary-title>
          <h3 class="title">자주하는 질문</h3>
        </v-card-title>
        <v-card-text>
          <v-expansion-panel my-2>
            <v-expansion-panel-content v-for="(item,i) in (faq && faq.filter(q=>q&&q.title))" :key="i">
              <div slot="header">{{item.title}}</div>
              <v-card>
                <v-img v-show="item.image" :src="item.image" contain aspect-ratio="1" max-height="300"></v-img>
                <v-card-text v-html="item.content"></v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container>
      <v-card>
        <v-card-title primary-title>
          <h3 class="title">추가 문의 or 에러</h3>
        </v-card-title>
        <v-card-text>
          <vue-disqus shortname="cnx-go-home" :identifier="$router.path"></vue-disqus>
        </v-card-text>
      </v-card>
    </v-container>
  </v-content>
</template>

<script>
export default {
  
  computed: {

    faq() {
      return this.$store.state.content.faq
    }
  }
};
</script>


