import type { Adresse } from './adresse'

/**
 * Gemeinsame Felder von Ort und Veranstalter (laut API identisch aufgebaut).
 * Optionale Felder liefert die API teilweise als `null`.
 */
export type StammdatenPayload = {
    bezeichnung: string
    bezeichnung_alternativ?: string | null
    /** Langtext */
    info?: string | null
    /** URL */
    picture?: string | null
    tel?: string | null
    email?: string | null
    /** URL */
    home?: string | null
    /** URL */
    facebook?: string | null
    /** URL */
    insta?: string | null
    adresse: Adresse
}

export type Stammdaten = StammdatenPayload & {
    id: number
}
