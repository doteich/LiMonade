import { createRouter, createWebHashHistory } from 'vue-router'
import machineView from "../views/machineView.vue"
import homeView from "../views/homeView.vue"
import lineView from "../views/lineView.vue"


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: homeView
    },
    {
      path: '/',
      name: 'home',
      component: homeView,
      meta: { type: "home" }
    },

    {
      path: '/:line',
      name: 'line',
      component: lineView,
      meta: { type: "line" }
    },
    {
      path: '/:line/:machine',
      name: 'machineView',
      component: machineView,
      meta: { type: "machine" }
    },

  ]
})

export default router

