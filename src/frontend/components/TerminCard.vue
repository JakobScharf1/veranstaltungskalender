<template>
    <Card class="veranstaltung-card">
        <template #content>
            <div class="card-content">
                <div class="card-topline">
                    <span class="card-kategorie">{{ item.veranstaltung.kategorie?.name }}</span>
                    <span v-if="showDate" class="card-date">📅 {{ formatTerminRange(item) }}</span>
                </div>
                <h2 class="card-titel">{{ item.veranstaltung.titel }}</h2>
                <p class="card-subtitle">📍 {{ item.veranstaltung.ort.bezeichnung }}, {{ item.veranstaltung.ort.adresse.ort }}</p>
                <p class="card-beschreibung">{{ item.veranstaltung.info }}</p>
            </div>
        </template>

        <template #footer>
            <Button as="router-link" :to="detailLink" label="Mehr erfahren" severity="secondary" class="w-full" :aria-label="`Mehr erfahren: ${item.veranstaltung.titel}`" />
        </template>
    </Card>
</template>

<script setup lang="ts">
import type { Termin } from '@/types'
import { formatTerminRange } from '@/utils/date'
import { toUrlFriendly } from '@/utils/url'
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        item: Termin
        /** Datum anzeigen (in der Kalender-Tagesansicht überflüssig) */
        showDate?: boolean
    }>(),
    { showDate: false }
)

const detailLink = computed(() => `/termin/${props.item.id}/${toUrlFriendly(props.item.veranstaltung.titel) || 'termin'}`)
</script>

<style>
.veranstaltung-card {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition:
        box-shadow 0.2s ease,
        transform 0.2s ease;
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

.veranstaltung-card .p-card-content {
    flex: 1;
}

.card-content {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
}

.card-topline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
}

.card-kategorie {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--p-primary-color);
}

.card-date {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--p-text-color);
    background: var(--p-content-hover-background);
    padding: 0.35rem 0.6rem;
    border-radius: 999px;
}

.card-titel {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--p-text-color);
    line-height: 1.3;
}

@media (max-width: 560px) {
    .card-titel {
        font-size: 1rem;
    }
}

.card-subtitle {
    margin: 0;
    font-size: 0.82rem;
    color: var(--p-text-muted-color);
}

.card-beschreibung {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
