import { createRouter, createWebHistory } from 'vue-router'
import machineView from "../views/machineView.vue"
import homeView from "../views/homeView.vue"
import lineView from "../views/lineView.vue"


const router = createRouter({
 history: createWebHistory(import.meta.env.BASE_URL),
 routes: [
   {
     path: '/',
     name: 'home',
    component: homeView
   },
   {
    path: '/',
    name: 'home',
   component: homeView
  },

  {
    path: '/:line',
    name: 'line',
   component: lineView
  },
  {
    path: '/:line/:machine',
    name: 'machineView',
   component: machineView
  },

 ] 
})

export default router

