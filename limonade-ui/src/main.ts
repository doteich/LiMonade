import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config';
import Chart from 'primevue/chart';


import App from './App.vue'
import router from './router'

import './assets/main.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import "primevue/resources/themes/lara-light-indigo/theme.css";     
import "primevue/resources/primevue.min.css";


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)


app.component('pv-chart', Chart);


app.mount('#app')
