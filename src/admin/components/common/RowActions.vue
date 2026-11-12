<script setup lang="ts">
withDefaults(
    defineProps<{
        /** Name des Datensatzes für Screenreader-Beschriftungen */
        bezeichnung: string
        deletable?: boolean
    }>(),
    { deletable: true }
)

const emit = defineEmits<{
    edit: []
    delete: []
}>()
</script>

<template>
    <div class="flex justify-end gap-2">
        <slot />
        <Button v-tooltip.top="'Bearbeiten'" icon="pi pi-pencil" outlined rounded :aria-label="`${bezeichnung} bearbeiten`" @click="emit('edit')" />
        <Button v-if="deletable" v-tooltip.top="'Löschen'" icon="pi pi-trash" outlined rounded severity="danger" :aria-label="`${bezeichnung} löschen`" @click="emit('delete')" />
    </div>
</template>
