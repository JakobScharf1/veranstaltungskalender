<template>
    <div class="relative flex justify-center items-center my-4">
        <SelectButton v-model="selectedView" :options="options" optionLabel="label" optionValue="val" class="clickable" :allow-empty="false"></SelectButton>
        <RouterLink to="/auth/login" class="absolute right-10 cursor-pointer"><i class="pi pi-user"></i></RouterLink>
    </div>
    <CalendarView v-if="selectedView === 'calendar'" />
    <TimeLine v-if="selectedView === 'list'" />
</template>

<script setup lang="ts">
import CalendarView from '@/frontend/views/CalendarView.vue'
import TimeLine from '@/frontend/views/TimeLine.vue'
import { onMounted, onUnmounted, provide, reactive, ref } from 'vue'

const options = reactive([
    { label: 'Liste', val: 'list' },
    { label: 'Kalender', val: 'calendar' }
])

const selectedView = ref('list')

const isMobile = ref(window.innerWidth <= 560)
provide('isMobile', isMobile)
function onResize() {
    isMobile.value = window.innerWidth <= 560
}
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>
