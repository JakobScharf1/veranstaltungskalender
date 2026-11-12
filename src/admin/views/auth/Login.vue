<script setup lang="ts">
import { ApiError } from '@/services/api/ApiError'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const fehler = ref<string | null>(null)
const verifizierungGesendet = ref(false)

async function submitLogin(): Promise<void> {
    loading.value = true
    fehler.value = null

    try {
        await authStore.login(username.value.trim(), password.value)
        await router.push({ name: 'termine' })
    } catch (error) {
        fehler.value = error instanceof ApiError && error.status !== 401 ? error.message : 'Ungültige Anmeldedaten'
    } finally {
        loading.value = false
    }
}

/** Eingabe mit @ wird als E-Mail, sonst als Benutzername übermittelt. */
async function sendVerificationMail(): Promise<void> {
    const kennung = username.value.trim()
    const request = kennung.includes('@') ? { email: kennung } : { username: kennung }

    try {
        await authService.sendVerificationMail(request)
        verifizierungGesendet.value = true
    } catch {
        fehler.value = 'Die Bestätigungsmail konnte nicht gesendet werden.'
    }
}
</script>

<template>
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-4">
                        <img src="/images/logo.png" alt="Brombeerland Logo" class="w-30 mx-auto" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Brombeerland gUG</div>
                        <span class="text-muted-color font-medium">Verwaltung Veranstaltungskalender</span>
                    </div>

                    <form @submit.prevent="submitLogin">
                        <label for="login-username" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Benutzername oder E-Mail</label>
                        <InputText
                            id="login-username"
                            v-model="username"
                            type="text"
                            placeholder="Benutzername oder E-Mail"
                            autocomplete="username"
                            autocapitalize="none"
                            class="w-full mb-4"
                            :invalid="!!fehler"
                            required
                        />

                        <label for="login-password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Passwort</label>
                        <Password
                            v-model="password"
                            input-id="login-password"
                            placeholder="Passwort"
                            toggle-mask
                            :feedback="false"
                            :invalid="!!fehler"
                            autocomplete="current-password"
                            class="mb-6"
                            fluid
                            required
                        />

                        <Button label="Einloggen" class="w-full" type="submit" :loading="loading" />

                        <div v-if="fehler" class="flex flex-col items-center gap-2 mt-4 text-center" role="alert">
                            <span class="text-red-500">{{ fehler }}</span>
                            <Button
                                v-if="!verifizierungGesendet && username.trim()"
                                label="E-Mail noch nicht bestätigt? Bestätigungsmail erneut senden"
                                link
                                size="small"
                                @click="sendVerificationMail"
                            />
                        </div>
                        <Message v-if="verifizierungGesendet" severity="success" :closable="false" class="mt-4">
                            Falls ein Konto existiert, wurde eine Bestätigungsmail versendet.
                        </Message>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
