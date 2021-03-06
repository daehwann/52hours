import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './plugins/vuetify'
import './plugins/vue-disqus'
// import './registerServiceWorker'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$gtag = window.gtag
Vue.prototype.$rollbar = window.Rollbar

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
