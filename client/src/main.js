import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// TODO: Learn to implement some kind of auth, user id will be exposed and stuff (need some access tokens or something)

createApp(App)
.use(router)
.mount('#app')
