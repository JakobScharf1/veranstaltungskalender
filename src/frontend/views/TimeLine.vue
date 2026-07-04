<template>

    <div v-if="loading" class="loading-state">
        <ProgressSpinner />
        <p>Details werden geladen...</p>
    </div>

    <Card v-else class="mx-5">
        <template #content>
            <DataView :value="items" data-key="id">
                <template #header>
                    <FilterBar @loadEvents="loadEvents"></FilterBar>
                </template>
                <template #list="{ items: dataItems }">
                    <div class="card-grid">
                        <TerminCard v-for="item in dataItems" :key="item.id" :item="item" :date="true"></TerminCard>
                    </div>
                </template>
                <template #empty class="justify-content-center">
                    <p class="text-center py-4">Keine Veranstaltungen gefunden.</p>
                </template>
            </DataView>
        </template>
    </Card>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import FilterBar from '@/frontend/components/FilterBar.vue'
import type { FilterOption } from '@/frontend/types'
import { ITermin } from '@/models/termin'
import { ApiService } from '@/services/APIService'
import { onMounted, ref } from 'vue'
import { formatDate, dateToString } from '@/services/Helper'
import TerminCard from '../components/TerminCard.vue'

let items = ref<ITermin[]>([])
let loading = ref(true)

async function loadEvents(activeFilters?: Record<string, any>, filterOptions?: FilterOption[]) {
    loading.value = true
    const params = new URLSearchParams()
    let url = '/termine'
    if (activeFilters && filterOptions) {
        for (const key of Object.keys(activeFilters)) {
            const opt = filterOptions.find((f) => f.key === key)!
            const val = activeFilters[key]
            if (key === 'datum') {
                if (val.von) params.set('start', formatDate(val.von))
                if (val.bis) params.set('ende', formatDate(val.bis))
            } else if (key === 'kostenlos') {
                params.set('kostenlos', String(val))
            } else if (val) {
                params.set(opt.queryParam as string, val)
            }
        }
        url = url + `${params.size ? '?' + params.toString() : ''}`
    }
    items.value = await ApiService.get<ITermin[]>(url)
    for(const item of items.value) {
        item.start = dateToString(item.start)
        if (item.ende) item.ende = dateToString(item.ende)
    }
    loading.value = false
}

onMounted(loadEvents)
</script>

<style>
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
