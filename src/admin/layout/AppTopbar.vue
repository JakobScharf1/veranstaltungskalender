<script setup lang="ts">
import { useLayout } from '@/admin/layout/composables/layout'
import { useAuthStore } from '@/store/auth'
import Popover from 'primevue/popover'
import { useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout()
const authStore = useAuthStore()
const router = useRouter()

const profilePopover = useTemplateRef<InstanceType<typeof Popover>>('profilePopover')

function toggleProfilePopover(event: Event): void {
    profilePopover.value?.toggle(event)
}

function openProfil(): void {
    profilePopover.value?.hide()
    void router.push({ name: 'profil' })
}

async function logout(): Promise<void> {
    await authStore.logout()
    void router.push('/')
}
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button type="button" class="layout-menu-button layout-topbar-action" aria-label="Menü umschalten" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <img src="/images/logo.png" alt="" class="h-11 w-auto" />
                <span class="text-lg">Veranstaltungsverwaltung</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" :aria-label="isDarkTheme ? 'Helles Design' : 'Dunkles Design'" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
            </div>

            <button
                type="button"
                aria-label="Weitere Aktionen"
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'p-anchored-overlay-enter-active', leaveToClass: 'hidden', leaveActiveClass: 'p-anchored-overlay-leave-active', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" aria-haspopup="true" @click="toggleProfilePopover">
                        <i class="pi pi-user"></i>
                        <span>Profil</span>
                    </button>

                    <Popover ref="profilePopover">
                        <div class="flex flex-col gap-3 p-2 w-48">
                            <div class="flex flex-col gap-1">
                                <span class="font-semibold text-sm">{{ authStore.user?.username }}</span>
                                <span class="text-xs text-surface-500">{{ authStore.isSuperadmin ? 'Superadmin' : authStore.isAdmin ? 'Admin' : 'Benutzer' }}</span>
                            </div>
                            <Button label="Mein Profil" icon="pi pi-user-edit" text size="small" @click="openProfil" />
                            <Button label="Logout" icon="pi pi-sign-out" severity="danger" text size="small" @click="logout" />
                        </div>
                    </Popover>
                </div>
            </div>
        </div>
    </div>
</template>
