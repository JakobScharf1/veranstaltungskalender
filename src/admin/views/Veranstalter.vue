<script setup lang="ts">
import StammdatenVerwaltung from '@/admin/components/stammdaten/StammdatenVerwaltung.vue'
import { useVeranstalterStore } from '@/store/resources'

const veranstalterStore = useVeranstalterStore()
</script>

<template>
    <StammdatenVerwaltung :store="veranstalterStore" titel="Veranstalter" einzahl="Veranstalter" />
</template>
