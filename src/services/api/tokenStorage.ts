const TOKEN_KEY = 'token'

/** Kapselt den Zugriff auf das Bearer-Token, damit der HTTP-Client nicht vom Auth-Store abhängt. */
export const tokenStorage = {
    get(): string | null {
        return localStorage.getItem(TOKEN_KEY)
    },
    set(token: string): void {
        localStorage.setItem(TOKEN_KEY, token)
    },
    clear(): void {
        localStorage.removeItem(TOKEN_KEY)
    }
}
