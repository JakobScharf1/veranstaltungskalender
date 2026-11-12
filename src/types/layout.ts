export type MenuMode = 'static' | 'overlay'

export type LayoutConfig = {
    preset: string
    primary: string
    surface: string | null
    darkTheme: boolean
    menuMode: MenuMode
}

export type LayoutState = {
    staticMenuInactive: boolean
    overlayMenuActive: boolean
    mobileMenuActive: boolean
    configSidebarVisible: boolean
    sidebarExpanded: boolean
    menuHoverActive: boolean
    activePath: string | null
}
