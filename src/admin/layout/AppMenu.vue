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
        ]
    },
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
