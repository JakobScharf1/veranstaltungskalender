import type { FormErrors, Termin, TerminCreatePayload, TerminForm, TerminUpdatePayload } from '@/types'
import { parseApiDateTime, toApiDateTime } from '@/utils/date'
import { PFLICHTFELD } from './validation'

export function createTerminForm(item: Termin | null, veranstaltungId: number | null = null): TerminForm {
    return {
        veranstaltung: item?.veranstaltung.id ?? veranstaltungId,
        start: item ? parseApiDateTime(item.start) : null,
        ende: item?.ende ? parseApiDateTime(item.ende) : null,
        allday: item?.allday ?? false,
        info: item?.info ?? ''
    }
}

/** @param isEdit Beim Bearbeiten (PUT) ist `ende` laut API Pflicht. */
export function validateTerminForm(form: TerminForm, isEdit: boolean): FormErrors<TerminForm> {
    const errors: FormErrors<TerminForm> = {}
    if (form.veranstaltung === null) errors.veranstaltung = PFLICHTFELD
    if (form.start === null) errors.start = PFLICHTFELD
    if (isEdit && form.ende === null) errors.ende = PFLICHTFELD
    if (form.start && form.ende && form.ende < form.start) errors.ende = 'Das Ende darf nicht vor dem Start liegen.'
    return errors
}

/** Bei ganztägigen Terminen ist die (ausgeblendete) Uhrzeit irrelevant → auf 00:00 setzen. */
function normalizeDate(date: Date, allday: boolean): Date {
    if (!allday) return date
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function toTerminCreatePayload(form: TerminForm): TerminCreatePayload {
    if (form.veranstaltung === null || form.start === null) {
        throw new Error('Formular ist unvollständig.')
    }

    return {
        veranstaltung: form.veranstaltung,
        start: toApiDateTime(normalizeDate(form.start, form.allday)),
        ende: form.ende ? toApiDateTime(normalizeDate(form.ende, form.allday)) : undefined,
        allday: form.allday,
        info: form.info
    }
}

/** Darf erst nach erfolgreicher Validierung (mit `isEdit = true`) aufgerufen werden. */
export function toTerminUpdatePayload(id: number, form: TerminForm): TerminUpdatePayload {
    const { ende, ...payload } = toTerminCreatePayload(form)

    if (!ende) {
        throw new Error('Formular ist unvollständig.')
    }

    return { ...payload, id, ende }
}
