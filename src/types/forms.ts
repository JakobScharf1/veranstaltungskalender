import type { ProfilPosition } from './auth'

/** Formularzustände der Verwaltung. Alle Textfelder sind Strings, damit Inputs direkt gebunden werden können. */

export type StammdatenForm = {
    bezeichnung: string
    bezeichnung_alternativ: string
    info: string
    picture: string
    tel: string
    email: string
    home: string
    facebook: string
    insta: string
    adresse: {
        strasse: string
        plz: string
        ort: string
    }
}

export type EreignisForm = {
    titel: string
    untertitel: string
    ort: number | null
    veranstalter: number | null
    kategorie: number | null
    kostenlos: boolean
    info: string
    web: string
    facebook: string
    insta: string
    picture1: string
    picture2: string
}

export type TerminForm = {
    veranstaltung: number | null
    start: Date | null
    ende: Date | null
    allday: boolean
    info: string
}

export type KategorieForm = {
    name: string
}

export type PartnerForm = {
    name: string
    veranstalter: number[]
    orte: number[]
}

export type UserForm = {
    username: string
    email: string
    vorname: string
    nachname: string
    admin: boolean
    password: string
}

export type ProfilForm = {
    vorname: string
    nachname: string
    email: string
    organisation: string
    weblink: string
    linktext: string
    position: ProfilPosition | null
}

export type PasswortForm = {
    current_password: string
    password: string
    password_confirmation: string
}

/** Fehlermeldungen je Formularfeld */
export type FormErrors<TForm> = Partial<Record<keyof TForm, string>>

/** Option für Select/MultiSelect */
export type SelectOption<TValue = number> = {
    label: string
    value: TValue
}
