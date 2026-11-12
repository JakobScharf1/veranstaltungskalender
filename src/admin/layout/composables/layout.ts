import type { LayoutConfig, LayoutState, MenuMode } from '@/types'
import { computed, reactive } from 'vue'

const DESKTOP_MIN_WIDTH_PX = 992

const layoutConfig = reactive<LayoutConfig>({
    preset: 'Aura',
    primary: 'emerald',
    surface: null,
    darkTheme: false,
    menuMode: 'static'
})

const layoutState = reactive<LayoutState>({
    staticMenuInactive: false,
    overlayMenuActive: false,
    mobileMenuActive: false,
    configSidebarVisible: false,
    sidebarExpanded: false,
    menuHoverActive: false,
    activePath: null
})

export function useLayout() {
    const isDarkTheme = computed(() => layoutConfig.darkTheme)
    const hasOpenOverlay = computed(() => layoutState.overlayMenuActive)

    function isDesktop(): boolean {
        return window.innerWidth >= DESKTOP_MIN_WIDTH_PX
    }

    function executeDarkModeToggle(): void {
        layoutConfig.darkTheme = !layoutConfig.darkTheme
        document.documentElement.classList.toggle('app-dark')
    }

    function toggleDarkMode(): void {
        // View Transitions werden nicht von allen (mobilen) Browsern unterstützt
        if (!document.startViewTransition) {
            executeDarkModeToggle()
            return
        }

        document.startViewTransition(executeDarkModeToggle)
    }

    function toggleMenu(): void {
        if (!isDesktop()) {
            layoutState.mobileMenuActive = !layoutState.mobileMenuActive
            return
        }

        if (layoutConfig.menuMode === 'static') {
            layoutState.staticMenuInactive = !layoutState.staticMenuInactive
        }

        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive
        }
    }

    function toggleConfigSidebar(): void {
        layoutState.configSidebarVisible = !layoutState.configSidebarVisible
    }

    function hideMobileMenu(): void {
        layoutState.mobileMenuActive = false
    }

    function changeMenuMode(menuMode: MenuMode): void {
        layoutConfig.menuMode = menuMode
        layoutState.staticMenuInactive = false
        layoutState.mobileMenuActive = false
        layoutState.sidebarExpanded = false
        layoutState.menuHoverActive = false
    }

    return {
        layoutConfig,
        layoutState,
        isDarkTheme,
        toggleDarkMode,
        toggleConfigSidebar,
        toggleMenu,
        hideMobileMenu,
        changeMenuMode,
        isDesktop,
        hasOpenOverlay
    }
}
