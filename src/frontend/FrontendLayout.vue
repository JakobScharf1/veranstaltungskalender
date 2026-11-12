<template>
    <div class="relative flex justify-center items-center my-4">
        <SelectButton v-model="selectedView" :options="VIEW_OPTIONS" optionLabel="label" optionValue="val" class="clickable" :allow-empty="false" aria-label="Ansicht wählen" />
        <RouterLink to="/auth/login" class="absolute right-10 cursor-pointer" aria-label="Zur Verwaltung"><i class="pi pi-user" aria-hidden="true"></i></RouterLink>
    </div>
    <CalendarView v-if="selectedView === 'calendar'" />
    <TimeLine v-if="selectedView === 'list'" />
</template>

<script setup lang="ts">
import { IS_MOBILE } from '@/frontend/keys'
import CalendarView from '@/frontend/views/CalendarView.vue'
import TimeLine from '@/frontend/views/TimeLine.vue'
import { onBeforeUnmount, onMounted, provide, ref } from 'vue'

type Ansicht = 'list' | 'calendar'

const MOBILE_BREAKPOINT_PX = 560

const VIEW_OPTIONS: { label: string; val: Ansicht }[] = [
    { label: 'Liste', val: 'list' },
    { label: 'Kalender', val: 'calendar' }
]

const selectedView = ref<Ansicht>('list')

const isMobile = ref(window.innerWidth <= MOBILE_BREAKPOINT_PX)
provide(IS_MOBILE, isMobile)

function onResize(): void {
    isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT_PX
}

onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))
</script>
