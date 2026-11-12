export type QueryValue = string | number | boolean | null | undefined

export type QueryParams = Record<string, QueryValue>

/** Fehlerformat des Backends (Laravel) */
export type ApiErrorBody = {
    message?: string
    errors?: Record<string, string[]>
}

/** Einheitliche Schnittstelle der CRUD-Stores, damit Komponenten sie generisch nutzen können. */
export type ResourceStore<TEntity, TCreate, TUpdate = TCreate> = {
    items: TEntity[]
    loading: boolean
    load: (force?: boolean) => Promise<void>
    create: (payload: TCreate) => Promise<void>
    update: (id: number, payload: TUpdate) => Promise<void>
    remove: (id: number) => Promise<void>
}
