<template>
    <div class="termin-details-page">
        <div v-if="loading" class="loading-state">
            <ProgressSpinner />
            <p>Details werden geladen...</p>
        </div>

        <Message v-else-if="error" severity="error" :closable="false">{{ error }}</Message>

        <div v-else-if="termin" class="detail-shell">
            <Button label="Zurück" icon="pi pi-arrow-left" text class="mb-4" @click="router.back()" />

            <Card class="detail-card">
                <template #header>
                    <div class="hero-image-wrapper">
                        <img :src="termin.veranstaltung?.picture1 || fallbackImg" :alt="termin.veranstaltung?.titel" @error="onImgError" class="hero-image" />
                        <div class="hero-overlay">
                            <div class="hero-content">
                                <div class="hero-badges">
                                    <Tag :value="termin.veranstaltung?.kategorie?.name || 'Kategorie'" rounded />
                                    <Tag v-if="termin.veranstaltung?.kostenlos" value="Eintritt frei" severity="success" rounded />
                                    <Tag v-else value="Kostenpflichtig" severity="warning" rounded />
                                </div>
                                <div class="hero-title-row">
                                    <div>
                                        <h1 class="hero-title">{{ termin.veranstaltung?.titel }}</h1>
                                        <p v-if="termin.veranstaltung?.untertitel" class="hero-subtitle">{{ termin.veranstaltung.untertitel }}</p>
                                    </div>
                                    <div class="hero-date-pill">
                                        <i class="pi pi-calendar"></i>
                                        <span>{{ formatDateRange(termin) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template #content>
                    <div class="detail-grid">
                        <section class="info-section">
                            <h2>Details</h2>
                            <div class="info-list">
                                <div class="info-item">
                                    <i class="pi pi-calendar"></i>
                                    <div>
                                        <strong>Datum</strong>
                                        <span>{{ formatDateRange(termin) }}</span>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <i class="pi pi-map-marker"></i>
                                    <div>
                                        <strong>Ort</strong>
                                        <span>{{ termin.veranstaltung?.ort?.bezeichnung }}, {{ termin.veranstaltung?.ort?.adresse?.ort }}</span>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <i class="pi pi-user"></i>
                                    <div>
                                        <strong>Veranstalter</strong>
                                        <span>{{ termin.veranstaltung?.veranstalter?.bezeichnung || 'Nicht angegeben' }}</span>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <i class="pi pi-ticket"></i>
                                    <div>
                                        <strong>Eintritt</strong>
                                        <span>{{ termin.veranstaltung?.kostenlos ? 'Kostenlos' : 'Kostenpflichtig' }}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="info-section">
                            <h2>Beschreibung</h2>
                            <p class="description-text">{{ termin.veranstaltung?.info || 'Für diese Veranstaltung ist noch keine Beschreibung verfügbar.' }}</p>

                            <Divider />

                            <h3>Weitere Termine dieser Veranstaltung</h3>
                            <div v-if="relatedTermine.length" class="related-list">
                                <Card v-for="item in relatedTermine" :key="item.id" class="related-card">
                                    <template #content>
                                        <div class="related-card-content">
                                            <div>
                                                <strong>{{ formatDateRange(item) }}</strong>
                                                <p>{{ item.veranstaltung?.ort?.bezeichnung }}</p>
                                            </div>
                                            <RouterLink :to="`/termin/${item.id}`">
                                                <Button label="Details" size="small" text />
                                            </RouterLink>
                                        </div>
                                    </template>
                                </Card>
                            </div>
                            <p v-else class="muted-text">Für diese Veranstaltung gibt es derzeit keine weiteren Termine.</p>
                        </section>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ITermin } from '@/models/termin'
import { ApiService } from '@/services/APIService'
import { dateToString } from '@/services/Helper'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const fallbackImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='1' height='1' fill='white'/%3E%3C/svg%3E"

const route = useRoute()
const router = useRouter()

const termin = ref<ITermin | null>(null)
const relatedTermine = ref<ITermin[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const terminId = computed(() => String(route.params.id))

function onImgError(e: Event) {
    const target = e.target as HTMLImageElement
    target.src = fallbackImg
}

function normalizeTermin(item: ITermin): ITermin {
    return {
        ...item,
        start: item.start ? dateToString(item.start) : '',
        ende: item.ende ? dateToString(item.ende) : undefined
    }
}

function formatDateRange(item: ITermin): string {
    if (!item.start) return 'Unbekannt'

    const startDate = item.start ? dateToString(item.start) : 'Unbekannt'
    const endDate = item.ende ? dateToString(item.ende) : undefined

    if (item.allday) {
        if (endDate && endDate !== startDate) {
            return `${startDate} – ${endDate} · Ganztägig`
        }
        return `${startDate} · Ganztägig`
    }

    if (!endDate || endDate === startDate) {
        return startDate
    }

    const startTime = typeof item.start === 'string' && item.start.includes('T') ? item.start.split('T')[1]?.slice(0, 5) : undefined
    const endTime = typeof item.ende === 'string' && item.ende.includes('T') ? item.ende.split('T')[1]?.slice(0, 5) : undefined

    if (startTime && endTime && startDate === endDate) {
        return `${startDate} · ${startTime} – ${endTime}`
    }

    return `${startDate} – ${endDate}`
}

async function loadTerminDetails() {
    loading.value = true
    error.value = null

    try {
        const response = await ApiService.get<ITermin[]>('/termine')
        const allTermine = response.map(normalizeTermin)
        const selected = allTermine.find((item) => String(item.id) === terminId.value)

        if (!selected) {
            error.value = 'Der angeforderte Termin konnte nicht gefunden werden.'
            termin.value = null
            relatedTermine.value = []
            return
        }

        termin.value = selected

        if (selected.veranstaltung?.id) {
            ApiService.get<ITermin[]>('/termine?veranstaltung=' + selected.veranstaltung.id)
                .then((response) => (relatedTermine.value = response.filter((item) => item.id !== selected.id)))
                .catch(() => {
                    error.value = 'Die verwandten Termine konnten nicht geladen werden.'
                    relatedTermine.value = []
                })
        } else {
            relatedTermine.value = []
        }
    } catch {
        error.value = 'Die Termin-Details konnten nicht geladen werden.'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    void loadTerminDetails()
})

watch(terminId, () => {
    void loadTerminDetails()
})
</script>

<style scoped>
.termin-details-page {
    padding: 1.5rem;
}

.detail-shell {
    display: flex;
    flex-direction: column;
}

.detail-card {
    overflow: hidden;
}

.hero-image-wrapper {
    position: relative;
    min-height: 16rem;
}

.hero-image {
    width: 100%;
    height: 16rem;
    object-fit: cover;
    display: block;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.62) 0%, rgba(0, 0, 0, 0.22) 100%);
    display: flex;
    align-items: flex-end;
}

.hero-image-wrapper:not(:has(img[src]:not([src='']))) .hero-overlay,
.hero-image-wrapper:has(img[src='']) .hero-overlay,
.hero-image-wrapper:has(img[onerror]) .hero-overlay {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.14) 100%);
}

.hero-content {
    padding: 2rem;
    color: white;
    max-width: 60rem;
}

.hero-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.hero-title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1rem;
}

.hero-title {
    margin: 0;
    font-size: clamp(1.6rem, 2.2vw, 2.4rem);
    line-height: 1.2;
    color: white;
}

.hero-subtitle {
    margin: 0.5rem 0 0;
    font-size: 1rem;
    opacity: 0.9;
}

.hero-date-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.6rem 0.9rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(8px);
    color: white;
    font-weight: 600;
    white-space: nowrap;
}

.detail-grid {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 1.5rem;
    padding: 1.25rem 0 0;
}

.info-section {
    background: var(--p-content-background);
    border: 1px solid var(--p-content-border-color);
    border-radius: 12px;
    padding: 1.25rem;
}

.info-section h2,
.info-section h3 {
    margin-top: 0;
    margin-bottom: 1rem;
}

.info-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
}

.info-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}

.info-item i {
    margin-top: 0.2rem;
    color: var(--p-primary-color);
}

.info-item strong,
.info-item span {
    display: block;
}

.info-item span {
    color: var(--p-text-muted-color);
    margin-top: 0.2rem;
}

.description-text {
    line-height: 1.7;
    margin: 0;
}

.related-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.related-card {
    border: 1px solid var(--p-content-border-color);
}

.related-card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.related-card-content p {
    margin: 0.25rem 0 0;
    color: var(--p-text-muted-color);
}

.muted-text {
    color: var(--p-text-muted-color);
    margin: 0;
}

@media (max-width: 900px) {
    .detail-grid {
        grid-template-columns: 1fr;
    }

    .hero-title-row {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
