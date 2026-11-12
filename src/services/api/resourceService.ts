import type { QueryParams } from '@/types'
import { apiClient } from './client'

export type ResourceService<TEntity, TCreate, TUpdate = TCreate, TQuery extends QueryParams = QueryParams> = {
    getAll: (query?: TQuery) => Promise<TEntity[]>
    getById: (id: number) => Promise<TEntity>
    create: (payload: TCreate) => Promise<void>
    update: (id: number, payload: TUpdate) => Promise<void>
    remove: (id: number) => Promise<void>
}

/**
 * Erzeugt die Standard-CRUD-Aufrufe für einen REST-Endpunkt.
 * @param path Collection-Pfad, z. B. `/orte` – Einzelaufrufe nutzen `/orte/{id}`
 */
export function createResourceService<TEntity, TCreate extends object, TUpdate extends object = TCreate, TQuery extends QueryParams = QueryParams>(
    path: string
): ResourceService<TEntity, TCreate, TUpdate, TQuery> {
    return {
        getAll: (query) => apiClient.get<TEntity[]>(path, query),
        getById: (id) => apiClient.get<TEntity>(`${path}/${id}`),
        create: (payload) => apiClient.post(path, payload),
        update: (id, payload) => apiClient.put(`${path}/${id}`, payload),
        remove: (id) => apiClient.delete(`${path}/${id}`)
    }
}
