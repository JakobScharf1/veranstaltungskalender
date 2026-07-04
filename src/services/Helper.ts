export function formatDate(d: Date | string): string {
    if (!d) return ''

    if (typeof d === 'string') {
        const trimmed = d.trim()
        if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(trimmed)) {
            const [day, month, year] = trimmed.split('.').map(Number)
            return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        }
    }

    const date = new Date(d)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function dateToString(d: Date | string): string {
    if (!d) return ''

    if (typeof d === 'string') {
        const trimmed = d.trim()
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(trimmed)) return trimmed
        if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
            const [year, month, day] = trimmed.split('-').map(Number)
            return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`
        }
    }

    const date = new Date(d)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
}
