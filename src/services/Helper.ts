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

        if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?(\.\d{3})?Z?)?$/.test(trimmed)) {
            const [datePart, timePart] = trimmed.split('T')
            const [year, month, day] = datePart.split('-').map(Number)
            const formattedDate = `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`

            if (!timePart) return formattedDate

            const time = timePart.slice(0, 5)
            return `${formattedDate} ${time}`
        }
    }

    const date = new Date(d)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
}

export function toUrlFriendly(text: string): string {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}
