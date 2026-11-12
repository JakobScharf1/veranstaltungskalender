<script setup lang="ts">
import FormDialog from '@/admin/components/common/FormDialog.vue'
import FormField from '@/admin/components/common/FormField.vue'
import { toStammdatenOption } from '@/admin/config/options'
import { useFormState } from '@/admin/composables/useFormState'
import { createPartnerForm, toPartnerPayload, validatePartnerForm } from '@/admin/forms/partnerForm'
import { useOrteStore, useVeranstalterStore } from '@/store/resources'
import type { Partner, PartnerUpdatePayload } from '@/types'
import { computed, watch } from 'vue'

const props = defineProps<{
    item: Partner | null
    saving: boolean
}>()

const visible = defineModel<boolean>('visible', { required: true })

/**
 * Liefert immer das vollständige Payload. Beim Anlegen nutzt die API nur den Namen –
 * Zuordnungen sind erst beim Bearbeiten möglich (PUT).
 */
const emit = defineEmits<{
    save: [payload: PartnerUpdatePayload]
}>()

const orteStore = useOrteStore()
const veranstalterStore = useVeranstalterStore()

const ortOptions = computed(() => orteStore.items.map(toStammdatenOption))
const veranstalterOptions = computed(() => veranstalterStore.items.map(toStammdatenOption))

const { form, errors, reset, submit } = useFormState(() => createPartnerForm(props.item), validatePartnerForm)

watch(visible, (isOpen) => {
    if (!isOpen) return

    reset()
    if (props.item) {
        void Promise.all([orteStore.load(), veranstalterStore.load()])
    }
})

function onSubmit(): void {
    if (submit()) {
        emit('save', toPartnerPayload(form.value))
    }
}
</script>

<template>
    <FormDialog v-model:visible="visible" :header="item ? 'Partner bearbeiten' : 'Partner anlegen'" :saving="saving" @submit="onSubmit">
        <FormField id="partner-name" label="Name" required :error="errors.name">
            <InputText id="partner-name" v-model.trim="form.name" :invalid="!!errors.name" autofocus fluid />
        </FormField>

        <template v-if="item">
            <FormField id="partner-veranstalter" label="Zugeordnete Veranstalter">
                <MultiSelect
                    v-model="form.veranstalter"
                    input-id="partner-veranstalter"
                    :options="veranstalterOptions"
                    option-label="label"
                    option-value="value"
                    :loading="veranstalterStore.loading"
                    :virtual-scroller-options="{ itemSize: 38 }"
                    display="chip"
                    filter
                    placeholder="Veranstalter wählen"
                    fluid
                />
            </FormField>

            <FormField id="partner-orte" label="Zugeordnete Orte">
                <MultiSelect
                    v-model="form.orte"
                    input-id="partner-orte"
                    :options="ortOptions"
                    option-label="label"
                    option-value="value"
                    :loading="orteStore.loading"
                    :virtual-scroller-options="{ itemSize: 38 }"
                    display="chip"
                    filter
                    placeholder="Orte wählen"
                    fluid
                />
            </FormField>
        </template>

        <Message v-else severity="info" :closable="false">Veranstalter und Orte können nach dem Anlegen zugeordnet werden.</Message>
    </FormDialog>
</template>
