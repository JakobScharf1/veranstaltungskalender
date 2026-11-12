export const PFLICHTFELD = 'Dieses Feld ist verpflichtend.'
export const MIN_PASSWORT_LAENGE = 8

export function isBlank(value: string): boolean {
    return value.trim() === ''
}

export function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function hasErrors<TErrors extends object>(errors: TErrors): boolean {
    return Object.keys(errors).length > 0
}
