import type { Kategorie } from './kategorie'
import type { Ort } from './ort'
import type { Veranstalter } from './veranstalter'

/**
 * „Ereignis" heißt in der Oberfläche „Veranstaltung".
 * Ein Ereignis bündelt die inhaltlichen Daten, die zugehörigen Termine verweisen darauf.
 */
export type Ereignis = {
    id: number
    ort: Ort
    veranstalter?: Veranstalter | null
    titel: string
    untertitel?: string | null
    /** Laut Doku Pflicht, die API liefert für Altdaten aber teilweise `null`. */
    kategorie: Kategorie | null
    /** Langtext */
    info?: string | null
    kostenlos: boolean
    /** URL */
    web?: string | null
    /** URL */
    facebook?: string | null
    /** URL */
    insta?: string | null
    picture1?: string | null
    /** Laut Doku Pflicht, die API liefert teilweise `null`. */
    picture2: string | null
}

/** Body für POST /ereignisse und PUT /ereignisse/{id}. Relationen werden als IDs übergeben. */
export type EreignisPayload = {
    titel: string
    untertitel?: string
    ort: number
    veranstalter: number
    kategorie: number
    kostenlos: boolean
    info?: string
    web?: string
    facebook?: string
    insta?: string
    picture1?: string
    /** Bei PUT Pflicht */
    picture2: string
}
