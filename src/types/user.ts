export type User = {
    username: string
    email: string
    vorname?: string | null
    nachname?: string | null
    partner_id: number
    admin: boolean
}

/** Body für POST /users (nur Superadmin) */
export type UserCreatePayload = {
    username: string
    email: string
    vorname?: string
    nachname?: string
    partner_id: number
    admin: boolean
    /** Mindestens 8 Zeichen */
    password: string
}
