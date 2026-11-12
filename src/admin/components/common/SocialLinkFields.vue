<script setup lang="ts">
import IconInputField from './IconInputField.vue'

defineProps<{
    /** Präfix für eindeutige Feld-IDs */
    idPrefix: string
    webLabel?: string
}>()

const web = defineModel<string>('web', { required: true })
const facebook = defineModel<string>('facebook', { required: true })
const insta = defineModel<string>('insta', { required: true })
</script>

<template>
    <div class="flex flex-col gap-4">
        <IconInputField :id="`${idPrefix}-web`" v-model="web" :label="webLabel ?? 'Website'" icon="pi pi-globe" type="url" placeholder="https://…" />
        <IconInputField :id="`${idPrefix}-facebook`" v-model="facebook" label="Facebook" icon="pi pi-facebook" type="url" placeholder="https://…" />
        <IconInputField :id="`${idPrefix}-insta`" v-model="insta" label="Instagram" icon="pi pi-instagram" type="url" placeholder="https://…" />
    </div>
</template>
