import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './plugins/vuetify'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.prototype.$http = axios

if (process.env.NODE_ENV === 'production') {
  Vue.prototype.$gtag = window.gtag
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
