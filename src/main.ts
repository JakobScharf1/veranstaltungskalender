import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import deLocale from 'primelocale/de.json'

import '@/assets/styles.scss'
import '@/assets/tailwind.css'
import { createPinia } from 'pinia'
import 'primeflex/primeflex.css'
import { useAuthStore } from './store/auth.js'

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

const auth = useAuthStore()

auth.fetchUser().finally(() => {
    app.mount('#app')
})

