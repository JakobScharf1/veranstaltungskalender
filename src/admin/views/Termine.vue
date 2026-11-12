<script setup lang="ts">
import AdminListCard from '@/admin/components/common/AdminListCard.vue'
import RowActions from '@/admin/components/common/RowActions.vue'
import TerminDialog from '@/admin/components/termin/TerminDialog.vue'
import { desktopOnlyColumn, tableDefaults } from '@/admin/config/table'
import { useAdminFeedback } from '@/admin/composables/useAdminFeedback'
import { useEditDialog } from '@/admin/composables/useEditDialog'
import { toTerminCreatePayload, toTerminUpdatePayload } from '@/admin/forms/terminForm'
import { useTermineStore } from '@/store/resources'
import type { Termin, TerminForm } from '@/types'
import { formatTerminRange } from '@/utils/date'
import { onMounted, ref } from 'vue'

const termineStore = useTermineStore()
const { run, confirmDelete } = useAdminFeedback()
const { visible, selected, saving, openCreate, openEdit, save } = useEditDialog<Termin>()

const selectedTermine = ref<Termin[]>([])

onMounted(() => {
    void run(() => termineStore.load(true))
})

function terminBezeichnung(termin: Termin): string {
    return `${termin.veranstaltung.titel} (${formatTerminRange(termin)})`
}

function onSave(form: TerminForm): void {
    const item = selected.value
    const action = item ? () => termineStore.update(item.id, toTerminUpdatePayload(item.id, form)) : () => termineStore.create(toTerminCreatePayload(form))

    void save(() => run(action, 'Termin wurde gespeichert.'))
}

function onDelete(termin: Termin): void {
    confirmDelete(`Möchtest du den Termin „${terminBezeichnung(termin)}" wirklich löschen?`, () => termineStore.remove(termin.id), 'Termin wurde gelöscht.')
}

function onDeleteSelected(): void {
    const termine = selectedTermine.value

    async function deleteAll(): Promise<void> {
        await Promise.all(termine.map((termin) => termineStore.remove(termin.id)))
        selectedTermine.value = []
    }

    confirmDelete(`Möchtest du die ${termine.length} ausgewählten Termine wirklich löschen?`, deleteAll, 'Termine wurden gelöscht.')
}
</script>

<template>
    <AdminListCard titel="Termine" create-label="Neuer Termin" @create="openCreate">
        <Toolbar v-if="selectedTermine.length" class="mb-4">
            <template #start>
                <span class="font-medium">{{ selectedTermine.length }} ausgewählt</span>
            </template>
            <template #end>
                <Button label="Auswahl löschen" icon="pi pi-trash" severity="danger" outlined @click="onDeleteSelected" />
            </template>
        </Toolbar>

        <DataTable v-model:selection="selectedTermine" :value="termineStore.items" :loading="termineStore.loading" v-bind="tableDefaults">
            <template #empty>Keine Termine vorhanden.</template>

            <Column selection-mode="multiple" class="w-12" />

            <Column header="Datum">
                <template #body="{ data }: { data: Termin }">{{ formatTerminRange(data) }}</template>
            </Column>

            <Column header="Veranstaltung">
                <template #body="{ data }: { data: Termin }">
                    <div class="font-medium">{{ data.veranstaltung.titel }}</div>
                    <div class="text-sm text-muted-color">{{ data.veranstaltung.ort.bezeichnung }}, {{ data.veranstaltung.ort.adresse.ort }}</div>
                </template>
            </Column>

            <Column header="Kategorie" v-bind="desktopOnlyColumn">
                <template #body="{ data }: { data: Termin }">{{ data.veranstaltung.kategorie?.name ?? '–' }}</template>
            </Column>

            <Column header="Veranstalter" v-bind="desktopOnlyColumn">
                <template #body="{ data }: { data: Termin }">{{ data.veranstaltung.veranstalter?.bezeichnung ?? '–' }}</template>
            </Column>

            <Column class="w-0 whitespace-nowrap">
                <template #header><span class="sr-only">Aktionen</span></template>
                <template #body="{ data }: { data: Termin }">
                    <RowActions :bezeichnung="terminBezeichnung(data)" @edit="openEdit(data)" @delete="onDelete(data)" />
                </template>
            </Column>
        </DataTable>
    </AdminListCard>

    <TerminDialog v-model:visible="visible" :item="selected" :saving="saving" @save="onSave" />
</template>
