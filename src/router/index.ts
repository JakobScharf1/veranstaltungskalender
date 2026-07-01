import AppLayout from '@/admin/layout/AppLayout.vue'
import Layout from '@/frontend/FrontendLayout.vue'
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
                    path: 'termine',
                    name: 'termine',
                    component: () => import('@/admin/views/verwaltung/TermineUser.vue')
                },
                {
                    path: 'admin/termine',
                    name: 'admintermine',
                    component: () => import('@/admin/views/admin/TermineAdmin.vue')
                },
                {
                    path: 'admin/veranstalter',
                    name: 'adminveranstalter',
                    component: () => import('@/admin/views/admin/Veranstalter.vue')
                },
                {
                    path: 'orte',
                    name: 'orte',
                    component: () => import('@/admin/views/verwaltung/OrteUser.vue')
                },
            ]
        },
        {
            path: '/notfound',
            name: 'notfound',
            component: () => import('@/admin/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/admin/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/admin/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/admin/views/pages/auth/Error.vue')
        }
    ]
})

export default router
