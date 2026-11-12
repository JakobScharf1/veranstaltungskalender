import { ref, type Ref } from 'vue'

/** Zustand eines Anlegen/Bearbeiten-Dialogs: Sichtbarkeit, gewählter Datensatz, Speicher-Status. */
export function useEditDialog<TEntity>() {
    const visible = ref(false)
    const selected = ref(null) as Ref<TEntity | null>
    const saving = ref(false)

    function openCreate(): void {
        selected.value = null
        visible.value = true
    }

    function openEdit(entity: TEntity): void {
        selected.value = entity
        visible.value = true
    }

    /** Schließt den Dialog nur, wenn die Aktion erfolgreich war. */
    async function save(action: () => Promise<boolean>): Promise<void> {
        saving.value = true
        try {
            const erfolgreich = await action()
            if (erfolgreich) visible.value = false
        } finally {
            saving.value = false
        }
    }

    return { visible, selected, saving, openCreate, openEdit, save }
}
