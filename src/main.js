// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import store from './store';
import 'element-plus/dist/index.css'
const app = createApp(App)

app.use(store);

app.use(ElementPlus).use(router).mount('#app')