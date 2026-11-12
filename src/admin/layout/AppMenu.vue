<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import type { Rolle } from '@/types'
import { computed } from 'vue'
import AppMenuItem from './AppMenuItem.vue'

type MenuEintrag = {
    label: string
    icon: string
    to: string
    rolle?: Rolle
}

const MENU_EINTRAEGE: MenuEintrag[] = [
    { label: 'Termine', icon: 'pi pi-fw pi-calendar', to: '/mgmt/termine' },
    { label: 'Veranstaltungen', icon: 'pi pi-fw pi-star', to: '/mgmt/veranstaltungen' },
    { label: 'Orte', icon: 'pi pi-fw pi-map-marker', to: '/mgmt/orte' },
    { label: 'Veranstalter', icon: 'pi pi-fw pi-users', to: '/mgmt/veranstalter', rolle: 'admin' },
    { label: 'Kategorien', icon: 'pi pi-fw pi-tags', to: '/mgmt/kategorien', rolle: 'superadmin' },
    { label: 'Partner', icon: 'pi pi-fw pi-briefcase', to: '/mgmt/partner', rolle: 'superadmin' }
]

const authStore = useAuthStore()

const model = computed(() => [
    {
        label: 'Verwaltung',
        items: MENU_EINTRAEGE.filter((eintrag) => !eintrag.rolle || authStore.hatRolle(eintrag.rolle))
    }
])
</script>

<template>
    <nav aria-label="Verwaltung">
        <ul class="layout-menu">
            <AppMenuItem v-for="(item, index) in model" :key="item.label" :item="item" :index="index" />
        </ul>
    </nav>
</template>
