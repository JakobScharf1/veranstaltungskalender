import type { Ereignis } from './ereignis'

/** Datum mit optionaler Uhrzeit im Format `2002-03-09T12:00` */
export type ApiDateTime = string

export type Termin = {
    id: number
    veranstaltung: Ereignis
    start: ApiDateTime
    ende?: ApiDateTime | null
    allday: boolean
    /** Langtext */
    info?: string | null
}

/** Body für POST /termine */
export type TerminCreatePayload = {
    /** ID des Ereignisses */
    veranstaltung: number
    start: ApiDateTime
    ende?: ApiDateTime
    allday: boolean
    info?: string
    /** URL */
    picture1?: string
    /** URL */
    picture2?: string
}

/** Body für PUT /termine/{id} – hier sind `id` und `ende` Pflicht. */
export type TerminUpdatePayload = TerminCreatePayload & {
    id: number
    ende: ApiDateTime
}

/** Query-Parameter für GET /termine */
export type TerminQuery = {
    start?: ApiDateTime
    ende?: ApiDateTime
    kategorie?: string
    veranstalter?: number
    veranstaltungsort?: number
    /** Stadt (Freitext) */
    ort?: string
    titel?: string
    /** ID des Ereignisses */
    veranstaltung?: number
}
