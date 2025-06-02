import './style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import '@/scss/style.scss'
import App from './App.vue'
import router from './router'
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar'
import VueTablerIcons from 'vue-tabler-icons'
import VueApexCharts from 'vue3-apexcharts'
import api from './configs/api_client'
import useAuthStore from './stores/auth'

const app = createApp(App)

app.config.globalProperties.$axios = api

app.use(createPinia())
app.use(router)

const auth = useAuthStore()
auth.loadTokenFromLocalStorage()

app.use(VueTablerIcons)
app.use(PerfectScrollbarPlugin)
app.use(VueApexCharts)
app.component('apexchart', VueApexCharts)
app.use(vuetify).mount('#app')
