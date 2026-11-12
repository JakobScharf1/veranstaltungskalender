import AppLayout from '@/admin/layout/AppLayout.vue'
import Layout from '@/frontend/FrontendLayout.vue'
import { useAuthStore } from '@/store/auth'
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Layout,
            children: [
                {
                    path: '',
                    component: () => import('@/frontend/views/TimeLine.vue')
                }
            ]
        },
        {
            path: '/mgmt',
            component: AppLayout,
            children: [
                {
                    path: '',
                    redirect: { name: 'termine' }
                },
                {
                    path: 'termine',
                    name: 'termine',
                    component: () => import('@/admin/views/Termine.vue')
                },
                {
                    path: 'veranstaltungen',
                    name: 'veranstaltungen',
                    component: () => import('@/admin/views/Veranstaltungen.vue')
                },
                {
                    path: 'orte',
                    name: 'orte',
                    component: () => import('@/admin/views/Orte.vue')
                },
                {
                    path: 'veranstalter',
                    name: 'veranstalter',
                    component: () => import('@/admin/views/Veranstalter.vue'),
                    meta: { rolle: 'admin' }
                },
                {
                    path: 'kategorien',
                    name: 'kategorien',
                    component: () => import('@/admin/views/Kategorien.vue'),
                    meta: { rolle: 'superadmin' }
                },
                {
                    path: 'partner',
                    name: 'partner',
                    component: () => import('@/admin/views/Partner.vue'),
                    meta: { rolle: 'superadmin' }
                },
                {
                    path: 'profil',
                    name: 'profil',
                    component: () => import('@/admin/views/Profil.vue')
                }
            ]
        },
        {
            path: '/termin/:id/:title',
            name: 'terminDetails',
            component: () => import('@/frontend/views/TerminDetails.vue')
        },
        {
            path: '/notfound',
            name: 'notfound',
            component: () => import('@/admin/views/NotFound.vue')
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/admin/views/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/admin/views/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/admin/views/auth/Error.vue')
        }
    ]
})

router.beforeEach(async (to) => {
    const authStore = useAuthStore()
    const istVerwaltung = to.path.startsWith('/mgmt')

    if (istVerwaltung) {
        // Rollen sind erst nach GET /me bekannt (z. B. beim direkten Aufruf/Reload)
        await authStore.ensureUser()
    }

    if (istVerwaltung && !authStore.isAuthenticated) {
        return { name: 'login' }
    }

    if (to.name === 'login' && authStore.isAuthenticated) {
        return { name: 'termine' }
    }

    const benoetigteRolle = to.meta.rolle
    if (benoetigteRolle && !authStore.hatRolle(benoetigteRolle)) {
        return { name: 'accessDenied' }
    }

    return true
})

export default router
