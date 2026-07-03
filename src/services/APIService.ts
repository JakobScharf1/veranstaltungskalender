import { useAuthStore } from '@/store/auth'

const BASE_URL = 'https://api.wannefredder.de'

type RequestOptions = {
  params?: Record<string, string | number | boolean | null | undefined>
  headers?: Record<string, string>
  useAuthToken?: boolean
}

type ApiResponse<T> = {
  data: T
}

class ApiError extends Error {
  constructor(public status: number, public statusText: string, message?: string) {
    super(message ?? `${status} ${statusText}`)
    this.name = 'ApiError'
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const url = new URL(BASE_URL + path)

  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== null && value !== undefined && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const authStore = useAuthStore()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (options.useAuthToken && authStore.token) {
    headers.Authorization = `Bearer ${authStore.token}`
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status !== 200 && response.status !== 201 && response.status !== 204) {
    throw new ApiError(response.status, response.statusText)
  }

  // 204 No Content
  if (response.status === 204) return undefined as T

  return response.json() as Promise<T>
}

export const ApiService = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>('GET', path, undefined, options)
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('POST', path, body, options)
  },

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('PUT', path, body, options)
  },

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('PATCH', path, body, options)
  },

  delete<T = void>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>('DELETE', path, undefined, options)
  },
}

export { ApiError }
export type { ApiResponse }
