import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import Ripple from 'primevue/ripple'

import './style.css'
import App from './App.vue'

// get middlewares
import routers from './routers'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(routers)

// PrimeVUE
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false
    }
  }
})

// Directivas
app.directive('ripple', Ripple)

app.mount('#app')
