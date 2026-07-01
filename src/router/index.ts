import AppLayout from '@/admin/layout/AppLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/frontend/views/TimeLine.vue')
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
                {
                    path: 'uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/admin/views/uikit/FormLayout.vue')
                },
                {
                    path: 'uikit/input',
                    name: 'input',
                    component: () => import('@/admin/views/uikit/InputDoc.vue')
                },
                {
                    path: 'uikit/button',
                    name: 'button',
                    component: () => import('@/admin/views/uikit/ButtonDoc.vue')
                },
                {
                    path: 'uikit/table',
                    name: 'table',
                    component: () => import('@/admin/views/uikit/TableDoc.vue')
                },
                {
                    path: 'uikit/list',
                    name: 'list',
                    component: () => import('@/admin/views/uikit/ListDoc.vue')
                },
                {
                    path: 'uikit/tree',
                    name: 'tree',
                    component: () => import('@/admin/views/uikit/TreeDoc.vue')
                },
                {
                    path: 'uikit/panel',
                    name: 'panel',
                    component: () => import('@/admin/views/uikit/PanelsDoc.vue')
                },

                {
                    path: 'uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/admin/views/uikit/OverlayDoc.vue')
                },
                {
                    path: 'uikit/media',
                    name: 'media',
                    component: () => import('@/admin/views/uikit/MediaDoc.vue')
                },
                {
                    path: 'uikit/message',
                    name: 'message',
                    component: () => import('@/admin/views/uikit/MessagesDoc.vue')
                },
                {
                    path: 'uikit/file',
                    name: 'file',
                    component: () => import('@/admin/views/uikit/FileDoc.vue')
                },
                {
                    path: 'uikit/menu',
                    name: 'menu',
                    component: () => import('@/admin/views/uikit/MenuDoc.vue')
                },
                {
                    path: 'uikit/charts',
                    name: 'charts',
                    component: () => import('@/admin/views/uikit/ChartDoc.vue')
                },
                {
                    path: 'uikit/misc',
                    name: 'misc',
                    component: () => import('@/admin/views/uikit/MiscDoc.vue')
                },
                {
                    path: 'uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/admin/views/uikit/TimelineDoc.vue')
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
