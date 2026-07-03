<script setup lang="ts">
import router from '@/router'
import { useAuthStore } from '@/store/auth'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const invalid = ref(false)

const authStore = useAuthStore()

async function submitLogin(): Promise<void> {
    const success = await authStore.login(email.value, password.value)
    if (!success) {
        invalid.value = true
    } else {
        invalid.value = false
        authStore.fetchUser()
        router.push('/mgmt/termine')
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
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email-Adresse" class="w-full mb-4" v-model="email" :invalid="invalid" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Passwort</label>
                        <Password id="password1" v-model="password" placeholder="Passwort" :toggleMask="true" class="mb-4" fluid :feedback="false" :invalid="invalid"></Password>

                        <div class="flex items-center justify-between mt-2 mb-4 gap-8">
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Passwort vergessen?</span>
                        </div>
                        <Button label="Einloggen" class="w-full" type="submit"></Button>

                        <div v-if="invalid" class="flex text-red-500 text-center justify-center mt-4">
                            <span>Ungültige Anmeldedaten</span>
                        </div>
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
