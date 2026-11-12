<script setup lang="ts">
import PasswortForm from '@/admin/components/profil/PasswortForm.vue'
import ProfilForm from '@/admin/components/profil/ProfilForm.vue'
import { useAdminFeedback } from '@/admin/composables/useAdminFeedback'
import { useAuthStore } from '@/store/auth'
import type { PasswortPayload, ProfilPayload, Rolle } from '@/types'
import { ref, useTemplateRef } from 'vue'

const ROLLEN_LABEL: Record<Rolle, string> = {
    user: 'Benutzer',
    admin: 'Administrator',
    superadmin: 'Superadmin'
}

const authStore = useAuthStore()
const { run } = useAdminFeedback()

const profilSaving = ref(false)
const passwortSaving = ref(false)
const passwortForm = useTemplateRef<InstanceType<typeof PasswortForm>>('passwortForm')

async function onSaveProfil(payload: ProfilPayload): Promise<void> {
    profilSaving.value = true
    await run(() => authStore.updateProfil(payload), 'Profil wurde gespeichert.')
    profilSaving.value = false
}

async function onSavePasswort(payload: PasswortPayload): Promise<void> {
    passwortSaving.value = true
    const erfolgreich = await run(() => authStore.updateProfil(payload), 'Passwort wurde geändert.')
    passwortSaving.value = false

    if (erfolgreich) passwortForm.value?.reset()
}
</script>

<template>
    <div v-if="authStore.user" class="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <section class="card" aria-labelledby="profil-heading">
            <header class="mb-4">
                <h1 id="profil-heading" class="text-xl font-semibold m-0">Mein Profil</h1>
                <p class="text-muted-color mt-1 mb-0">{{ authStore.user.username }} · {{ ROLLEN_LABEL[authStore.rolle] }}</p>
            </header>
            <ProfilForm :user="authStore.user" :saving="profilSaving" @save="onSaveProfil" />
        </section>

        <section class="card" aria-labelledby="passwort-heading">
            <h2 id="passwort-heading" class="text-xl font-semibold mt-0 mb-4">Passwort ändern</h2>
            <PasswortForm ref="passwortForm" :saving="passwortSaving" @save="onSavePasswort" />
        </section>
    </div>
</template>
