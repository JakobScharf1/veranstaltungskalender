<template>

  <div class="kalender-wrapper">
    <!-- Navigation -->
    <div class="kalender-header">
      <Button icon="fa-solid fa-chevron-left" text rounded @click="prevMonth" />
      <h2 class="kalender-monat">{{ monatLabel }}</h2>
      <Button icon="fa-solid fa-chevron-right" text rounded @click="nextMonth" />
    </div>

    <!-- Wochentag-Header -->
    <div class="kalender-grid">
      <div v-for="tag in wochentage" :key="tag" class="kalender-wochentag">
        {{ tag }}
      </div>

      <!-- Leere Felder vor dem 1. des Monats -->
      <div v-for="n in firstDayOffset" :key="'empty-' + n" class="kalender-tag leer"></div>

      <!-- Tage -->
      <div
        v-for="tag in tageImMonat"
        :key="tag"
        class="kalender-tag"
        :class="{
          'heute': isHeute(tag),
          'hat-events': getEvents(tag).length > 0
        }"
        @click="getEvents(tag).length > 0 && openDay(tag)"
      >
        <span class="tag-nummer">{{ tag }}</span>
        <div class="event-dots">
          <div
            v-for="(event, i) in getEvents(tag).slice(0, 3)"
            :key="i"
            class="event-dot"
            v-tooltip.bottom="event.titel"
          ></div>
          <span v-if="getEvents(tag).length > 3" class="event-mehr">
            +{{ getEvents(tag).length - 3 }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- Detail Drawer für einen Tag -->
  <Drawer v-model:visible="drawerVisible" :header="drawerHeader" position="right" style="width: 26rem">
    <div class="drawer-events">
      <div v-for="event in selectedEvents" :key="event.id" class="drawer-event-card">
        <img :src="event.bild_url" class="drawer-event-img" :alt="event.titel" />
        <div class="drawer-event-body">
          <Tag :value="event.kategorie" rounded class="mb-2" />
          <h3 class="drawer-event-titel">{{ event.titel }}</h3>
          <div class="drawer-event-meta">
            <span><i class="pi pi-clock"></i> {{ event.uhrzeit_beginn }} – {{ event.uhrzeit_ende }}</span>
            <span><i class="pi pi-map-marker"></i> {{ event.ort.name }}, {{ event.ort.stadt }}</span>
            <span v-if="!event.eintritt.kostenlos"><i class="pi pi-ticket"></i> {{ event.eintritt.preis }} {{ event.eintritt.waehrung }}</span>
            <span v-else><i class="pi pi-ticket"></i> Kostenlos</span>
          </div>
          <p class="drawer-event-beschreibung">{{ event.beschreibung }}</p>
          <a :href="event.details_link" target="_blank">
            <Button label="Mehr Details" class="w-full" size="small" />
          </a>
        </div>
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { ApiService, type ApiResponse } from '@/frontend/services/APIService'
import { ref, computed, onMounted } from 'vue'

type Item = {
  id: number
  titel: string
  beschreibung: string
  datum: string
  uhrzeit_beginn: string
  uhrzeit_ende: string
  bild_url: string
  details_link: string
  kategorie: string
  eintritt: { kostenlos: boolean; preis: number | null; waehrung: string | null }
  ort: { name: string; stadt: string }
}

const events = ref<Item[]>([])
const heute = new Date()
const currentYear = ref(heute.getFullYear())
const currentMonth = ref(heute.getMonth()) // 0-basiert

const drawerVisible = ref(false)
const selectedEvents = ref<Item[]>([])
const selectedDay = ref<number | null>(null)

const wochentage = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

const monatLabel = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1)
    .toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
})

const tageImMonat = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

// Montag = 0 Offset
const firstDayOffset = computed(() => {
  const day = new Date(currentYear.value, currentMonth.value, 1).getDay()
  return day === 0 ? 6 : day - 1
})

const drawerHeader = computed(() => {
  if (!selectedDay.value) return ''
  return new Date(currentYear.value, currentMonth.value, selectedDay.value)
    .toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })
})

function getEvents(day: number): Item[] {
  const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return events.value.filter(e => e.datum === dateStr)
}

function isHeute(day: number): boolean {
  return (
    day === heute.getDate() &&
    currentMonth.value === heute.getMonth() &&
    currentYear.value === heute.getFullYear()
  )
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function openDay(day: number) {
  selectedDay.value = day
  selectedEvents.value = getEvents(day)
  drawerVisible.value = true
}

onMounted(async () => {
  const res = await ApiService.get<ApiResponse<Item[]>>('/events', {params: {limit: 100}})
  events.value = res.data
})
</script>

<style scoped>
.kalender-wrapper {
  background: var(--p-content-background);
  border: 1px solid var(--p-content-border-color);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.kalender-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.kalender-monat {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.kalender-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.4rem;
}

.kalender-wochentag {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--p-text-muted-color);
  padding-bottom: 0.5rem;
}

.kalender-tag {
  min-height: 5rem;
  border-radius: 8px;
  padding: 0.4rem 0.5rem;
  border: 1px solid transparent;
  transition: background 0.15s, border-color 0.15s;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.kalender-tag.leer {
  background: transparent;
  border: none;
}

.kalender-tag.hat-events {
  background: var(--p-content-hover-background);
  border-color: var(--p-content-border-color);
  cursor: pointer;
}

.kalender-tag.hat-events:hover {
  border-color: var(--p-primary-color);
}

.kalender-tag.heute .tag-nummer {
  background: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
  border-radius: 50%;
  width: 1.6rem;
  height: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.tag-nummer {
  font-size: 0.85rem;
  font-weight: 500;
  width: 1.6rem;
  height: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.event-dots {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  align-items: center;
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--p-primary-color);
  opacity: 0.8;
}

.event-mehr {
  font-size: 0.65rem;
  color: var(--p-text-muted-color);
}

/* Drawer */
.drawer-events {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.drawer-event-card {
  border: 1px solid var(--p-content-border-color);
  border-radius: 10px;
  overflow: hidden;
}

.drawer-event-img {
  width: 100%;
  height: 8rem;
  object-fit: cover;
}

.drawer-event-body {
  padding: 0.85rem;
}

.drawer-event-titel {
  margin: 0.25rem 0 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
}

.drawer-event-meta {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.82rem;
  color: var(--p-text-muted-color);
  margin-bottom: 0.75rem;
}

.drawer-event-meta i {
  margin-right: 0.4rem;
}

.drawer-event-beschreibung {
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>