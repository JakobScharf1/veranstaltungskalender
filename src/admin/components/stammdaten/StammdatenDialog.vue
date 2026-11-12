<script setup lang="ts">
import FormDialog from '@/admin/components/common/FormDialog.vue'
import FormField from '@/admin/components/common/FormField.vue'
import IconInputField from '@/admin/components/common/IconInputField.vue'
import SocialLinkFields from '@/admin/components/common/SocialLinkFields.vue'
import { useFormState } from '@/admin/composables/useFormState'
import { createStammdatenForm, toStammdatenPayload, validateStammdatenForm } from '@/admin/forms/stammdatenForm'
import type { Stammdaten, StammdatenPayload } from '@/types'
import { watch } from 'vue'

/** Formular für Orte und Veranstalter – beide haben laut API dieselben Felder. */
const props = defineProps<{
    item: Stammdaten | null
    /** z. B. „Ort" oder „Veranstalter" */
    einzahl: string
    saving: boolean
}>()

const visible = defineModel<boolean>('visible', { required: true })

const emit = defineEmits<{
    save: [payload: StammdatenPayload]
}>()

const { form, errors, reset, submit } = useFormState(() => createStammdatenForm(props.item), validateStammdatenForm)

watch(visible, (isOpen) => {
    if (isOpen) reset()
})

function onSubmit(): void {
    if (submit()) {
        emit('save', toStammdatenPayload(form.value))
    }
}
</script>

<template>
    <FormDialog v-model:visible="visible" :header="item ? `${einzahl} bearbeiten` : `${einzahl} anlegen`" :saving="saving" @submit="onSubmit">
        <FormField id="stammdaten-bezeichnung" label="Bezeichnung" required :error="errors.bezeichnung">
            <InputText id="stammdaten-bezeichnung" v-model.trim="form.bezeichnung" :invalid="!!errors.bezeichnung" autofocus fluid />
        </FormField>

        <FormField id="stammdaten-bezeichnung-alt" label="Alternative Bezeichnung">
            <InputText id="stammdaten-bezeichnung-alt" v-model.trim="form.bezeichnung_alternativ" fluid />
        </FormField>

        <FormField id="stammdaten-info" label="Beschreibung">
            <Textarea id="stammdaten-info" v-model="form.info" rows="4" autoResize fluid />
        </FormField>

        <Divider align="left"><span class="font-semibold">Adresse</span></Divider>

        <FormField id="stammdaten-strasse" label="Straße und Hausnummer">
            <InputText id="stammdaten-strasse" v-model.trim="form.adresse.strasse" autocomplete="street-address" fluid />
        </FormField>

        <div class="flex flex-col md:flex-row gap-4">
            <FormField class="md:flex-1" id="stammdaten-plz" label="PLZ">
                <InputText id="stammdaten-plz" v-model.trim="form.adresse.plz" inputmode="numeric" autocomplete="postal-code" fluid />
            </FormField>
            <div class="md:flex-1 sm:col-span-2">
                <FormField id="stammdaten-ort" label="Ort" required :error="errors.adresseOrt">
                    <InputText id="stammdaten-ort" v-model.trim="form.adresse.ort" :invalid="!!errors.adresseOrt" autocomplete="address-level2" fluid />
                </FormField>
            </div>
        </div>

        <Divider align="left"><span class="font-semibold">Kontakt</span></Divider>

        <div class="flex flex-col md:flex-row gap-4">
            <IconInputField class="md:flex-1" id="stammdaten-tel" v-model="form.tel" label="Telefon" icon="pi pi-phone" type="tel" />
            <IconInputField class="md:flex-1" id="stammdaten-email" v-model="form.email" label="E-Mail" icon="pi pi-envelope" type="email" />
        </div>

        <SocialLinkFields v-model:web="form.home" v-model:facebook="form.facebook" v-model:insta="form.insta" id-prefix="stammdaten" />
    </FormDialog>
</template>
