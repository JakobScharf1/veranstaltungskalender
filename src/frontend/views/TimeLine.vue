<template>

    <Card class="mx-5">
        <template #content>
            <div class="timeline-toolbar">
                <div class="timeline-toolbar-left">
                    <FilterBar @change="filter = $event" />
                </div>

                <div class="timeline-month-nav">
                    <Button icon="fa-solid fa-chevron-left" text rounded aria-label="Vorheriger Monat" @click="shiftMonth(-1)" />
                    <div class="timeline-month-label">
                        <h3 aria-live="polite">{{ monthLabel }}</h3>
                    </div>
                    <Button icon="fa-solid fa-chevron-right" text rounded aria-label="Nächster Monat" @click="shiftMonth(1)" />
                </div>

                <div class="timeline-toolbar-spacer"></div>
            </div>

            <div v-if="loading" class="loading-state" role="status">
                <ProgressSpinner />
                <p>Daten werden geladen...</p>
            </div>

            <Message v-else-if="fehler" severity="error" :closable="false">Die Termine konnten nicht geladen werden.</Message>

            <DataView v-else :value="sichtbareTermine" data-key="id">
                <template #list="{ items: dataItems }">
                    <div class="card-grid">
                        <TerminCard v-for="item in dataItems" :key="item.id" :item="item" show-date />
                    </div>
                </template>
                <template #empty>
                    <p class="text-center py-4">Keine Veranstaltungen gefunden.</p>
                </template>
            </DataView>
        </template>
    </Card>
</template>

<script setup lang="ts">
import FilterBar from '@/frontend/components/FilterBar.vue'
import TerminCard from '@/frontend/components/TerminCard.vue'
import { terminService } from '@/services/resources'
import type { Termin, TerminFilter, TerminQuery } from '@/types'
import { getMonthRange } from '@/utils/date'
import { computed, onMounted, ref, watch } from 'vue'

const heute = new Date()

const termine = ref<Termin[]>([])
const loading = ref(true)
const fehler = ref(false)
const filter = ref<TerminFilter>({})
const selectedMonth = ref(new Date(heute.getFullYear(), heute.getMonth(), 1))

const monthLabel = computed(() => selectedMonth.value.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }))

// „kostenlos" bietet die API nicht als Parameter an → clientseitig filtern
const sichtbareTermine = computed(() => {
    if (!filter.value.kostenlos) return termine.value
    return termine.value.filter((termin) => termin.veranstaltung.kostenlos)
})

function shiftMonth(offset: number): void {
    const current = selectedMonth.value
    selectedMonth.value = new Date(current.getFullYear(), current.getMonth() + offset, 1)
}

function buildQuery(): TerminQuery {
    const { start, ende } = getMonthRange(selectedMonth.value.getFullYear(), selectedMonth.value.getMonth())

    return {
        start,
        ende,
        titel: filter.value.titel,
        ort: filter.value.ort,
        kategorie: filter.value.kategorie?.toString()
    }
}

async function loadTermine(): Promise<void> {
    loading.value = true
    fehler.value = false

    try {
        termine.value = await terminService.getAll(buildQuery())
    } catch {
        fehler.value = true
        termine.value = []
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    void loadTermine()
})

watch([selectedMonth, filter], () => {
    void loadTermine()
})
</script>

<style>
.timeline-toolbar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.timeline-toolbar-left {
    justify-self: start;
    min-width: 0;
}

.timeline-toolbar-spacer {
    justify-self: end;
}

.timeline-month-nav {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    justify-self: center;
}

.timeline-month-label {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 10rem;
}

.timeline-month-label h3 {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 600;
    text-transform: capitalize;
}

/* Grid */
.card-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    padding-top: 1.5rem;
}

@media (max-width: 960px) {
    .card-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
}

@media (max-width: 560px) {
    .card-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }
}
</style>
