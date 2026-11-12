import type { Ort } from './ort'
import type { Veranstalter } from './veranstalter'

export type Partner = {
    id: number
    name: string
    veranstalter: Veranstalter[]
    orte: Ort[]
}

export type PartnerCreatePayload = {
    name: string
}

/** Body für PUT /partner/{id}. Zuordnungen werden als ID-Listen übergeben. */
export type PartnerUpdatePayload = {
    name: string
    veranstalter: number[]
    orte: number[]
}
