<script setup lang="ts">
import StammdatenVerwaltung from '@/admin/components/stammdaten/StammdatenVerwaltung.vue'
import { useOrteStore } from '@/store/resources'

const orteStore = useOrteStore()
</script>

<template>
    <StammdatenVerwaltung :store="orteStore" titel="Orte" einzahl="Ort" />
</template>
