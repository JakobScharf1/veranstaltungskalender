import { ITermin } from "@/models/termin"
import { ApiService } from "./APIService"

export const TermineService = {
    getEvents(): ITermin[] {
        ApiService.get<ITermin[]>('/termine').then((response) => {
            console.log('API Response:', response)
            return response
        }).catch((error) => {
            console.error('API Error:', error)
            return []
        })
        return []
    },
    formatDateToString(date: Date): string {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
        return date.toLocaleDateString('de-DE', options)
    },
}
