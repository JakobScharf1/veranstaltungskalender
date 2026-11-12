<script setup lang="ts">
defineProps<{
    /** ID des Eingabefelds – verknüpft das Label */
    id: string
    label: string
    required?: boolean
    error?: string
    hint?: string
}>()
</script>

<template>
    <div class="flex flex-col gap-2">
        <label :for="id" class="font-semibold">
            {{ label }}
            <span v-if="required" class="text-red-500" aria-hidden="true">*</span>
        </label>
        <slot />
        <small v-if="error" :id="`${id}-error`" class="text-red-500" role="alert">{{ error }}</small>
        <small v-else-if="hint" :id="`${id}-hint`" class="text-muted-color">{{ hint }}</small>
    </div>
</template>
