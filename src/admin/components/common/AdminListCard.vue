<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
    titel: string
    /** Beschriftung des Anlegen-Buttons; ohne Angabe wird kein Button angezeigt. */
    createLabel?: string
}>()

const emit = defineEmits<{
    create: []
}>()

const headingId = useId()
</script>

<template>
    <section class="card" :aria-labelledby="headingId">
        <header class="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h1 :id="headingId" class="text-xl font-semibold m-0">{{ titel }}</h1>
            <Button v-if="createLabel" :label="createLabel" icon="pi pi-plus" @click="emit('create')" />
        </header>
        <slot />
    </section>
</template>
