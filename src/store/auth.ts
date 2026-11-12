import { ApiError } from '@/services/api/ApiError'
import { tokenStorage } from '@/services/api/tokenStorage'
import { authService } from '@/services/authService'
import type { CurrentUser, PasswortPayload, ProfilPayload, Rolle } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const ROLLEN_RANG: Record<Rolle, number> = {
    user: 0,
    admin: 1,
    superadmin: 2
}

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(tokenStorage.get())
    const user = ref<CurrentUser | null>(null)
    let pendingUserRequest: Promise<void> | null = null

    const isAuthenticated = computed(() => !!token.value)
    const isSuperadmin = computed(() => user.value?.superadmin === true)
    const isAdmin = computed(() => isSuperadmin.value || user.value?.admin === true)

    const rolle = computed<Rolle>(() => {
        if (isSuperadmin.value) return 'superadmin'
        if (isAdmin.value) return 'admin'
        return 'user'
    })

    function hatRolle(mindestRolle: Rolle): boolean {
        return ROLLEN_RANG[rolle.value] >= ROLLEN_RANG[mindestRolle]
    }

    function clearSession(): void {
        token.value = null
        user.value = null
        tokenStorage.clear()
    }

    async function login(username: string, password: string): Promise<void> {
        const response = await authService.login(username, password)
        token.value = response.token
        tokenStorage.set(response.token)
        await fetchUser()
    }

    async function fetchUser(): Promise<void> {
        if (!token.value) return

        try {
            user.value = await authService.getMe()
        } catch (error) {
            // Abgelaufenes oder ungültiges Token: Sitzung verwerfen
            if (error instanceof ApiError && error.status === 401) {
                clearSession()
            }
        }
    }

    /** Lädt die Nutzerdaten genau einmal, auch wenn mehrere Aufrufer gleichzeitig warten. */
    function ensureUser(): Promise<void> {
        if (user.value || !token.value) return Promise.resolve()

        pendingUserRequest ??= fetchUser().finally(() => {
            pendingUserRequest = null
        })
        return pendingUserRequest
    }

    async function updateProfil(payload: ProfilPayload | PasswortPayload): Promise<void> {
        await authService.updateMe(payload)
        await fetchUser()
    }

    async function logout(): Promise<void> {
        try {
            await authService.logout()
        } finally {
            clearSession()
        }
    }

    return { token, user, isAuthenticated, isAdmin, isSuperadmin, rolle, hatRolle, login, fetchUser, ensureUser, updateProfil, logout }
})
