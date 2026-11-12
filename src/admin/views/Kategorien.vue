<script setup lang="ts">
import AdminListCard from '@/admin/components/common/AdminListCard.vue'
import RowActions from '@/admin/components/common/RowActions.vue'
import KategorieDialog from '@/admin/components/kategorie/KategorieDialog.vue'
import { tableDefaults } from '@/admin/config/table'
import { useAdminFeedback } from '@/admin/composables/useAdminFeedback'
import { useEditDialog } from '@/admin/composables/useEditDialog'
import { useKategorienStore } from '@/store/resources'
import type { Kategorie, KategoriePayload } from '@/types'
import { onMounted } from 'vue'

const kategorienStore = useKategorienStore()
const { run, confirmDelete } = useAdminFeedback()
const { visible, selected, saving, openCreate, openEdit, save } = useEditDialog<Kategorie>()

onMounted(() => {
    void run(() => kategorienStore.load(true))
})

function onSave(payload: KategoriePayload): void {
    const item = selected.value
    const action = item ? () => kategorienStore.update(item.id, payload) : () => kategorienStore.create(payload)

    void save(() => run(action, 'Kategorie wurde gespeichert.'))
}

function onDelete(item: Kategorie): void {
    confirmDelete(`Möchtest du die Kategorie „${item.name}" wirklich löschen?`, () => kategorienStore.remove(item.id), 'Kategorie wurde gelöscht.')
}
</script>

<template>
    <AdminListCard titel="Kategorien" create-label="Neue Kategorie" @create="openCreate">
        <DataTable :value="kategorienStore.items" :loading="kategorienStore.loading" v-bind="tableDefaults">
            <template #empty>Keine Kategorien vorhanden.</template>

            <Column field="name" header="Name" />

            <Column class="w-0 whitespace-nowrap">
                <template #header><span class="sr-only">Aktionen</span></template>
                <template #body="{ data }: { data: Kategorie }">
                    <RowActions :bezeichnung="data.name" @edit="openEdit(data)" @delete="onDelete(data)" />
                </template>
            </Column>
        </DataTable>
    </AdminListCard>

    <KategorieDialog v-model:visible="visible" :item="selected" :saving="saving" @save="onSave" />
</template>
