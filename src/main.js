import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './registerServiceWorker'  // Ensure the service worker is registered
import 'shepherd.js/dist/css/shepherd.css'

const app = createApp(App)

app.use(router)

app.mount('#app')

AOS.init({})

// Alert user when offline or online
window.addEventListener('offline', () => {
  alert("You are now offline. Please check your internet connection.");
});

window.addEventListener('online', () => {
  alert("You are back online.");
});