<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api'
import { useToast } from 'primevue/usetoast'
import { onMounted, reactive, Ref, ref } from 'vue'
import { Event } from '@/types/events'
import { EventService } from '@/service/EventService'
import EditEvent from '@/components/EditEvent.vue'

const toast = useToast()
const events: Ref<Array<Event | null>> = ref([])
const eventDialog = ref(false)
const deleteDialog = ref(false)
const deleteMultiDialog = ref(false)
const event: Ref<Event | null> = ref(null)
const selectedEvents = ref()
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})
const submitted = ref(false)

onMounted(() => {
    events.value = EventService.getEvents()
})

function openNew(): void {
    event.value = { title: "", category: "", date: new Date() }
    submitted.value = false
    eventDialog.value = true
}

function hideDialog(): void {
    eventDialog.value = false
    submitted.value = false
}

function saveEvent(): void {
    submitted.value = true

    if (event?.value.title?.trim()) {
        if (event.value.id) {
            events.value.find((item) => item.id === event.value.id)
            toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Veranstaltung aktualisiert', life: 3000 })
        } else {
            event.value.image = 'product-placeholder.svg'
            events.value.push(event.value)
            toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Veranstaltung erstellt', life: 3000 })
        }

        eventDialog.value = false
        event.value = null
    }
}

function editEvent(ev: Event): void {
    event.value = { ...ev }
    eventDialog.value = true
}

function confirmDelete(ev: Event): void {
    event.value = ev
    deleteDialog.value = true
}

function deleteEvent(): void {
    events.value = events.value.filter((val) => val.id !== event.value.id)
    deleteDialog.value = false
    event.value = null
    toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Veranstaltung gelöscht', life: 3000 })
}

function confirmDeleteSelected() {
    deleteDialog.value = true
}

function deleteSelectedEvents() {
    events.value = events.value.filter((val) => !selectedEvents.value.includes(val))
    deleteMultiDialog.value = false
    selectedEvents.value = null
    toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Veranstaltung gelöscht', life: 3000 })
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Neu" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Löschen" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedEvents || !selectedEvents.length" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedEvents"
                :value="events"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Zeige {first} bis {last} von {totalRecords} Veranstaltungen"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Suchen..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="veranstalter" header="Veranstalter" sortable style="min-width: 10rem"></Column>
                <Column field="datum" header="Datum" sortable style="min-width: 10rem"></Column>
                <Column field="name" header="Titel" sortable style="min-width: 16rem"></Column>
                <Column field="category" header="Kategorie" sortable style="min-width: 10rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editEvent(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDelete(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <EditEvent v-if="eventDialog" :item="event" />

        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle text-3xl!" />
                <span v-if="event"
                    >Bist du sicher, dass du die Veranstaltung <b>{{ event.title }} löschen willst?</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteEvent" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteMultiDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle text-3xl!" />
                <span v-if="event">Bist du sicher, dass du die ausgewählten Veranstaltungen löschen willst?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteMultiDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedEvents" />
            </template>
        </Dialog>
    </div>
</template>
