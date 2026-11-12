import type { InjectionKey, Ref } from 'vue'

/** Wird vom FrontendLayout bereitgestellt: `true` bei schmalen Displays. */
export const IS_MOBILE: InjectionKey<Ref<boolean>> = Symbol('isMobile')
