import { useAuthStore } from "@/store/auth"
import { router } from '@/router'

export const LoginService = {
    login(username: string, password: string): boolean {
        const authStore = useAuthStore()

        if (username === 'admin' && password === 'admin') {
            authStore.username = username
            authStore.role = 'admin'
            authStore.token = 'fake-jwt-token'
            router.push('/mgmt')
            return true
        } else if (username === 'user' && password === 'user') {
            authStore.username = username
            authStore.role = 'user'
            authStore.token = 'fake-jwt-token'
            router.push('/mgmt')
            return true
        } else {
            return false
        }
    },

    checkAuth(): void {
        const authStore = useAuthStore()

        const token = authStore.token
        //TODO TOKEN CHECK
        if (!token) {
            router.push('/auth/login')
        } else {
            router.push('/mgmt')
        }
    },

    logout(): void {
        const authStore = useAuthStore()
        authStore.$reset()
        router.push('/auth/login')
    }
}
