import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import deLocale from 'primelocale/de.json'

import '@/assets/styles.scss'
import '@/assets/tailwind.css'
import { createPinia } from 'pinia'
import 'primeflex/primeflex.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        },
    },
    locale: deLocale.de
})
app.use(ToastService)
app.use(ConfirmationService)

// Nutzerdaten werden bei Bedarf im Router-Guard geladen
app.mount('#app')

