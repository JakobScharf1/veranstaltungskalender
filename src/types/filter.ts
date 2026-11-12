/** Filter, die Besucher im öffentlichen Kalender setzen können. */
export type TerminFilter = {
    titel?: string
    /** Stadt */
    ort?: string
    /** Kategorie-ID */
    kategorie?: number
    /** Wird clientseitig gefiltert – die API bietet keinen Parameter dafür. */
    kostenlos?: boolean
}

export type TerminFilterKey = keyof TerminFilter

export type FilterOption = {
    key: TerminFilterKey
    label: string
    icon: string
    type: 'text' | 'select' | 'toggle'
    placeholder?: string
}
