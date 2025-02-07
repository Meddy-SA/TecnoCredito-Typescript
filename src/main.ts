// Core Vue Imports
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Styles
import './style.css'
import 'primeicons/primeicons.css'
import 'boxicons'
import 'atropos/css'

// Router
import router from './routers'

// PrimeVue Configuration
import PrimeVue from 'primevue/config'
import { localeOptions } from './locales/primevue-locale'
import MyPreset from './config/myPreset'

// PrimeVue Services
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

// PrimeVue Directives
import Tooltip from 'primevue/tooltip'
import FocusTrap from 'primevue/focustrap'
import Ripple from 'primevue/ripple'
import StyleClass from 'primevue/styleclass'
import BadgeDirective from 'primevue/badgedirective'
import AnimateOnScroll from 'primevue/animateonscroll'

// Third Party Libraries
import { register as registerSwiper } from 'swiper/element/bundle'

// Initialize Swiper
registerSwiper()

// Create Vue application instance
const app = createApp(App)
const pinia = createPinia()

// Configure PrimeVue
const primeVueConfig = {
  ripple: true,
  locale: localeOptions,
  theme: {
    preset: MyPreset,
    options: {
      prefix: 'p',
      darkModeSelector: '.my-app-dark',
      cssLayer: false,
    },
  },
}

// Register plugins
app.use(pinia)
app.use(router)
app.use(PrimeVue, primeVueConfig)

// Register PrimeVue services
app.use(ToastService)
app.use(ConfirmationService)

// Register PrimeVue directives
const directives = {
  tooltip: Tooltip,
  focustrap: FocusTrap,
  ripple: Ripple,
  styleclass: StyleClass,
  badge: BadgeDirective,
  animateonscroll: AnimateOnScroll,
}

Object.entries(directives).forEach(([name, directive]) => {
  app.directive(name, directive)
})

// Mount application
app.mount('#app')
