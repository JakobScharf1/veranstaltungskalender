import 'vue-router'
import type { Rolle } from './auth'

declare module 'vue-router' {
    interface RouteMeta {
        /** Mindestrolle für den Zugriff. Ohne Angabe genügt ein Login. */
        rolle?: Rolle
    }
}
