<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import { Popover } from 'primevue';
import { ref } from 'vue';
import { LoginService } from '@/service/LoginService';

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const authStore = useAuthStore();
const router = useRouter();

const profilePopover = ref()

const toggleProfilePopover = (event) => {
    profilePopover.value?.toggle(event)
}

const logout = () => {
    LoginService.logout()
}
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <img src="/public/images/logo.png" class="h-11 w-auto" />
                <span class="text-lg">Terminverwaltung</span>
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
                                <span class="text-xs text-surface-500">{{ authStore.role }}</span>
                            </div>
                            <Button label="Logout" icon="pi pi-sign-out" severity="danger" text size="small" @click="logout" />
                        </div>
                    </Popover>
                </div>
            </div>
        </div>
    </div>
</template>
