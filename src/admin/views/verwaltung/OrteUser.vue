<script setup lang="ts">
import { ILocation } from '@/admin/models/locations'
import { LocationService } from '@/admin/service/LocationService'
import { LoginService } from '@/admin/service/LoginService'
import { FilterMatchMode } from '@primevue/core/api'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'

const toast = useToast()
const locations = ref<ILocation[]>([])
const locationDialog = ref(false)
const deleteDialog = ref(false)
const deleteMultiDialog = ref(false)
const location = ref<ILocation | null>(null)
const selectedLocations = ref<ILocation[]>([])
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})
const submitted = ref(false)

onMounted(() => {
    LoginService.checkAuth()
    locations.value = LocationService.getLocations()
})

function openNew(): void {
    location.value = { name: "", strasse: "", plz: "", ort: ""}
    submitted.value = false
    locationDialog.value = true
}

function hideEditDialog(): void {
    locationDialog.value = false
    submitted.value = false
}

function saveEdit(): void {
    submitted.value = true

    if (!location.value) {
        toast.add({ severity: 'error', summary: 'Fehler', detail: 'Name darf nicht leer sein', life: 3000 })
    } else {
        if (location?.value.name?.trim()) {
        if (location.value.id) {
            locations.value.find((item: ILocation) => item.id === location.value!.id)
            toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Ort aktualisiert', life: 3000 })
        } else {
            location.value.image = 'product-placeholder.svg'
            locations.value.push(location.value)
            toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Ort erstellt', life: 3000 })
        }

        locationDialog.value = false
        location.value = null
    }
    }
}

function editLocation(loc: ILocation): void {
    location.value = { ...loc }
    locationDialog.value = true
}

function confirmDelete(ev: ILocation): void {
    location.value = ev
    deleteDialog.value = true
}

function deleteLocation(): void {
    locations.value = locations.value.filter((val: ILocation) => val.id !== location.value!.id)
    deleteDialog.value = false
    location.value = null
    toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Ort gelöscht', life: 3000 })
}

function confirmDeleteSelected() {
    deleteMultiDialog.value = true
}

function deleteSelectedLocations() {
    locations.value = locations.value.filter((val: ILocation) => !selectedLocations.value.includes(val))
    deleteMultiDialog.value = false
    selectedLocations.value = []
    toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Ort gelöscht', life: 3000 })
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
                    <Button label="Löschen" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedLocations || !selectedLocations.length" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedLocations"
                :value="locations"
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
                <Column field="name" header="Name" style="min-width: 15rem"></Column>
                 <Column field="adresse" header="Adresse" sortable style="min-width: 15rem">
                    <template #body="slotProps">
                        {{ slotProps.data.strasse }}, {{ slotProps.data.plz }} {{ slotProps.data.ort }}
                    </template>
                </Column>
                <Column field="tel" header="Telefon" style="min-width: 10rem">
                    <template #body="slotProps">
                        <a :href="`tel:${slotProps.data.tel}`" target="_blank">{{ slotProps.data.tel }}</a>
                    </template>
                </Column>
                <Column field="email" header="Email" sortable style="min-width: 10rem">
                    <template #body="slotProps">
                        <a :href="`mailto:${slotProps.data.email}`" target="_blank">{{ slotProps.data.email }}</a>
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editLocation(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDelete(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <EditOrt v-model:visible="locationDialog" :item="location!" @cancel="hideEditDialog" @save="saveEdit" @upload="onImgUpload" />

        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Löschen bestätigen" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle text-3xl!" />
                <span v-if="location">
                    Bist du sicher, dass du den Veranstaltungsort <b>{{ location.name }}</b> löschen willst?
                </span>
            </div>
            <template #footer>
                <Button label="Nein" icon="pi pi-times" text @click="deleteDialog = false" />
                <Button label="Ja" icon="pi pi-check" @click="deleteLocation" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteMultiDialog" :style="{ width: '450px' }" header="Löschen bestätigen" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle text-3xl!" />
                <span v-if="selectedLocations && selectedLocations.length">Bist du sicher, dass du die ausgewählten Veranstaltungsorte löschen willst?</span>
            </div>
            <template #footer>
                <Button label="Nein" icon="pi pi-times" text @click="deleteMultiDialog = false" />
                <Button label="Ja" icon="pi pi-check" text @click="deleteSelectedLocations" />
            </template>
        </Dialog>
    </div>
</template>
