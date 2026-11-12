import type {
    Ereignis,
    EreignisPayload,
    Kategorie,
    KategoriePayload,
    Ort,
    OrtPayload,
    Partner,
    PartnerCreatePayload,
    PartnerUpdatePayload,
    Termin,
    TerminCreatePayload,
    TerminQuery,
    TerminUpdatePayload,
    UserCreatePayload,
    Veranstalter,
    VeranstalterPayload
} from '@/types'
import { apiClient } from './api/client'
import { createResourceService } from './api/resourceService'

export const ortService = createResourceService<Ort, OrtPayload>('/orte')

export const veranstalterService = createResourceService<Veranstalter, VeranstalterPayload>('/veranstalter')

export const kategorieService = createResourceService<Kategorie, KategoriePayload>('/kategorien')

export const ereignisService = createResourceService<Ereignis, EreignisPayload>('/ereignisse')

export const terminService = createResourceService<Termin, TerminCreatePayload, TerminUpdatePayload, TerminQuery>('/termine')

// Für Partner ist kein DELETE dokumentiert.
const partnerResource = createResourceService<Partner, PartnerCreatePayload, PartnerUpdatePayload>('/partner')

export const partnerService = {
    getAll: partnerResource.getAll,
    getById: partnerResource.getById,
    create: partnerResource.create,
    update: partnerResource.update
}

export const userService = {
    create: (payload: UserCreatePayload): Promise<void> => apiClient.post('/users', payload)
}
