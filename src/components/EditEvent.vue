<script setup lang="ts">
import { IEvent } from '@/models/events'
import { useListStore } from '@/store/lists'
import { computed } from 'vue';

const props = defineProps<{
    item: IEvent,
    visible: boolean,
}>()
const emits = defineEmits(['save', 'cancel', 'update:visible', 'upload'])

const localVisible = computed({
    get: () => props.visible,
    set: (val) => emits('update:visible', val)
})

const listStore = useListStore()
</script>

<template>
    <Dialog v-model:visible="localVisible" @hide="emits('cancel')" :style="{ width: '450px' }" header="Veranstaltung Details" :modal="true">
        <div class="flex flex-col gap-6">
            <div>
                <img v-if="item.image" :src="item.image" class="block m-auto pb-4" />
                <FileUpload mode="basic" name="imageUpload" url="/api/upload" accept="image/*" :maxFileSize="1000000" @upload="emits('upload')" :auto="true" :chooseLabel="item.image ? 'Neues Bild hochladen' : 'Bild hochladen'" />
            </div>
            <div>
                <label for="name" class="block font-bold mb-3">Titel</label>
                <InputText id="name" v-model.trim="item.title" required="true" autofocus fluid />
                <small v-if="!item.title" class="text-red-500">Titel ist verpflichtend.</small>
            </div>
            <div>
                <label for="subtitle" class="block font-bold mb-3">Untertitel</label>
                <Textarea id="subtitle" v-model="item.subtitle" rows="3" cols="20" fluid />
            </div>
            <div>
                <label for="description" class="block font-bold mb-3">Beschreibung</label>
                <Textarea id="description" v-model="item.description" rows="3" cols="20" fluid />
            </div>
            <div>
                <label for="category" class="block font-bold mb-3">Kategorie</label>
                <Select id="category" v-model="item.category" :options="listStore.categories" optionLabel="label" placeholder="Kategorie auswählen" fluid></Select>
            </div>
            <Divider />
            <div>
                <label for="day" class="block font-bold mb-3">Datum</label>
                <DatePicker id="day" v-model="item.date" dateFormat="dd.mm.yy" showIcon iconDisplay="input" selectionMode="range" :manual-input="false" :required="true" fluid></DatePicker>
            </div>
            <div class="flex flex-row gap-2">
                <Checkbox id="fullday" v-model="item.fullday"></Checkbox>
                <label for="fullday">Ganztags</label>
            </div>
            <div class="flex flex-row gap-2" v-if="!item.fullday">
                <div class="w-1/2">
                    <label for="start" class="block font-bold mb-3">Start</label>
                    <DatePicker id="start" v-model="item.start" timeOnly hourFormat="24" :required="!item.fullday" fluid />
                </div>
                <div class="w-1/2">
                    <label for="end" class="block font-bold mb-3">Ende</label>
                    <DatePicker id="end" v-model="item.end" timeOnly hourFormat="24" :required="!item.fullday" fluid />
                </div>
            </div>
            <Divider />
            <div>
                <label for="web" class="block font-bold mb-3">Website</label>
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-globe"></i>
                    </InputGroupAddon>
                    <InputText id="web" v-model="item.web" required="false" type="url" fluid />
                </InputGroup>
            </div>
            <div>
                <label for="facebook" class="block font-bold mb-3">Facebook</label>
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-facebook"></i>
                    </InputGroupAddon>
                    <InputText id="facebook" v-model="item.facebook" required="false" type="url" fluid />
                </InputGroup>
            </div>
            <div>
                <label for="instagram" class="block font-bold mb-3">Instagram</label>
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-instagram"></i>
                    </InputGroupAddon>
                    <InputText id="instagram" v-model="item.instagram" required="false" type="url" fluid />
                </InputGroup>
            </div>
        </div>

        <template #footer>
            <Button label="Abbrechen" icon="pi pi-times" text @click="emits('cancel')" />
            <Button label="Speichern" icon="pi pi-check" @click="emits('save')" />
        </template>
    </Dialog>
</template>
