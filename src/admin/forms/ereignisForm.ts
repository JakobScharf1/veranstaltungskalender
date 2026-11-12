import type { Ereignis, EreignisForm, EreignisPayload, FormErrors } from '@/types'
import { isBlank, PFLICHTFELD } from './validation'

export function createEreignisForm(item: Ereignis | null): EreignisForm {
    return {
        titel: item?.titel ?? '',
        untertitel: item?.untertitel ?? '',
        ort: item?.ort.id ?? null,
        veranstalter: item?.veranstalter?.id ?? null,
        kategorie: item?.kategorie?.id ?? null,
        // Die API liefert `kostenlos` teils als 0/1
        kostenlos: Boolean(item?.kostenlos),
        info: item?.info ?? '',
        web: item?.web ?? '',
        facebook: item?.facebook ?? '',
        insta: item?.insta ?? '',
        // Bild-Upload folgt – bestehende Werte werden beim Speichern unverändert übernommen
        picture1: item?.picture1 ?? '',
        picture2: item?.picture2 ?? ''
    }
}

export function validateEreignisForm(form: EreignisForm): FormErrors<EreignisForm> {
    const errors: FormErrors<EreignisForm> = {}
    if (isBlank(form.titel)) errors.titel = PFLICHTFELD
    if (form.ort === null) errors.ort = PFLICHTFELD
    if (form.veranstalter === null) errors.veranstalter = PFLICHTFELD
    if (form.kategorie === null) errors.kategorie = PFLICHTFELD
    return errors
}

/** Darf erst nach erfolgreicher Validierung aufgerufen werden. */
export function toEreignisPayload(form: EreignisForm): EreignisPayload {
    if (form.ort === null || form.veranstalter === null || form.kategorie === null) {
        throw new Error('Formular ist unvollständig.')
    }

    return {
        ...form,
        titel: form.titel.trim(),
        ort: form.ort,
        veranstalter: form.veranstalter,
        kategorie: form.kategorie
    }
}
