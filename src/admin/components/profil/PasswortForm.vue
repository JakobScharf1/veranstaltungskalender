<script setup lang="ts">
import FormField from '@/admin/components/common/FormField.vue'
import { useFormState } from '@/admin/composables/useFormState'
import { createPasswortForm, toPasswortPayload, validatePasswortForm } from '@/admin/forms/profilForm'
import { MIN_PASSWORT_LAENGE } from '@/admin/forms/validation'
import type { PasswortPayload } from '@/types'

defineProps<{
    saving: boolean
}>()

const emit = defineEmits<{
    save: [payload: PasswortPayload]
}>()

const { form, errors, reset, submit } = useFormState(createPasswortForm, validatePasswortForm)

function onSubmit(): void {
    if (submit()) {
        emit('save', toPasswortPayload(form.value))
    }
}

/** Wird von der View nach erfolgreichem Speichern aufgerufen. */
defineExpose({ reset })
</script>

<template>
    <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
        <FormField id="passwort-aktuell" label="Aktuelles Passwort" required :error="errors.current_password">
            <Password v-model="form.current_password" input-id="passwort-aktuell" :invalid="!!errors.current_password" :feedback="false" toggle-mask autocomplete="current-password" fluid />
        </FormField>

        <FormField id="passwort-neu" label="Neues Passwort" required :error="errors.password" :hint="`Mindestens ${MIN_PASSWORT_LAENGE} Zeichen`">
            <Password v-model="form.password" input-id="passwort-neu" :invalid="!!errors.password" :feedback="false" toggle-mask autocomplete="new-password" fluid />
        </FormField>

        <FormField id="passwort-bestaetigung" label="Neues Passwort wiederholen" required :error="errors.password_confirmation">
            <Password v-model="form.password_confirmation" input-id="passwort-bestaetigung" :invalid="!!errors.password_confirmation" :feedback="false" toggle-mask autocomplete="new-password" fluid />
        </FormField>

        <div class="flex justify-end">
            <Button type="submit" label="Passwort ändern" icon="pi pi-lock" :loading="saving" />
        </div>
    </form>
</template>
