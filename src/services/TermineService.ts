import { ITermin } from "@/models/termin"
import { ApiService } from "./APIService"
import { dateToString } from "./Helper"

export const TermineService = {
    async getEvents(): Promise<ITermin[]> {
        try {
            return await ApiService.get<ITermin[]>('/termine')
        } catch (error) {
            console.error('API Error:', error)
            return []
        }
    },
    formatDateToString(date: Date | string | null | undefined): string {
        if (!date) return ''
        return dateToString(date)
    },
}
