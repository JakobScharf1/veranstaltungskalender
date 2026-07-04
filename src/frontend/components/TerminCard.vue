<template>
    <Card class="veranstaltung-card">
        <template #header>
            <div class="card-img-wrapper">
                <img alt="Veranstaltungsbild" :src="item.veranstaltung.picture1 || fallbackImg" @error="onImgError" class="card-img" />
                <div class="card-img-overlay"></div>
                <div class="card-img-title">
                    <span class="card-kategorie">{{ item.veranstaltung.kategorie.name }}</span>
                    <h2 class="card-titel">{{ item.veranstaltung.titel }}</h2>
                </div>
            </div>
        </template>
        <template #subtitle>
            <span class="card-subtitle"> 📍 {{ item.veranstaltung.ort.bezeichnung }}, {{ item.veranstaltung.ort.adresse.ort }} &nbsp;·&nbsp; 📅 {{ item.start }} </span>
        </template>
        <template #content>
            <p class="card-beschreibung">{{ item.veranstaltung.info }}</p>
        </template>
        <template #footer>
            <RouterLink :to="`/termin/${item.id}`">
                <Button label="Mehr erfahren" class="w-full" />
            </RouterLink>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { ITermin } from '@/models/termin';

const fallbackImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='1' height='1' fill='white'/%3E%3C/svg%3E"

const props = defineProps<{
    item: ITermin
}>()

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src = fallbackImg
}
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
    .card-img {
        height: 12rem;
    }
}

.veranstaltung-card:hover .card-img {
    transform: scale(1.03);
}

.card-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.55) 100%);
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
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

@media (max-width: 560px) {
    .card-titel {
        font-size: 1rem;
    }
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
