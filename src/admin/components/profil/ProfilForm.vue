<script setup lang="ts">
import FormField from '@/admin/components/common/FormField.vue'
import IconInputField from '@/admin/components/common/IconInputField.vue'
import { positionOptions } from '@/admin/config/options'
import { useFormState } from '@/admin/composables/useFormState'
import { createProfilForm, toProfilPayload, validateProfilForm } from '@/admin/forms/profilForm'
import type { CurrentUser, ProfilPayload } from '@/types'
import { computed, watch } from 'vue'

const props = defineProps<{
    user: CurrentUser
    saving: boolean
}>()

const emit = defineEmits<{
    save: [payload: ProfilPayload]
}>()

const { form, errors, reset, submit } = useFormState(() => createProfilForm(props.user), validateProfilForm)

const emailGeaendert = computed(() => form.value.email.trim() !== props.user.email)

// Nach dem Speichern liefert der Store neue Nutzerdaten → Formular synchronisieren
watch(() => props.user, reset)

function onSubmit(): void {
    if (submit()) {
        emit('save', toProfilPayload(form.value, props.user.email))
    }
}
</script>

<template>
    <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField id="profil-vorname" label="Vorname">
                <InputText id="profil-vorname" v-model.trim="form.vorname" autocomplete="given-name" fluid />
            </FormField>
            <FormField id="profil-nachname" label="Nachname">
                <InputText id="profil-nachname" v-model.trim="form.nachname" autocomplete="family-name" fluid />
            </FormField>
        </div>

        <FormField id="profil-email" label="E-Mail" required :error="errors.email">
            <InputText id="profil-email" v-model.trim="form.email" type="email" :invalid="!!errors.email" autocomplete="email" fluid />
        </FormField>
        <Message v-if="emailGeaendert" severity="warn" :closable="false">
            Nach einer Änderung der E-Mail-Adresse musst du diese bestätigen. Bis dahin ist kein Login möglich.
        </Message>

        <FormField id="profil-organisation" label="Organisation">
            <InputText id="profil-organisation" v-model.trim="form.organisation" autocomplete="organization" fluid />
        </FormField>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <IconInputField id="profil-weblink" v-model="form.weblink" label="Weblink" icon="pi pi-link" type="url" placeholder="https://…" />
            <FormField id="profil-linktext" label="Linktext">
                <InputText id="profil-linktext" v-model.trim="form.linktext" fluid />
            </FormField>
        </div>

        <FormField id="profil-position" label="Position">
            <Select v-model="form.position" input-id="profil-position" :options="positionOptions" option-label="label" option-value="value" placeholder="Position wählen" fluid />
        </FormField>

        <div class="flex justify-end">
            <Button type="submit" label="Profil speichern" icon="pi pi-check" :loading="saving" />
        </div>
    </form>
</template>
