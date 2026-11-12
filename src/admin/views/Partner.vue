<script setup lang="ts">
import AdminListCard from '@/admin/components/common/AdminListCard.vue'
import RowActions from '@/admin/components/common/RowActions.vue'
import PartnerDialog from '@/admin/components/partner/PartnerDialog.vue'
import UserDialog from '@/admin/components/partner/UserDialog.vue'
import { desktopOnlyColumn, tableDefaults } from '@/admin/config/table'
import { useAdminFeedback } from '@/admin/composables/useAdminFeedback'
import { useEditDialog } from '@/admin/composables/useEditDialog'
import { usePartnerStore } from '@/store/partner'
import type { Partner, PartnerUpdatePayload, UserCreatePayload } from '@/types'
import { onMounted } from 'vue'

const partnerStore = usePartnerStore()
const { run } = useAdminFeedback()

const { visible: partnerDialogVisible, selected: selectedPartner, saving: partnerSaving, openCreate, openEdit, save: savePartner } = useEditDialog<Partner>()
const { visible: userDialogVisible, selected: userPartner, saving: userSaving, openEdit: openUserDialog, save: saveUser } = useEditDialog<Partner>()

onMounted(() => {
    void run(() => partnerStore.load())
})

function onSavePartner(payload: PartnerUpdatePayload): void {
    const item = selectedPartner.value
    const action = item ? () => partnerStore.update(item.id, payload) : () => partnerStore.create({ name: payload.name })

    void savePartner(() => run(action, 'Partner wurde gespeichert.'))
}

function onSaveUser(payload: UserCreatePayload): void {
    void saveUser(() => run(() => partnerStore.createUser(payload), `Benutzer „${payload.username}" wurde angelegt.`))
}

function namensListe(eintraege: { bezeichnung: string }[]): string {
    return eintraege.map((eintrag) => eintrag.bezeichnung).join(', ') || '–'
}
</script>

<template>
    <AdminListCard titel="Partner" create-label="Neuer Partner" @create="openCreate">
        <DataTable :value="partnerStore.items" :loading="partnerStore.loading" v-bind="tableDefaults">
            <template #empty>Keine Partner vorhanden.</template>

            <Column field="name" header="Name" />

            <Column header="Veranstalter" v-bind="desktopOnlyColumn">
                <template #body="{ data }: { data: Partner }">{{ namensListe(data.veranstalter) }}</template>
            </Column>

            <Column header="Orte" v-bind="desktopOnlyColumn">
                <template #body="{ data }: { data: Partner }">{{ namensListe(data.orte) }}</template>
            </Column>

            <Column class="w-0 whitespace-nowrap">
                <template #header><span class="sr-only">Aktionen</span></template>
                <template #body="{ data }: { data: Partner }">
                    <RowActions :bezeichnung="data.name" :deletable="false" @edit="openEdit(data)">
                        <Button
                            v-tooltip.top="'Benutzer anlegen'"
                            icon="pi pi-user-plus"
                            outlined
                            rounded
                            severity="secondary"
                            :aria-label="`Benutzer für ${data.name} anlegen`"
                            @click="openUserDialog(data)"
                        />
                    </RowActions>
                </template>
            </Column>
        </DataTable>
    </AdminListCard>

    <PartnerDialog v-model:visible="partnerDialogVisible" :item="selectedPartner" :saving="partnerSaving" @save="onSavePartner" />

    <UserDialog v-model:visible="userDialogVisible" :partner="userPartner" :saving="userSaving" @save="onSaveUser" />
</template>
