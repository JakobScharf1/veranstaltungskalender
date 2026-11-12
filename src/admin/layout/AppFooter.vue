<script setup>
import { ref } from 'vue'
const heute = ref(new Date())
const currentYear = ref(heute.value.getFullYear())
</script>

<template>
    <div class="layout-footer">Brombeerland gUG © {{ currentYear }} Alle Rechte vorbehalten</div>
</template>
