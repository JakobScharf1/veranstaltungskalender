<template>
  <div class="filter-bar">
    <div class="filter-actions">
      <Popover ref="filterPopover">
        <div class="filter-popover">
          <div v-if="!pendingFilter" class="filter-option-list">
            <template v-if="activeFilterKeys.length > 0">
              <p class="filter-popover-title">Aktive Filter</p>
              <div v-for="key in activeFilterKeys" :key="key" class="filter-option-item filter-option-item--active">
                <button type="button" class="filter-option-item-main" @click="selectFilter(getOption(key))">
                  <i :class="getOption(key).icon" aria-hidden="true"></i>
                  <span class="filter-option-item-text">
                    <span class="filter-option-item-label">{{ getOption(key).label }}</span>
                    <span class="filter-option-item-value">{{ formatFilterValue(key) }}</span>
                  </span>
                </button>
                <button
                  type="button"
                  class="filter-option-item-remove"
                  :aria-label="`Filter ${getOption(key).label} entfernen`"
                  @click="removeFilter(key)"
                >
                  <i class="fa-solid fa-x" aria-hidden="true"></i>
                </button>
              </div>
            </template>

            <template v-if="availableFilterOptions.length > 0">
              <p class="filter-popover-title">Filter hinzufügen</p>
              <button
                v-for="opt in availableFilterOptions"
                :key="opt.key"
                type="button"
                class="filter-option-item filter-option-item-main"
                @click="selectFilter(opt)"
              >
                <i :class="opt.icon" aria-hidden="true"></i>
                <span>{{ opt.label }}</span>
              </button>
            </template>

            <p v-if="availableFilterOptions.length === 0" class="filter-popover-empty">Alle Filter aktiv</p>
          </div>

          <form v-else class="filter-input-panel" @submit.prevent="applyPendingFilter">
            <div class="filter-input-header">
              <Button icon="fa-solid fa-arrow-left" text size="small" aria-label="Zurück zur Filterauswahl" @click="pendingFilter = null" />
              <label :for="pendingInputId">{{ pendingFilter.label }}</label>
            </div>

            <InputText
              v-if="pendingFilter.type === 'text'"
              :id="pendingInputId"
              v-model="pendingText"
              :placeholder="pendingFilter.placeholder"
              class="w-full"
              autofocus
            />

            <Select
              v-else-if="pendingFilter.type === 'select'"
              v-model="pendingKategorie"
              :input-id="pendingInputId"
              :options="kategorienStore.items"
              option-label="name"
              option-value="id"
              append-to="self"
              :placeholder="pendingFilter.placeholder"
              class="w-full"
            />

            <div v-else-if="pendingFilter.type === 'toggle'" class="flex align-items-center gap-3">
              <ToggleSwitch v-model="pendingToggle" :input-id="pendingInputId" />
              <span>{{ pendingFilter.placeholder }}</span>
            </div>

            <div class="filter-input-actions">
              <Button
                v-if="pendingFilter.key in activeFilters"
                label="Entfernen"
                text
                severity="danger"
                @click="removePendingFilter"
              />
              <Button type="submit" label="Anwenden" class="flex-1" />
            </div>
          </form>
        </div>
      </Popover>

      <Button
        icon="fa-solid fa-filter"
        :label="isMobile ? undefined : 'Filter'"
        :aria-label="isMobile ? 'Filter' : undefined"
        :badge="activeFilterKeys.length > 0 ? String(activeFilterKeys.length) : undefined"
        aria-haspopup="dialog"
        outlined
        @click="toggleFilterPopover"
      />

      <Button
        v-if="activeFilterKeys.length > 0"
        icon="fa-solid fa-x"
        :label="isMobile ? undefined : 'Zurücksetzen'"
        :aria-label="isMobile ? 'Filter zurücksetzen' : undefined"
        text
        severity="secondary"
        @click="resetFilters"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IS_MOBILE } from '@/frontend/keys'
import { useKategorienStore } from '@/store/resources'
import type { FilterOption, TerminFilter, TerminFilterKey } from '@/types'
import Popover from 'primevue/popover'
import { computed, inject, onMounted, ref, useTemplateRef, watch } from 'vue'

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'titel', label: 'Titel', icon: 'fa-solid fa-font', type: 'text', placeholder: 'z.B. Konzert' },
  { key: 'ort', label: 'Stadt', icon: 'fa-solid fa-map-pin', type: 'text', placeholder: 'z.B. Wanfried' },
  { key: 'kategorie', label: 'Kategorie', icon: 'fa-solid fa-tag', type: 'select', placeholder: 'Kategorie wählen' },
  { key: 'kostenlos', label: 'Nur kostenlose Events', icon: 'fa-solid fa-ticket', type: 'toggle', placeholder: 'Kostenlos' }
]

const emit = defineEmits<{
  change: [filter: TerminFilter]
}>()

const isMobile = inject(IS_MOBILE, ref(false))
const kategorienStore = useKategorienStore()

const filterPopover = useTemplateRef<InstanceType<typeof Popover>>('filterPopover')
const pendingFilter = ref<FilterOption | null>(null)
const pendingText = ref('')
const pendingKategorie = ref<number | null>(null)
const pendingToggle = ref(true)
const activeFilters = ref<TerminFilter>({})

const pendingInputId = computed(() => `filter-${pendingFilter.value?.key ?? ''}`)
const activeFilterKeys = computed(() => Object.keys(activeFilters.value) as TerminFilterKey[])
const availableFilterOptions = computed(() => FILTER_OPTIONS.filter((opt) => !(opt.key in activeFilters.value)))

onMounted(() => {
  void kategorienStore.load()
})

watch(activeFilters, () => emit('change', activeFilters.value))

function getOption(key: TerminFilterKey): FilterOption {
  return FILTER_OPTIONS.find((opt) => opt.key === key) ?? FILTER_OPTIONS[0]
}

function toggleFilterPopover(event: Event): void {
  pendingFilter.value = null
  filterPopover.value?.toggle(event)
}

/** Öffnet die Eingabe eines Filters und belegt sie mit dem aktiven Wert vor. */
function selectFilter(opt: FilterOption): void {
  const current = activeFilters.value
  pendingFilter.value = opt
  pendingText.value = (opt.key === 'titel' ? current.titel : current.ort) ?? ''
  pendingKategorie.value = current.kategorie ?? null
  pendingToggle.value = current.kostenlos ?? true
}

/** Entfernt Schlüssel ohne Wert, damit nur gesetzte Filter als aktiv gelten. */
function withoutEmptyValues(filter: TerminFilter): TerminFilter {
  const entries = Object.entries(filter).filter(([, value]) => value !== undefined && value !== '' && value !== false)
  return Object.fromEntries(entries) as TerminFilter
}

function applyPendingFilter(): void {
  const filter = pendingFilter.value
  if (!filter) return

  const next: TerminFilter = { ...activeFilters.value }

  switch (filter.key) {
    case 'titel':
      next.titel = pendingText.value.trim()
      break
    case 'ort':
      next.ort = pendingText.value.trim()
      break
    case 'kategorie':
      next.kategorie = pendingKategorie.value ?? undefined
      break
    case 'kostenlos':
      next.kostenlos = pendingToggle.value
      break
  }

  activeFilters.value = withoutEmptyValues(next)
  pendingFilter.value = null
  filterPopover.value?.hide()
}

function removeFilter(key: TerminFilterKey): void {
  const next: TerminFilter = { ...activeFilters.value }
  delete next[key]
  activeFilters.value = next
}

function removePendingFilter(): void {
  if (!pendingFilter.value) return
  removeFilter(pendingFilter.value.key)
  pendingFilter.value = null
  filterPopover.value?.hide()
}

function resetFilters(): void {
  activeFilters.value = {}
}

function formatFilterValue(key: TerminFilterKey): string {
  const filter = activeFilters.value

  switch (key) {
    case 'kostenlos':
      return 'Ja'
    case 'kategorie':
      return kategorienStore.items.find((kategorie) => kategorie.id === filter.kategorie)?.name ?? ''
    case 'titel':
      return filter.titel ?? ''
    case 'ort':
      return filter.ort ?? ''
  }
}
</script>

<style>
.filter-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* Popover */
.filter-popover {
  min-width: 240px;
  max-width: 90vw;
  padding: 0.25rem;
}

.filter-popover-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--p-text-muted-color);
  margin: 0.75rem 0 0.5rem 0.5rem;
}

.filter-popover-title:first-child { margin-top: 0; }

.filter-popover-empty {
  font-size: 0.85rem;
  color: var(--p-text-muted-color);
  text-align: center;
  padding: 0.5rem;
}

.filter-option-list {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.filter-option-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.15s;
}

.filter-option-item-main {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  padding: 0;
}

button.filter-option-item {
  width: 100%;
  padding: 0.55rem 0.75rem;
}

.filter-option-item:hover { background: var(--p-content-hover-background); }

.filter-option-item-main:focus-visible,
.filter-option-item-remove:focus-visible {
  outline: 2px solid var(--p-primary-color);
  outline-offset: 2px;
  border-radius: 4px;
}

.filter-option-item--active {
  background: var(--p-highlight-background, var(--p-primary-50));
}

.filter-option-item-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.filter-option-item-label {
  font-size: 0.85rem;
}

.filter-option-item-value {
  font-size: 0.78rem;
  color: var(--p-text-muted-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.filter-option-item-remove {
  border: none;
  background: transparent;
  color: inherit;
  font-size: 0.65rem;
  cursor: pointer;
  opacity: 0.5;
  padding: 0.35rem;
  flex-shrink: 0;
  transition: opacity 0.15s;
}

.filter-option-item-remove:hover { opacity: 1; }

.filter-input-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.filter-input-label {
  font-size: 0.8rem;
  color: var(--p-text-muted-color);
}

.filter-input-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

@media (max-width: 560px) {
  .filter-bar { gap: 0.5rem; }
}

</style>
