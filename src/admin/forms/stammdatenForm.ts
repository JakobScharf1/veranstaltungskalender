import type { FormErrors, Stammdaten, StammdatenForm, StammdatenPayload } from '@/types'
import { isBlank, PFLICHTFELD } from './validation'

export type StammdatenFormErrors = FormErrors<StammdatenForm> & { adresseOrt?: string }

export function createStammdatenForm(item: Stammdaten | null): StammdatenForm {
    return {
        bezeichnung: item?.bezeichnung ?? '',
        bezeichnung_alternativ: item?.bezeichnung_alternativ ?? '',
        info: item?.info ?? '',
        // Bild-Upload folgt – bestehender Wert wird beim Speichern unverändert übernommen
        picture: item?.picture ?? '',
        tel: item?.tel ?? '',
        email: item?.email ?? '',
        home: item?.home ?? '',
        facebook: item?.facebook ?? '',
        insta: item?.insta ?? '',
        adresse: {
            strasse: item?.adresse.strasse ?? '',
            plz: item?.adresse.plz ?? '',
            ort: item?.adresse.ort ?? ''
        }
    }
}

export function validateStammdatenForm(form: StammdatenForm): StammdatenFormErrors {
    const errors: StammdatenFormErrors = {}
    if (isBlank(form.bezeichnung)) errors.bezeichnung = PFLICHTFELD
    if (isBlank(form.adresse.ort)) errors.adresseOrt = PFLICHTFELD
    return errors
}

export function toStammdatenPayload(form: StammdatenForm): StammdatenPayload {
    return {
        ...form,
        bezeichnung: form.bezeichnung.trim(),
        adresse: { ...form.adresse, ort: form.adresse.ort.trim() }
    }
}
