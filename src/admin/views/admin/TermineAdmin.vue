<script setup lang="ts">
import EditEvent from '@/admin/components/EditEvent.vue'
import { IEvent } from '@/admin/models/events'
import { EventService } from '@/admin/service/EventService'
import { FilterMatchMode } from '@primevue/core/api'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'
import { LoginService } from '@/admin/service/LoginService'

const toast = useToast()
const events = ref<IEvent[]>([])
const eventDialog = ref(false)
const deleteDialog = ref(false)
const deleteMultiDialog = ref(false)
const event = ref<IEvent | null>(null)
const selectedEvents = ref<IEvent[]>([])
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})
const submitted = ref(false)

onMounted(() => {
    LoginService.checkAuth()
    events.value = EventService.getEvents()
})

function openNew(): void {
    event.value = { title: "", category: "", date: new Date() }
    submitted.value = false
    eventDialog.value = true
}

function hideEditDialog(): void {
    eventDialog.value = false
    submitted.value = false
}

function saveEdit(): void {
    submitted.value = true

    if (!event.value) {
        toast.add({ severity: 'error', summary: 'Fehler', detail: 'Titel darf nicht leer sein', life: 3000 })
    } else {
        if (event?.value.title?.trim()) {
        if (event.value.id) {
            events.value.find((item) => item.id === event.value!.id)
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
}

function editEvent(ev: IEvent): void {
    event.value = { ...ev }
    eventDialog.value = true
}

function confirmDelete(ev: IEvent): void {
    event.value = ev
    deleteDialog.value = true
}

function deleteEvent(): void {
    events.value = events.value.filter((val) => val.id !== event.value!.id)
    deleteDialog.value = false
    event.value = null
    toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Veranstaltung gelöscht', life: 3000 })
}

function confirmDeleteSelected() {
    deleteMultiDialog.value = true
}

function deleteSelectedEvents() {
    events.value = events.value.filter((val) => !selectedEvents.value.includes(val))
    deleteMultiDialog.value = false
    selectedEvents.value = []
    toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Veranstaltung gelöscht', life: 3000 })
}

function onImgUpload(event: any): void {
    console.log("Image uploaded", event)
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
                currentPageReportTemplate="Zeige {first} bis {last} von {totalRecords}"
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
                <Column field="image" header="Bild" style="min-width: 10rem">
                    <template #body="slotProps">
                        <img v-if="slotProps.data.image" :src="slotProps.data.image" :alt="slotProps.data.image" class="w-24 rounded" />
                        <img v-else src="../../../../public/images/img.svg" :alt="slotProps.data.name" class="w-24 rounded" />
                    </template>
                </Column>
                <Column field="veranstalter" header="Veranstalter" sortable style="min-width: 10rem"></Column>
                <Column field="date" header="Datum" sortable style="min-width: 10rem">
                    <template #body="slotProps">
                        {{ EventService.formatDateToString(slotProps.data.date) }}
                    </template>
                </Column>
                <Column field="title" header="Titel" sortable style="min-width: 16rem"></Column>
                <Column field="category" header="Kategorie" sortable style="min-width: 10rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editEvent(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDelete(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <EditEvent v-model:visible="eventDialog" :item="event!" @cancel="hideEditDialog" @save="saveEdit" @upload="onImgUpload" />

        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Löschen bestätigen" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle text-3xl!" />
                <span v-if="event">
                    Bist du sicher, dass du die Veranstaltung <b>{{ event.title }}</b> löschen willst?
                </span>
            </div>
            <template #footer>
                <Button label="Nein" icon="pi pi-times" text @click="deleteDialog = false" />
                <Button label="Ja" icon="pi pi-check" @click="deleteEvent" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteMultiDialog" :style="{ width: '450px' }" header="Löschen bestätigen" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle text-3xl!" />
                <span v-if="selectedEvents && selectedEvents.length">Bist du sicher, dass du die ausgewählten Veranstaltungen löschen willst?</span>
            </div>
            <template #footer>
                <Button label="Nein" icon="pi pi-times" text @click="deleteMultiDialog = false" />
                <Button label="Ja" icon="pi pi-check" text @click="deleteSelectedEvents" />
            </template>
        </Dialog>
    </div>
</template>
