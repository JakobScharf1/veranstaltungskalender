export function formatDate(d: Date | string): string {
    if (!d) return ''
    return String(new Date(d).toISOString().split('T')[0])
}

export function dateToString(d: Date | string): string {
    if (!d) return ''
    const date = new Date(d)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
}
