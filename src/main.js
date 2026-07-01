import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'

import '@/admin/assets/styles.scss'
import '@/admin/assets/tailwind.css'
import { createPinia } from 'pinia'
import 'primeflex/primeflex.css'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
})
app.use(pinia)
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
