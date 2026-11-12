import type { CurrentUser, LoginResponse, PasswortPayload, ProfilPayload, VerificationRequest } from '@/types'
import { apiClient } from './api/client'

export const authService = {
    login: (username: string, password: string): Promise<LoginResponse> => apiClient.post<LoginResponse>('/login', undefined, { username, password }),

    logout: (): Promise<void> => apiClient.post('/logout'),

    getMe: (): Promise<CurrentUser> => apiClient.get<CurrentUser>('/me'),

    updateMe: (payload: ProfilPayload | PasswortPayload): Promise<void> => apiClient.put('/me', payload),

    sendVerificationMail: (request: VerificationRequest): Promise<void> => apiClient.post('/email/verification-notification', undefined, request)
}
