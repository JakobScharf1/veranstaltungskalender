import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            username: '',
            role: 'admin'
        }
    },
    actions: {
        selfReset() {
            this.$reset()
        }
    }
})
