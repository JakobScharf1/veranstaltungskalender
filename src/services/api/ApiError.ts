import type { ApiErrorBody } from '@/types'

export class ApiError extends Error {
    readonly status: number
    readonly fieldErrors: Record<string, string[]>

    constructor(status: number, message: string, fieldErrors: Record<string, string[]> = {}) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.fieldErrors = fieldErrors
    }

    static fromBody(status: number, statusText: string, body: ApiErrorBody | null): ApiError {
        const message = body?.message || `${status} ${statusText}`
        return new ApiError(status, message, body?.errors ?? {})
    }
}
