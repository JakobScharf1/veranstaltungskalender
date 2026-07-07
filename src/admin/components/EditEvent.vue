<script setup lang="ts">
import { ITermin } from '@/models/termin';
import { useListStore } from '@/store/lists';
import { computed } from 'vue';

const props = defineProps<{
    item: ITermin | null
    visible: boolean
}>()
const emits = defineEmits(['save', 'cancel', 'update:visible', 'upload'])

const localVisible = computed({
    get: () => props.visible,
    set: (val) => emits('update:visible', val)
})

const listStore = useListStore()
</script>

<template>
    <Dialog v-if="item" v-model:visible="localVisible" @hide="emits('cancel')" :style="{ width: '450px' }" header="Veranstaltung Details" :modal="true">
        <div class="flex flex-col gap-6">
            <div>
                <img v-if="item.veranstaltung?.picture1" :src="item.veranstaltung.picture1" class="block m-auto pb-4" />
                <FileUpload mode="basic" name="imageUpload" url="/api/upload" accept="image/*" :maxFileSize="1000000" @upload="emits('upload')" :auto="true" :chooseLabel="item.veranstaltung?.picture1 ? 'Neues Bild hochladen' : 'Bild hochladen'" />
            </div>
            <div>
                <label for="name" class="block font-bold mb-3">Titel</label>
                <InputText id="name" v-model.trim="item.veranstaltung.titel" required="true" autofocus fluid />
                <small v-if="!item.veranstaltung.titel" class="text-red-500">Titel ist verpflichtend.</small>
            </div>
            <div>
                <label for="subtitle" class="block font-bold mb-3">Untertitel</label>
                <Textarea id="subtitle" v-model="item.veranstaltung.untertitel" rows="3" cols="20" fluid />
            </div>
            <div>
                <label for="description" class="block font-bold mb-3">Beschreibung</label>
                <Textarea id="description" v-model="item.veranstaltung.info" rows="3" cols="20" fluid />
            </div>
            <div>
                <label for="category" class="block font-bold mb-3">Kategorie</label>
                <Select id="category" v-model="item.veranstaltung.kategorie" :options="listStore.categories" optionLabel="name" placeholder="Kategorie auswählen" fluid></Select>
            </div>
            <Divider />
            <div class="flex flex-row gap-2">
                <Checkbox inputId="fullday" v-model="item.allday" :binary="true" />
                <label for="fullday">Ganztägig</label>
            </div>
            <div class="flex flex-row gap-2">
                <div class="w-1/2">
                    <label for="start" class="block font-bold mb-3">Start</label>
                    <DatePicker id="start" :model-value="item.start ? new Date(item.start) : null" @update:model-value="(val) => (item!.start = val ? String(val) : '')" timeOnly hourFormat="24" fluid />
                </div>
                <div class="w-1/2">
                    <label for="end" class="block font-bold mb-3">Ende</label>
                    <DatePicker id="end" :model-value="item.ende ? new Date(item.ende) : null" @update:model-value="(val) => (item!.ende = val ? String(val) : '')" timeOnly hourFormat="24" fluid />
                </div>
            </div>
            <Divider />
            <div>
                <label for="web" class="block font-bold mb-3">Website</label>
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-globe"></i>
                    </InputGroupAddon>
                    <InputText id="web" v-model="item.veranstaltung.web" required="false" type="url" fluid />
                </InputGroup>
            </div>
            <div>
                <label for="facebook" class="block font-bold mb-3">Facebook</label>
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-facebook"></i>
                    </InputGroupAddon>
                    <InputText id="facebook" v-model="item.veranstaltung.facebook" required="false" type="url" fluid />
                </InputGroup>
            </div>
            <div>
                <label for="instagram" class="block font-bold mb-3">Instagram</label>
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-instagram"></i>
                    </InputGroupAddon>
                    <InputText id="instagram" v-model="item.veranstaltung.insta" required="false" type="url" fluid />
                </InputGroup>
            </div>
        </div>

        <template #footer>
            <Button label="Abbrechen" icon="pi pi-times" text @click="emits('cancel')" />
            <Button label="Speichern" icon="pi pi-check" @click="emits('save')" />
        </template>
    </Dialog>
</template>
