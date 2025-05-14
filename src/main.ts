import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VueApexCharts from 'vue3-apexcharts'
import naive from 'naive-ui'

const app = createApp(App);
app.use(VueApexCharts);
app.use(naive);
app.mount('#app');
