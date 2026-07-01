<script setup>
import { ref, onMounted } from 'vue'
import AppMenuItem from './AppMenuItem.vue'
import { useAuthStore } from '@/store/auth.ts'

const auth = useAuthStore()

onMounted(() => {
    if (auth.role === 'admin') {
        model.value[0].items.push({
            label: 'Veranstalter',
            icon: 'pi pi-fw pi-users',
            to: '/mgmt/admin/veranstalter',
        })
    }
})

const model = ref([
    // {
    //     label: 'Übersicht',
    //     items: [
    //         {
    //             label: 'Dashboard',
    //             icon: 'pi pi-fw pi-home',
    //             to: '/'
    //         }
    //     ]
    // },
    {
        label: 'Verwaltung',
        items: [
            {
                label: 'Termine',
                icon: 'pi pi-fw pi-calendar',
                to: auth.role === 'admin' ? '/mgmt/admin/termine' : '/mgmt/termine'
            },
            {
                label: 'Orte',
                icon: 'pi pi-fw pi-map',
                to: auth.role === 'admin' ? '/mgmt/admin/orte' : '/mgmt/orte'
            }
            // {
            //     label: 'Form Layout',
            //     icon: 'pi pi-fw pi-id-card',
            //     to: '/uikit/formlayout'
            // },
            // {
            //     label: 'Input',
            //     icon: 'pi pi-fw pi-check-square',
            //     to: '/uikit/input'
            // },
            // {
            //     label: 'Button',
            //     icon: 'pi pi-fw pi-mobile',
            //     to: '/uikit/button',
            //     class: 'rotated-icon'
            // },
            // {
            //     label: 'Table',
            //     icon: 'pi pi-fw pi-table',
            //     to: '/uikit/table'
            // },
            // {
            //     label: 'List',
            //     icon: 'pi pi-fw pi-list',
            //     to: '/uikit/list'
            // },
            // {
            //     label: 'Tree',
            //     icon: 'pi pi-fw pi-share-alt',
            //     to: '/uikit/tree'
            // },
            // {
            //     label: 'Panel',
            //     icon: 'pi pi-fw pi-tablet',
            //     to: '/uikit/panel'
            // },
            // {
            //     label: 'Overlay',
            //     icon: 'pi pi-fw pi-clone',
            //     to: '/uikit/overlay'
            // },
            // {
            //     label: 'Media',
            //     icon: 'pi pi-fw pi-image',
            //     to: '/uikit/media'
            // },
            // {
            //     label: 'Menu',
            //     icon: 'pi pi-fw pi-bars',
            //     to: '/uikit/menu'
            // },
            // {
            //     label: 'Message',
            //     icon: 'pi pi-fw pi-comment',
            //     to: '/uikit/message'
            // },
            // {
            //     label: 'File',
            //     icon: 'pi pi-fw pi-file',
            //     to: '/uikit/file'
            // },
            // {
            //     label: 'Chart',
            //     icon: 'pi pi-fw pi-chart-bar',
            //     to: '/uikit/charts'
            // },
            // {
            //     label: 'Timeline',
            //     icon: 'pi pi-fw pi-calendar',
            //     to: '/uikit/timeline'
            // },
            // {
            //     label: 'Misc',
            //     icon: 'pi pi-fw pi-circle',
            //     to: '/uikit/misc'
            // }
        ]
    },
    // {
    //     label: 'Prime Blocks',
    //     icon: 'pi pi-fw pi-prime',
    //     path: '/blocks',
    //     items: [
    //         {
    //             label: 'Free Blocks',
    //             icon: 'pi pi-fw pi-eye',
    //             to: '/blocks/free'
    //         }
    //     ]
    // },
    // {
    //     label: 'Pages',
    //     icon: 'pi pi-fw pi-briefcase',
    //     path: '/pages',
    //     items: [
    //         {
    //             label: 'Auth',
    //             icon: 'pi pi-fw pi-user',
    //             path: '/auth',
    //             items: [
    //                 {
    //                     label: 'Login',
    //                     icon: 'pi pi-fw pi-sign-in',
    //                     to: '/auth/login'
    //                 },
    //                 {
    //                     label: 'Error',
    //                     icon: 'pi pi-fw pi-times-circle',
    //                     to: '/auth/error'
    //                 },
    //                 {
    //                     label: 'Access Denied',
    //                     icon: 'pi pi-fw pi-lock',
    //                     to: '/auth/access'
    //                 }
    //             ]
    //         },
    //         {
    //             label: 'Not Found',
    //             icon: 'pi pi-fw pi-exclamation-circle',
    //             to: '/pages/notfound'
    //         }
    //     ]
    // }
])
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
