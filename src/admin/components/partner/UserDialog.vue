<script setup lang="ts">
import FormDialog from '@/admin/components/common/FormDialog.vue'
import FormField from '@/admin/components/common/FormField.vue'
import { useFormState } from '@/admin/composables/useFormState'
import { createUserForm, toUserPayload, validateUserForm } from '@/admin/forms/partnerForm'
import { MIN_PASSWORT_LAENGE } from '@/admin/forms/validation'
import type { Partner, UserCreatePayload } from '@/types'
import { watch } from 'vue'

const props = defineProps<{
    partner: Partner | null
    saving: boolean
}>()

const visible = defineModel<boolean>('visible', { required: true })

const emit = defineEmits<{
    save: [payload: UserCreatePayload]
}>()

const { form, errors, reset, submit } = useFormState(createUserForm, validateUserForm)

watch(visible, (isOpen) => {
    if (isOpen) reset()
})

function onSubmit(): void {
    if (props.partner && submit()) {
        emit('save', toUserPayload(form.value, props.partner.id))
    }
}
</script>

<template>
    <FormDialog v-model:visible="visible" :header="`Benutzer für ${partner?.name ?? ''} anlegen`" submit-label="Anlegen" :saving="saving" @submit="onSubmit">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField id="user-vorname" label="Vorname">
                <InputText id="user-vorname" v-model.trim="form.vorname" autocomplete="off" fluid />
            </FormField>
            <FormField id="user-nachname" label="Nachname">
                <InputText id="user-nachname" v-model.trim="form.nachname" autocomplete="off" fluid />
            </FormField>
        </div>

        <FormField id="user-username" label="Benutzername" required :error="errors.username">
            <InputText id="user-username" v-model.trim="form.username" :invalid="!!errors.username" autocomplete="off" autocapitalize="none" fluid />
        </FormField>

        <FormField id="user-email" label="E-Mail" required :error="errors.email">
            <InputText id="user-email" v-model.trim="form.email" type="email" :invalid="!!errors.email" autocomplete="off" fluid />
        </FormField>

        <FormField id="user-password" label="Passwort" required :error="errors.password" :hint="`Mindestens ${MIN_PASSWORT_LAENGE} Zeichen`">
            <Password v-model="form.password" input-id="user-password" :invalid="!!errors.password" :feedback="false" toggle-mask autocomplete="new-password" fluid />
        </FormField>

        <div class="flex items-center gap-3">
            <ToggleSwitch v-model="form.admin" input-id="user-admin" />
            <label for="user-admin">Administrator des Partners</label>
        </div>
    </FormDialog>
</template>
