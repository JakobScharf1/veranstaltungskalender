<script setup>
import { useAuthStore } from '@/store/auth.ts'
import { ref, watch } from 'vue'
import AppMenuItem from './AppMenuItem.vue'

const auth = useAuthStore()

const model = ref([
    {
        label: 'Verwaltung',
        items: [
            {
                label: 'Termine',
                icon: 'pi pi-fw pi-calendar',
                to: '/mgmt/termine'
            },
            {
                label: 'Orte',
                icon: 'pi pi-fw pi-map',
                to: '/mgmt/orte'
            }
        ]
    }
])

watch(
    () => auth.admin,
    (isAdmin) => {
        const rootItems = model.value[0]?.items ?? []
        const hasVeranstalter = rootItems.some((item) => item.to === '/mgmt/veranstalter')

        if (isAdmin && !hasVeranstalter) {
            rootItems.push({
                label: 'Veranstalter',
                icon: 'pi pi-fw pi-users',
                to: '/mgmt/veranstalter'
            })
        } else if (!isAdmin && hasVeranstalter) {
            const index = rootItems.findIndex((item) => item.to === '/mgmt/veranstalter')
            if (index >= 0) {
                rootItems.splice(index, 1)
            }
        }
    },
    { immediate: true }
)
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
