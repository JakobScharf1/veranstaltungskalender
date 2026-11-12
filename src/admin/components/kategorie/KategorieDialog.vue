<script setup lang="ts">
import FormDialog from '@/admin/components/common/FormDialog.vue'
import FormField from '@/admin/components/common/FormField.vue'
import { useFormState } from '@/admin/composables/useFormState'
import { isBlank, PFLICHTFELD } from '@/admin/forms/validation'
import type { FormErrors, Kategorie, KategorieForm, KategoriePayload } from '@/types'
import { watch } from 'vue'

const props = defineProps<{
    item: Kategorie | null
    saving: boolean
}>()

const visible = defineModel<boolean>('visible', { required: true })

const emit = defineEmits<{
    save: [payload: KategoriePayload]
}>()

function validate(form: KategorieForm): FormErrors<KategorieForm> {
    return isBlank(form.name) ? { name: PFLICHTFELD } : {}
}

const { form, errors, reset, submit } = useFormState<KategorieForm, FormErrors<KategorieForm>>(() => ({ name: props.item?.name ?? '' }), validate)

watch(visible, (isOpen) => {
    if (isOpen) reset()
})

function onSubmit(): void {
    if (submit()) {
        emit('save', { name: form.value.name.trim() })
    }
}
</script>

<template>
    <FormDialog v-model:visible="visible" :header="item ? 'Kategorie bearbeiten' : 'Kategorie anlegen'" :saving="saving" @submit="onSubmit">
        <FormField id="kategorie-name" label="Name" required :error="errors.name">
            <InputText id="kategorie-name" v-model.trim="form.name" :invalid="!!errors.name" autofocus fluid />
        </FormField>
    </FormDialog>
</template>
