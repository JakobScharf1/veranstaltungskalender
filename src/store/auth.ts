import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            username: '',
            role: 'user',
            token: '',
        }
    },
    actions: {
        selfReset() {
            this.$reset()
        }
    }
})
