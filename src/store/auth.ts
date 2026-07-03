import router from '@/router'
import { ApiService } from '@/services/APIService'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const username = ref("")
    const vorname = ref("")
    const nachname = ref("")
    const admin = ref(false)
    const email = ref("")
    const organisation = ref("")

    const token = ref<string | null>(localStorage.getItem('token'))

    const isAuthenticated = computed(() => !!token.value)

    async function login(username: string, password: string): Promise<boolean> {
        const res = await ApiService.post<any>(`/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
        try {
            token.value = res.token
            username = res.username
            localStorage.setItem('token', res.token)
            return true

        } catch(error) {
            console.error('Error during login:', error)
            return false
        }
    }

    async function fetchUser(): Promise<void> {
        if (!token.value) return
        const res = await ApiService.get<any>('/me', { useAuthToken: true })
        try {
            username.value = res.username
            vorname.value = res.vorname
            nachname.value = res.nachname
            admin.value = res.admin
            email.value = res.email
            organisation.value = res.organisation
        } catch(error) {
            console.error('Error fetching user info:', error)
        }
    }

    async function logout(): Promise<void> {
        token.value = null
        localStorage.removeItem('token')
        username.value = ""
        vorname.value = ""
        nachname.value = ""
        admin.value = false
        email.value = ""
        organisation.value = ""
        router.push('/')
    }

    return { username, vorname, nachname, admin, email, organisation, token, isAuthenticated, login, logout, fetchUser }
})
