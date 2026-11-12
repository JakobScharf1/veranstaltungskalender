import type { CurrentUser, FormErrors, PasswortForm, PasswortPayload, ProfilForm, ProfilPayload } from '@/types'
import { isBlank, isValidEmail, MIN_PASSWORT_LAENGE, PFLICHTFELD } from './validation'

export function createProfilForm(user: CurrentUser | null): ProfilForm {
    return {
        vorname: user?.vorname ?? '',
        nachname: user?.nachname ?? '',
        email: user?.email ?? '',
        organisation: user?.organisation ?? '',
        weblink: user?.weblink ?? '',
        linktext: user?.linktext ?? '',
        position: user?.position ?? null
    }
}

export function validateProfilForm(form: ProfilForm): FormErrors<ProfilForm> {
    return isValidEmail(form.email) ? {} : { email: 'Bitte eine gültige E-Mail-Adresse eingeben.' }
}

/**
 * Die E-Mail wird nur mitgeschickt, wenn sie sich geändert hat,
 * da eine Änderung eine neue Verifizierung auslöst.
 */
export function toProfilPayload(form: ProfilForm, aktuelleEmail: string): ProfilPayload {
    const { email, position, ...rest } = form
    const payload: ProfilPayload = { ...rest, position: position ?? undefined }

    if (email.trim() !== aktuelleEmail) {
        payload.email = email.trim()
    }

    return payload
}

export function createPasswortForm(): PasswortForm {
    return { current_password: '', password: '', password_confirmation: '' }
}

export function validatePasswortForm(form: PasswortForm): FormErrors<PasswortForm> {
    const errors: FormErrors<PasswortForm> = {}
    if (isBlank(form.current_password)) errors.current_password = PFLICHTFELD
    if (form.password.length < MIN_PASSWORT_LAENGE) errors.password = `Mindestens ${MIN_PASSWORT_LAENGE} Zeichen.`
    if (form.password !== form.password_confirmation) errors.password_confirmation = 'Die Passwörter stimmen nicht überein.'
    return errors
}

export function toPasswortPayload(form: PasswortForm): PasswortPayload {
    return { current_password: form.current_password, password: form.password }
}
