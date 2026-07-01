<template>

  <DataView :value="items.data" data-key="id">

    <template #header>
      <FilterBar
        @loadEvents="loadEvents"
      ></FilterBar>
    </template>

    <template #list="{ items: dataItems }">

      <div class="card-grid">

        <Card v-for="item in dataItems" :key="item.id" class="veranstaltung-card">
          <template #header>
            <div class="card-img-wrapper">
              <img alt="Veranstaltungsbild" :src="item.bild_url" class="card-img">
              <div class="card-img-overlay"></div>
              <div class="card-img-title">
                <span class="card-kategorie">{{ item.kategorie }}</span>
                <h2 class="card-titel">{{ item.titel }}</h2>
              </div>
            </div>
          </template>

          <template #subtitle>
            <span class="card-subtitle">
              📍 {{ item.ort.name }}, {{ item.ort.stadt }} &nbsp;·&nbsp; 📅 {{ item.datum }}
            </span>
          </template>

          <template #content>
            <p class="card-beschreibung">{{ item.beschreibung }}</p>
          </template>

          <template #footer>
            <a :href="item.details_link" target="_blank">
              <Button label="Mehr Details" class="w-full" />
            </a>
          </template>
        </Card>

      </div>

    </template>

    <template #empty>
      <div class="w-100 flex justify-content-center">
        <p>Keine Veranstaltungen gefunden.</p>
      </div>
    </template>

  </DataView>

</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiService, type ApiResponse } from '@/frontend/services/APIService';
import type { FilterOption, Item } from '@/frontend/types';
import { onMounted, reactive } from 'vue'
import FilterBar from '@/frontend/components/FilterBar.vue';

const items = reactive({ data: [] as Item[], limit: Number, offset: Number, total: Number })

async function loadEvents(activeFilters?: Record<string, any>, filterOptions?: FilterOption[]) {
  const params = new URLSearchParams()
  let url = "/events"
  if(activeFilters && filterOptions) {
    for (const key of Object.keys(activeFilters)) {
      const opt = filterOptions.find(f => f.key === key)!
      const val = activeFilters[key]
      if (key === 'datum') {
        if (val.von) params.set('datum_von', formatDate(val.von))
        if (val.bis) params.set('datum_bis', formatDate(val.bis))
      } else if (key === 'kostenlos') {
        params.set('kostenlos', String(val))
      } else if (val) {
        params.set(opt.queryParam as string, val)
      }
    }
    url = url + `${params.size ? '?' + params.toString() : ''}`
  }
  const res = await ApiService.get<ApiResponse<Item[]>>(url)
  items.data = res.data
}

function formatDate(d: Date | string): string {
  if (!d) return ''
  return String(new Date(d).toISOString().split('T')[0])
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
  .card-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
}

@media (max-width: 560px) {
  .card-grid { grid-template-columns: 1fr; gap: 0.75rem; }
}

/* Cards */
.veranstaltung-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.veranstaltung-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.13);
  transform: translateY(-2px);
}

.veranstaltung-card .p-card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.veranstaltung-card .p-card-content { flex: 1; }

.card-img-wrapper {
  position: relative;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 15rem;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.3s ease;
}

@media (max-width: 560px) {
  .card-img { height: 12rem; }
}

.veranstaltung-card:hover .card-img { transform: scale(1.03); }

.card-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%);
}

.card-img-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem 1.2rem;
}

.card-kategorie {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 0.3rem;
}

.card-titel {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
  text-shadow: 0 1px 4px rgba(0,0,0,0.4);
}

@media (max-width: 560px) {
  .card-titel { font-size: 1rem; }
}

.card-subtitle {
  font-size: 0.82rem;
  color: var(--p-text-muted-color);
}

.card-beschreibung {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
