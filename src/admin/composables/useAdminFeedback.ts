import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const ERFOLG_DAUER_MS = 3000
const FEHLER_DAUER_MS = 6000
const FEHLER_FALLBACK = 'Ein unbekannter Fehler ist aufgetreten.'

/** Einheitliche Rückmeldungen (Toasts, Lösch-Bestätigung) für API-Aktionen in der Verwaltung. */
export function useAdminFeedback() {
    const toast = useToast()
    const confirm = useConfirm()

    /**
     * Führt eine Aktion aus und meldet Erfolg bzw. Fehler.
     * Ohne `erfolgsMeldung` werden nur Fehler angezeigt (z. B. beim Laden).
     */
    async function run(action: () => Promise<void>, erfolgsMeldung?: string): Promise<boolean> {
        try {
            await action()
            if (erfolgsMeldung) {
                toast.add({ severity: 'success', summary: 'Erfolgreich', detail: erfolgsMeldung, life: ERFOLG_DAUER_MS })
            }
            return true
        } catch (error) {
            const detail = error instanceof Error && error.message ? error.message : FEHLER_FALLBACK
            toast.add({ severity: 'error', summary: 'Fehler', detail, life: FEHLER_DAUER_MS })
            return false
        }
    }

    function confirmDelete(frage: string, onDelete: () => Promise<void>, erfolgsMeldung: string): void {
        confirm.require({
            header: 'Löschen bestätigen',
            message: frage,
            icon: 'pi pi-exclamation-triangle',
            rejectProps: { label: 'Abbrechen', severity: 'secondary', text: true },
            acceptProps: { label: 'Löschen', severity: 'danger', icon: 'pi pi-trash' },
            accept: () => {
                void run(onDelete, erfolgsMeldung)
            }
        })
    }

    return { run, confirmDelete }
}
