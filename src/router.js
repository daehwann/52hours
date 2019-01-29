import Vue from 'vue'
import Router from 'vue-router'


import Main from './views/Main.vue'
import History from './views/History.vue'
import Request from './views/Request.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/history',
      name: 'history',
      component: History
    },
    {
      path: '/request',
      name: 'request',
      component: Request
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ],
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})
