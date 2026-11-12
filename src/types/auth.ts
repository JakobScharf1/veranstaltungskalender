import type { User } from './user'

/** Rollen in aufsteigender Berechtigung */
export type Rolle = 'user' | 'admin' | 'superadmin'

export type ProfilPosition = 'left' | 'center' | 'right'

/** Antwort von POST /login (in der Doku nicht spezifiziert) */
export type LoginResponse = {
    token: string
}

/**
 * Antwort von GET /me (in der Doku nicht spezifiziert).
 * Felder abgeleitet aus dem User-Schema und PUT /me.
 */
export type CurrentUser = User & {
    organisation?: string | null
    weblink?: string | null
    linktext?: string | null
    position?: ProfilPosition | null
    /** ANNAHME: Kennzeichnung des Superadmins – in der Doku nicht beschrieben. */
    superadmin?: boolean
}

/** Profildaten für PUT /me */
export type ProfilPayload = {
    email?: string
    vorname?: string
    nachname?: string
    organisation?: string
    weblink?: string
    linktext?: string
    position?: ProfilPosition
}

/** Passwortänderung über PUT /me – `current_password` ist Pflicht. */
export type PasswortPayload = {
    current_password: string
    password: string
}

/** Query-Parameter für POST /email/verification-notification (E-Mail ODER Benutzername) */
export type VerificationRequest = { email: string } | { username: string }
