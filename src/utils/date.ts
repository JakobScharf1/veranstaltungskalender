import type { ApiDateTime, Termin } from '@/types'

function pad(value: number): string {
    return String(value).padStart(2, '0')
}

/** Date → `2002-03-09T12:00` (lokale Zeit, wie von der API erwartet) */
export function toApiDateTime(date: Date): ApiDateTime {
    const datum = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    const zeit = `${pad(date.getHours())}:${pad(date.getMinutes())}`
    return `${datum}T${zeit}`
}

/** `2002-03-09T12:00[:00]` → Date (ohne Zeitzone wird lokal interpretiert) */
export function parseApiDateTime(value: ApiDateTime): Date {
    return new Date(value)
}

/** Schlüssel `YYYY-MM-DD` für Tagesvergleiche */
export function toDateKey(value: Date | ApiDateTime): string {
    if (typeof value === 'string') {
        return value.slice(0, 10)
    }
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`
}

/** Erster Tag 00:00 bis letzter Tag 23:59 des Monats */
export function getMonthRange(year: number, month: number): { start: ApiDateTime; ende: ApiDateTime } {
    const start = new Date(year, month, 1, 0, 0)
    const ende = new Date(year, month + 1, 0, 23, 59)
    return { start: toApiDateTime(start), ende: toApiDateTime(ende) }
}

export function formatDate(value: ApiDateTime): string {
    return parseApiDateTime(value).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatTime(value: ApiDateTime): string {
    return parseApiDateTime(value).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

/** Lesbarer Zeitraum eines Termins, z. B. „11.11.2026 · 12:00 – 20:30" */
export function formatTerminRange(termin: Pick<Termin, 'start' | 'ende' | 'allday'>): string {
    const startDatum = formatDate(termin.start)
    const endDatum = termin.ende ? formatDate(termin.ende) : startDatum
    const istEintaegig = startDatum === endDatum

    if (termin.allday) {
        return istEintaegig ? `${startDatum} · Ganztägig` : `${startDatum} – ${endDatum} · Ganztägig`
    }

    const startZeit = formatTime(termin.start)

    if (!termin.ende) {
        return `${startDatum} · ${startZeit}`
    }

    const endZeit = formatTime(termin.ende)

    if (istEintaegig) {
        return `${startDatum} · ${startZeit} – ${endZeit}`
    }

    return `${startDatum} ${startZeit} – ${endDatum} ${endZeit}`
}
