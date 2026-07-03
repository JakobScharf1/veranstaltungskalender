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
                },
            ],
        },

        {
            path: '/mgmt',
            component: AppLayout,
            children: [
                {
                    path: '',
                    redirect: '/mgmt/termine'
                },
                {
                    path: '/mgmt/termine',
                    name: 'termine',
                    component: () => import('@/admin/views/Termine.vue')
                },
                {
                    path: '/mgmt/veranstalter',
                    name: 'adminveranstalter',
                    component: () => import('@/admin/views/Veranstalter.vue')
                },
                {
                    path: '/mgmt/orte',
                    name: 'orte',
                    component: () => import('@/admin/views/Orte.vue')
                },
            ]
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

router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore()
    const isPublicRoute = to.path === '/' || to.path.startsWith('/auth') || to.path === '/notfound'

    if (to.path.startsWith('/mgmt') && !authStore.token) {
        next({ name: 'login' })
        return
    }

    if (to.name === 'login' && authStore.token) {
        next({ path: '/mgmt' })
        return
    }

    if (!isPublicRoute && !authStore.token) {
        next({ name: 'login' })
        return
    }

    next()
})

export default router
