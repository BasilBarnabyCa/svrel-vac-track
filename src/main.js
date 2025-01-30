import { createApp } from 'vue'
import router from './router'
import axios from 'axios'
import App from './App.vue'
import './assets/css/style.css'

const app = createApp(App);
app.use(router);
app.config.globalProperties.$apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
app.mount('#app');