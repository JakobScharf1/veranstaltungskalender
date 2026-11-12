<script setup lang="ts">
import AdminListCard from '@/admin/components/common/AdminListCard.vue'
import RowActions from '@/admin/components/common/RowActions.vue'
import { desktopOnlyColumn, tableDefaults } from '@/admin/config/table'
import { useAdminFeedback } from '@/admin/composables/useAdminFeedback'
import { useEditDialog } from '@/admin/composables/useEditDialog'
import type { ResourceStore, Stammdaten, StammdatenPayload } from '@/types'
import { onMounted } from 'vue'
import StammdatenDialog from './StammdatenDialog.vue'

/** Listen-Verwaltung für Orte und Veranstalter. */
const props = defineProps<{
    store: ResourceStore<Stammdaten, StammdatenPayload>
    /** Mehrzahl, z. B. „Orte" */
    titel: string
    /** Einzahl, z. B. „Ort" */
    einzahl: string
}>()

const { run, confirmDelete } = useAdminFeedback()
const { visible, selected, saving, openCreate, openEdit, save } = useEditDialog<Stammdaten>()

onMounted(() => {
    void run(() => props.store.load(true))
})

function onSave(payload: StammdatenPayload): void {
    const item = selected.value
    const action = item ? () => props.store.update(item.id, payload) : () => props.store.create(payload)

    void save(() => run(action, `${props.einzahl} wurde gespeichert.`))
}

function onDelete(item: Stammdaten): void {
    confirmDelete(`Möchtest du „${item.bezeichnung}" wirklich löschen?`, () => props.store.remove(item.id), `${props.einzahl} wurde gelöscht.`)
}

function formatAdresse(item: Stammdaten): string {
    const plzOrt = [item.adresse.plz, item.adresse.ort].filter(Boolean).join(' ')
    return [item.adresse.strasse, plzOrt].filter(Boolean).join(', ')
}
</script>

<template>
    <AdminListCard :titel="titel" :create-label="`Neuer ${einzahl}`" @create="openCreate">
        <DataTable :value="store.items" :loading="store.loading" v-bind="tableDefaults">
            <template #empty>Keine {{ titel }} vorhanden.</template>

            <Column header="Bezeichnung">
                <template #body="{ data }: { data: Stammdaten }">
                    <div class="font-medium">{{ data.bezeichnung }}</div>
                    <div v-if="data.bezeichnung_alternativ" class="text-sm text-muted-color">{{ data.bezeichnung_alternativ }}</div>
                </template>
            </Column>

            <Column header="Adresse">
                <template #body="{ data }: { data: Stammdaten }">{{ formatAdresse(data) }}</template>
            </Column>

            <Column header="Kontakt" v-bind="desktopOnlyColumn">
                <template #body="{ data }: { data: Stammdaten }">
                    <div v-if="data.tel">{{ data.tel }}</div>
                    <a v-if="data.email" :href="`mailto:${data.email}`" class="text-primary">{{ data.email }}</a>
                </template>
            </Column>

            <Column class="w-0 whitespace-nowrap">
                <template #header><span class="sr-only">Aktionen</span></template>
                <template #body="{ data }: { data: Stammdaten }">
                    <RowActions :bezeichnung="data.bezeichnung" @edit="openEdit(data)" @delete="onDelete(data)" />
                </template>
            </Column>
        </DataTable>
    </AdminListCard>

    <StammdatenDialog v-model:visible="visible" :item="selected" :einzahl="einzahl" :saving="saving" @save="onSave" />
</template>
