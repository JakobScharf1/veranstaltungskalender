<script setup lang="ts">
import AdminListCard from '@/admin/components/common/AdminListCard.vue'
import RowActions from '@/admin/components/common/RowActions.vue'
import EreignisDialog from '@/admin/components/ereignis/EreignisDialog.vue'
import TerminDialog from '@/admin/components/termin/TerminDialog.vue'
import { desktopOnlyColumn, tableDefaults } from '@/admin/config/table'
import { useAdminFeedback } from '@/admin/composables/useAdminFeedback'
import { useEditDialog } from '@/admin/composables/useEditDialog'
import { toTerminCreatePayload } from '@/admin/forms/terminForm'
import { useEreignisseStore, useTermineStore } from '@/store/resources'
import type { Ereignis, EreignisPayload, TerminForm } from '@/types'
import { onMounted } from 'vue'

const ereignisseStore = useEreignisseStore()
const termineStore = useTermineStore()
const { run, confirmDelete } = useAdminFeedback()

const {
    visible: ereignisDialogVisible,
    selected: selectedEreignis,
    saving: ereignisSaving,
    openCreate: openCreateEreignis,
    openEdit: openEditEreignis,
    save: saveEreignis
} = useEditDialog<Ereignis>()

// Schnellzugriff: Termin direkt aus der Veranstaltung heraus anlegen
const { visible: terminDialogVisible, selected: terminEreignis, saving: terminSaving, openEdit: openTerminFuer, save: saveTermin } = useEditDialog<Ereignis>()

onMounted(() => {
    void run(() => ereignisseStore.load(true))
})

function onSaveEreignis(payload: EreignisPayload): void {
    const item = selectedEreignis.value
    const action = item ? () => ereignisseStore.update(item.id, payload) : () => ereignisseStore.create(payload)

    void saveEreignis(() => run(action, 'Veranstaltung wurde gespeichert.'))
}

function onDeleteEreignis(item: Ereignis): void {
    confirmDelete(`Möchtest du die Veranstaltung „${item.titel}" wirklich löschen?`, () => ereignisseStore.remove(item.id), 'Veranstaltung wurde gelöscht.')
}

function onSaveTermin(form: TerminForm): void {
    void saveTermin(() => run(() => termineStore.create(toTerminCreatePayload(form)), 'Termin wurde angelegt.'))
}
</script>

<template>
    <AdminListCard titel="Veranstaltungen" create-label="Neue Veranstaltung" @create="openCreateEreignis">
        <DataTable :value="ereignisseStore.items" :loading="ereignisseStore.loading" v-bind="tableDefaults">
            <template #empty>Keine Veranstaltungen vorhanden.</template>

            <Column header="Titel">
                <template #body="{ data }: { data: Ereignis }">
                    <div class="font-medium">{{ data.titel }}</div>
                    <div v-if="data.untertitel" class="text-sm text-muted-color">{{ data.untertitel }}</div>
                </template>
            </Column>

            <Column header="Kategorie" v-bind="desktopOnlyColumn">
                <template #body="{ data }: { data: Ereignis }">{{ data.kategorie?.name ?? '–' }}</template>
            </Column>

            <Column header="Ort">
                <template #body="{ data }: { data: Ereignis }">{{ data.ort.bezeichnung }}, {{ data.ort.adresse.ort }}</template>
            </Column>

            <Column header="Veranstalter" v-bind="desktopOnlyColumn">
                <template #body="{ data }: { data: Ereignis }">{{ data.veranstalter?.bezeichnung ?? '–' }}</template>
            </Column>

            <Column header="Eintritt" v-bind="desktopOnlyColumn">
                <template #body="{ data }: { data: Ereignis }">
                    <Tag v-if="data.kostenlos" value="Frei" severity="success" />
                    <Tag v-else value="Kostenpflichtig" severity="secondary" />
                </template>
            </Column>

            <Column class="w-0 whitespace-nowrap">
                <template #header><span class="sr-only">Aktionen</span></template>
                <template #body="{ data }: { data: Ereignis }">
                    <RowActions :bezeichnung="data.titel" @edit="openEditEreignis(data)" @delete="onDeleteEreignis(data)">
                        <Button
                            v-tooltip.top="'Termin hinzufügen'"
                            icon="pi pi-calendar-plus"
                            outlined
                            rounded
                            severity="secondary"
                            :aria-label="`Termin für ${data.titel} hinzufügen`"
                            @click="openTerminFuer(data)"
                        />
                    </RowActions>
                </template>
            </Column>
        </DataTable>
    </AdminListCard>

    <EreignisDialog v-model:visible="ereignisDialogVisible" :item="selectedEreignis" :saving="ereignisSaving" @save="onSaveEreignis" />

    <TerminDialog v-model:visible="terminDialogVisible" :item="null" :veranstaltung-id="terminEreignis?.id ?? null" :saving="terminSaving" @save="onSaveTermin" />
</template>
