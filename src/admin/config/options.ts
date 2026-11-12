import type { Ereignis, ProfilPosition, SelectOption, Stammdaten } from '@/types'

export function toStammdatenOption(item: Stammdaten): SelectOption {
    return { label: `${item.bezeichnung} (${item.adresse.ort})`, value: item.id }
}

export function toEreignisOption(item: Ereignis): SelectOption {
    return { label: `${item.titel} – ${item.ort.bezeichnung}`, value: item.id }
}

export const positionOptions: SelectOption<ProfilPosition>[] = [
    { label: 'Links', value: 'left' },
    { label: 'Mitte', value: 'center' },
    { label: 'Rechts', value: 'right' }
]
