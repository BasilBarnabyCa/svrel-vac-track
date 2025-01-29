import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import 'lineicons/dist/lineicons.css';
import './assets/css/style.css'

const app = createApp(App);
app.use(router);
app.mount('#app');