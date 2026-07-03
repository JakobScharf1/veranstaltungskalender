<script setup lang="ts">
import { IUser } from '@/models/user'
import { UserService } from '@/services/UserService'
import { useAuthStore } from '@/store/auth'
import { SelectChangeEvent, useToast } from 'primevue'
import { onMounted, reactive, ref } from 'vue'

const toast = useToast()

const events = ref<IUser[]>([])

const sortOptions = reactive([
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Rolle', key: 'role' }
])
const sortKey = ref<string>('name')
const sortOrder = ref<number>(1)

const deleteDialog = ref<boolean>(false)
const deleteEvent = ref<IUser | null>(null)
const editDialog = ref<boolean>(false)
const editEvent = ref<IUser | null>(null)

const authStore = useAuthStore()

function onSortChange(sortEvent: SelectChangeEvent): void {
    console.log('Event', sortEvent)
}

function openDeleteEvent(event: IUser): void {
    deleteDialog.value = true
    deleteEvent.value = event
}

function confirmDelete(): void {
    deleteDialog.value = false
    events.value = events.value.filter((e) => e.id !== deleteEvent.value?.id)
    toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Veranstalter gelöscht', life: 3000 })
}

function showEditEvent(event: IUser): void {
    editDialog.value = true
    editEvent.value = event
}

function hideEditEvent(): void {
    editDialog.value = false
    editEvent.value = null
}

function saveEdit(event: IUser): void {
    editDialog.value = false
    toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Veranstalter aktualisiert', life: 3000 })
}

onMounted(() => {
    authStore.fetchUser()
    events.value = UserService.getUsers()
})
</script>

<template>
    <div class="flex flex-col">
        <div class="card">
            <div class="font-semibold text-xl">Veranstalter</div>
            <DataView :value="events" paginator :rows="15" :sortOrder="sortOrder" :sortField="sortKey">
                <template #header>
                    <Select v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sortierung" @change="onSortChange($event)" />
                </template>

                <template #list="slotProps">
                    <div class="flex flex-col">
                        <div v-for="(item, index) in slotProps.items" :key="index">
                            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" :class="{ 'border-t border-surface': index !== 0 }">
                                <div class="md:w-20 relative">
                                    <img v-if="item.image" class="block xl:block mx-auto rounded w-full" :src="item.image" :alt="item.name" />
                                    <img v-else class="block xl:block mx-auto rounded w-full" src="../../../../public/images/user.png" :alt="item.name" />
                                </div>
                                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                    <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                        <div>
                                            <p class="font-medium text-sm text-surface-500 dark:text-surface-400">
                                                <span>{{ item.email }}</span>
                                            </p>
                                            <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                                        </div>
                                        <div class="bg-surface-100 p-1" style="border-radius: 30px">
                                            <div
                                                class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2"
                                                style="
                                                    border-radius: 30px;
                                                    box-shadow:
                                                        0px 1px 2px 0px rgba(0, 0, 0, 0.04),
                                                        0px 1px 2px 0px rgba(0, 0, 0, 0.06);
                                                "
                                            >
                                                <span class="text-surface-900 font-medium text-sm">{{ item.role }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col md:items-end gap-8">
                                        <div class="flex flex-row-reverse md:flex-row gap-2">
                                            <Button icon="pi pi-trash" severity="danger" rounded outlined @click="openDeleteEvent(item)" />
                                            <Button icon="pi pi-pencil" rounded @click="showEditEvent(item)"></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
    </div>

    <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Löschen bestätigen" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle text-3xl!" />
            <span v-if="deleteEvent">
                Bist du sicher, dass du den Veranstalter <b>{{ deleteEvent.name }}</b> löschen willst?
            </span>
        </div>
        <template #footer>
            <Button label="Nein" icon="pi pi-times" text @click="deleteDialog = false" />
            <Button label="Ja" icon="pi pi-check" @click="confirmDelete()" />
        </template>
    </Dialog>

    <!-- <EditEvent v-model:visible="editDialog" :item="editEvent!" @cancel="hideEditEvent" @save="saveEdit" /> -->
</template>
