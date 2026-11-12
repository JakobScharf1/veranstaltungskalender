import type { ApiErrorBody, QueryParams } from '@/types'
import { ApiError } from './ApiError'
import { tokenStorage } from './tokenStorage'

const BASE_URL: string = import.meta.env.VITE_API_URL ?? 'https://events.brombeerland.org/api'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type RequestOptions = {
    params?: QueryParams
    body?: object
}

function buildUrl(path: string, params: QueryParams = {}): string {
    const url = new URL(BASE_URL + path)

    for (const [key, value] of Object.entries(params)) {
        const isEmpty = value === null || value === undefined || value === ''
        if (!isEmpty) {
            url.searchParams.set(key, String(value))
        }
    }

    return url.toString()
}

function buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }

    const token = tokenStorage.get()
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    return headers
}

/** Die API antwortet teils mit leerem Body – dann gibt es nichts zu parsen. */
function parseJson<T>(text: string): T | null {
    if (!text) return null
    return JSON.parse(text) as T
}

async function request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(buildUrl(path, options.params), {
        method,
        headers: buildHeaders(),
        body: options.body ? JSON.stringify(options.body) : undefined
    })

    const text = await response.text()

    if (!response.ok) {
        throw ApiError.fromBody(response.status, response.statusText, parseJson<ApiErrorBody>(text))
    }

    return parseJson<T>(text) as T
}

export const apiClient = {
    get<T>(path: string, params?: QueryParams): Promise<T> {
        return request<T>('GET', path, { params })
    },
    post<T = void>(path: string, body?: object, params?: QueryParams): Promise<T> {
        return request<T>('POST', path, { body, params })
    },
    put<T = void>(path: string, body: object): Promise<T> {
        return request<T>('PUT', path, { body })
    },
    delete<T = void>(path: string): Promise<T> {
        return request<T>('DELETE', path)
    }
}
