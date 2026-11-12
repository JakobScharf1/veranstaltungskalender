import type { FormErrors, Partner, PartnerForm, PartnerUpdatePayload, UserCreatePayload, UserForm } from '@/types'
import { isBlank, isValidEmail, MIN_PASSWORT_LAENGE, PFLICHTFELD } from './validation'

export function createPartnerForm(item: Partner | null): PartnerForm {
    return {
        name: item?.name ?? '',
        veranstalter: item?.veranstalter.map((v) => v.id) ?? [],
        orte: item?.orte.map((o) => o.id) ?? []
    }
}

export function validatePartnerForm(form: PartnerForm): FormErrors<PartnerForm> {
    return isBlank(form.name) ? { name: PFLICHTFELD } : {}
}

export function toPartnerPayload(form: PartnerForm): PartnerUpdatePayload {
    return { ...form, name: form.name.trim() }
}

export function createUserForm(): UserForm {
    return { username: '', email: '', vorname: '', nachname: '', admin: false, password: '' }
}

export function validateUserForm(form: UserForm): FormErrors<UserForm> {
    const errors: FormErrors<UserForm> = {}
    if (isBlank(form.username)) errors.username = PFLICHTFELD
    if (!isValidEmail(form.email)) errors.email = 'Bitte eine gültige E-Mail-Adresse eingeben.'
    if (form.password.length < MIN_PASSWORT_LAENGE) errors.password = `Mindestens ${MIN_PASSWORT_LAENGE} Zeichen.`
    return errors
}

export function toUserPayload(form: UserForm, partnerId: number): UserCreatePayload {
    return {
        ...form,
        username: form.username.trim(),
        email: form.email.trim(),
        partner_id: partnerId
    }
}
