import { ereignisService, kategorieService, ortService, terminService, veranstalterService } from '@/services/resources'
import type { Ereignis, EreignisPayload, Kategorie, KategoriePayload, Ort, OrtPayload, Termin, TerminCreatePayload, TerminUpdatePayload, Veranstalter, VeranstalterPayload } from '@/types'
import { createResourceStore } from './createResourceStore'

export const useOrteStore = createResourceStore<Ort, OrtPayload>('orte', ortService)

export const useVeranstalterStore = createResourceStore<Veranstalter, VeranstalterPayload>('veranstalter', veranstalterService)

export const useKategorienStore = createResourceStore<Kategorie, KategoriePayload>('kategorien', kategorieService)

/** „Ereignisse" der API = „Veranstaltungen" in der Oberfläche */
export const useEreignisseStore = createResourceStore<Ereignis, EreignisPayload>('ereignisse', ereignisService)

export const useTermineStore = createResourceStore<Termin, TerminCreatePayload, TerminUpdatePayload>('termine', terminService)
