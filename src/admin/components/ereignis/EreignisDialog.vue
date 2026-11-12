<script setup lang="ts">
import FormDialog from '@/admin/components/common/FormDialog.vue'
import FormField from '@/admin/components/common/FormField.vue'
import SocialLinkFields from '@/admin/components/common/SocialLinkFields.vue'
import { toStammdatenOption } from '@/admin/config/options'
import { useFormState } from '@/admin/composables/useFormState'
import { createEreignisForm, toEreignisPayload, validateEreignisForm } from '@/admin/forms/ereignisForm'
import { useKategorienStore, useOrteStore, useVeranstalterStore } from '@/store/resources'
import type { Ereignis, EreignisPayload } from '@/types'
import { computed, onMounted, watch } from 'vue'

const props = defineProps<{
    item: Ereignis | null
    saving: boolean
}>()

const visible = defineModel<boolean>('visible', { required: true })

const emit = defineEmits<{
    save: [payload: EreignisPayload]
}>()

const orteStore = useOrteStore()
const veranstalterStore = useVeranstalterStore()
const kategorienStore = useKategorienStore()

const ortOptions = computed(() => orteStore.items.map(toStammdatenOption))
const veranstalterOptions = computed(() => veranstalterStore.items.map(toStammdatenOption))

const { form, errors, reset, submit } = useFormState(() => createEreignisForm(props.item), validateEreignisForm)

// Auswahllisten einmalig laden (gecacht im Store)
onMounted(() => {
    void Promise.all([orteStore.load(), veranstalterStore.load(), kategorienStore.load()])
})

watch(visible, (isOpen) => {
    if (isOpen) reset()
})

function onSubmit(): void {
    if (submit()) {
        emit('save', toEreignisPayload(form.value))
    }
}
</script>

<template>
    <FormDialog v-model:visible="visible" :header="item ? 'Veranstaltung bearbeiten' : 'Veranstaltung anlegen'" :saving="saving" @submit="onSubmit">
        <FormField id="ereignis-titel" label="Titel" required :error="errors.titel">
            <InputText id="ereignis-titel" v-model.trim="form.titel" :invalid="!!errors.titel" autofocus fluid />
        </FormField>

        <FormField id="ereignis-untertitel" label="Untertitel">
            <InputText id="ereignis-untertitel" v-model.trim="form.untertitel" fluid />
        </FormField>

        <FormField id="ereignis-info" label="Beschreibung">
            <Textarea id="ereignis-info" v-model="form.info" rows="5" autoResize fluid />
        </FormField>

        <div class="flex flex-col md:flex-row md:items-end gap-4">
            <FormField class="md:flex-1" id="ereignis-kategorie" label="Kategorie" required :error="errors.kategorie">
                <Select
                    v-model="form.kategorie"
                    input-id="ereignis-kategorie"
                    :options="kategorienStore.items"
                    option-label="name"
                    option-value="id"
                    :loading="kategorienStore.loading"
                    :invalid="!!errors.kategorie"
                    placeholder="Kategorie wählen"
                    fluid
                />
            </FormField>

            <div class="flex items-center gap-2 md:h-10">
                <ToggleSwitch v-model="form.kostenlos" input-id="ereignis-kostenlos" />
                <label for="ereignis-kostenlos">Eintritt frei</label>
            </div>
        </div>

        <FormField id="ereignis-ort" label="Ort" required :error="errors.ort">
            <Select
                v-model="form.ort"
                input-id="ereignis-ort"
                :options="ortOptions"
                option-label="label"
                option-value="value"
                :loading="orteStore.loading"
                :invalid="!!errors.ort"
                :virtual-scroller-options="{ itemSize: 38 }"
                filter
                placeholder="Ort wählen"
                fluid
            />
        </FormField>

        <FormField id="ereignis-veranstalter" label="Veranstalter" required :error="errors.veranstalter">
            <Select
                v-model="form.veranstalter"
                input-id="ereignis-veranstalter"
                :options="veranstalterOptions"
                option-label="label"
                option-value="value"
                :loading="veranstalterStore.loading"
                :invalid="!!errors.veranstalter"
                :virtual-scroller-options="{ itemSize: 38 }"
                filter
                placeholder="Veranstalter wählen"
                fluid
            />
        </FormField>

        <Divider align="left"><span class="font-semibold">Links</span></Divider>

        <SocialLinkFields v-model:web="form.web" v-model:facebook="form.facebook" v-model:insta="form.insta" id-prefix="ereignis" />
    </FormDialog>
</template>
