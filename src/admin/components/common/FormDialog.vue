<script setup lang="ts">
import { useId } from 'vue'

withDefaults(
    defineProps<{
        header: string
        saving?: boolean
        submitLabel?: string
    }>(),
    { saving: false, submitLabel: 'Speichern' }
)

const visible = defineModel<boolean>('visible', { required: true })

const emit = defineEmits<{
    submit: []
}>()

const formId = useId()
</script>

<template>
    <Dialog v-model:visible="visible" :header="header" modal :draggable="false" class="w-[40rem]" :breakpoints="{ '640px': '100vw' }">
        <form :id="formId" class="flex flex-col gap-5" novalidate @submit.prevent="emit('submit')">
            <slot />
        </form>

        <template #footer>
            <div class="flex pt-3">
                <Button class="mr-3" label="Abbrechen" icon="pi pi-times" text severity="secondary" @click="visible = false" />
                <Button type="submit" :form="formId" :label="submitLabel" icon="pi pi-check" :loading="saving" />
            </div>
        </template>
    </Dialog>
</template>
