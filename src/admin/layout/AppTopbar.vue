<script setup>
import { useLayout } from '@/admin/layout/composables/layout'
import { useAuthStore } from '@/store/auth'
import { Popover } from 'primevue'
import { ref } from 'vue'

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout()
const authStore = useAuthStore()

const profilePopover = ref()

const toggleProfilePopover = (event) => {
    profilePopover.value?.toggle(event)
}

const logout = () => {
    authStore.logout()
}
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <img src="/images/logo.png" class="h-11 w-auto" />
                <span class="text-lg">Veranstaltungsverwaltung</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
            </div>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'p-anchored-overlay-enter-active', leaveToClass: 'hidden', leaveActiveClass: 'p-anchored-overlay-leave-active', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" @click="toggleProfilePopover">
                        <i class="pi pi-user"></i>
                        <span>Profil</span>
                    </button>

                    <Popover ref="profilePopover">
                        <div class="flex flex-col gap-3 p-2 w-48">
                            <div class="flex flex-col gap-1">
                                <span class="font-semibold text-sm">{{ authStore.username }}</span>
                                <span v-if="authStore.admin" class="text-xs text-surface-500">Admin</span>
                                <span v-else class="text-xs text-surface-500">Benutzer</span>
                            </div>
                            <Button label="Logout" icon="pi pi-sign-out" severity="danger" text size="small" @click="logout" />
                        </div>
                    </Popover>
                </div>
            </div>
        </div>
    </div>
</template>
