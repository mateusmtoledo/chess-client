import { createApp } from 'vue'
import App from './App.vue'
import './assets/index.css'
import { Button } from './components/ui/button'

const app = createApp(App)

app.component('Button', Button)

app.mount('#app')

