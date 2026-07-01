<template>
<div class="filter-bar">
    <div class="filter-actions">
      <Popover ref="filterPopover">
        <div class="filter-popover">
          <div v-if="!pendingFilter" class="filter-option-list">
            <p class="filter-popover-title">Filter hinzufügen</p>
            <div
              v-for="opt in availableFilterOptions"
              :key="opt.key"
              class="filter-option-item"
              @click="selectFilter(opt)"
            >
              <i :class="opt.icon"></i>
              <span>{{ opt.label }}</span>
            </div>
            <p v-if="availableFilterOptions.length === 0" class="filter-popover-empty">Alle Filter aktiv</p>
          </div>

          <div v-else class="filter-input-panel">
            <div class="filter-input-header">
              <Button icon="fa-solid fa-arrow-left" text size="small" @click="pendingFilter = null" />
              <span>{{ pendingFilter.label }}</span>
            </div>

            <InputText
              v-if="pendingFilter.type === 'text'"
              v-model="pendingValue"
              :placeholder="pendingFilter.placeholder"
              class="w-full"
              autofocus
              @keydown.enter="applyPendingFilter"
            />

            <div v-else-if="pendingFilter.type === 'daterange'" class="flex flex-column gap-2">
              <label class="filter-input-label">Von</label>
              <DatePicker v-model="pendingValue.von" dateFormat="yy-mm-dd" class="w-full" />
              <label class="filter-input-label">Bis</label>
              <DatePicker v-model="pendingValue.bis" dateFormat="yy-mm-dd" class="w-full" />
            </div>

            <Select
              v-else-if="pendingFilter.type === 'select'"
              v-model="pendingValue"
              :options="pendingFilter.options"
              :placeholder="pendingFilter.placeholder"
              class="w-full"
            />

            <div v-else-if="pendingFilter.type === 'toggle'" class="flex align-items-center gap-3">
              <ToggleSwitch v-model="pendingValue" />
              <span>{{ pendingFilter.placeholder }}</span>
            </div>

            <Button label="Anwenden" class="w-full mt-3" @click="applyPendingFilter" />
          </div>
        </div>
      </Popover>

      <Button
        icon="fa-solid fa-filter"
        :label="isMobile ? undefined : 'Filter'"
        :badge="activeFilterKeys.length > 0 ? String(activeFilterKeys.length) : undefined"
        outlined
        @click="toggleFilterPopover"
      />

      <Button
        v-if="activeFilterKeys.length > 0"
        icon="fa-solid fa-x"
        :label="isMobile ? undefined : 'Zurücksetzen'"
        text
        severity="secondary"
        @click="resetFilters"
      />
    </div>

    <div class="active-filters">
      <Tag
        v-for="key in activeFilterKeys"
        :key="key"
        class="filter-tag"
        rounded
      >
        <span>{{ filterOptions.find(f => f.key === key)?.label }}: <b>{{ formatFilterValue(key) }}</b></span>
        <i class="fa-solid fa-x filter-tag-remove" @click="removeFilter(key)"></i>
      </Tag>
    </div>

  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FilterOption } from '@/types';
import { computed, inject, reactive, ref, watch, type Ref } from 'vue';

const isMobile = inject<Ref<string>>("isMobile")

const filterPopover = ref()
const pendingFilter = ref<FilterOption | null>(null)
const pendingValue = ref<any>(null)
const activeFilters = reactive<Record<string, any>>({})

const activeFilterKeys = computed(() => Object.keys(activeFilters))
const availableFilterOptions = computed(() => filterOptions.filter(opt => !(opt.key in activeFilters)))

const filterOptions: FilterOption[] = [
  { key: 'stadt', label: 'Stadt', icon: 'fa-solid fa-map-pin', type: 'text', placeholder: 'z.B. Berlin', queryParam: 'stadt' },
  { key: 'kategorie', label: 'Kategorie', icon: 'fa-solid fa-tag', type: 'select', placeholder: 'Kategorie wählen', options: ['Festival', 'Konferenz', 'Markt', 'Kultur', 'Sport'], queryParam: 'kategorie' },
  { key: 'kostenlos', label: 'Nur kostenlose Events', icon: 'fa-solid fa-ticket', type: 'toggle', placeholder: 'Kostenlos', queryParam: 'kostenlos' },
  { key: 'datum', label: 'Zeitraum', icon: 'fa-solid fa-calendar', type: 'daterange', queryParam: ['datum_von', 'datum_bis'] },
]

const emit = defineEmits<{
  loadEvents: [Record<string, any>, FilterOption[]]
}>()

function toggleFilterPopover(event: Event) {
  pendingFilter.value = null
  filterPopover.value.toggle(event)
}

function selectFilter(opt: FilterOption) {
  pendingFilter.value = opt
  pendingValue.value = opt.type === 'daterange' ? { von: null, bis: null } : opt.type === 'toggle' ? false : null
}

function applyPendingFilter() {
  if (!pendingFilter.value) return
  activeFilters[pendingFilter.value.key] = pendingValue.value
  pendingFilter.value = null
  filterPopover.value.hide()
}

function removeFilter(key: string) { delete activeFilters[key] }
function resetFilters() { Object.keys(activeFilters).forEach(k => delete activeFilters[k]) }

function formatFilterValue(key: string): string {
  const val = activeFilters[key]
  if (key === 'kostenlos') return val ? 'Ja' : 'Nein'
  if (key === 'datum') {
    const von = val.von ? new Date(val.von).toLocaleDateString('de-DE') : '?'
    const bis = val.bis ? new Date(val.bis).toLocaleDateString('de-DE') : '?'
    return `${von} – ${bis}`
  }
  return String(val)
}

watch(activeFilters, () => emit("loadEvents", activeFilters, filterOptions), { deep: true })

</script>

<style>
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.75rem;
  max-width: 100%;
}

.filter-tag span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.filter-tag-remove {
  font-size: 0.65rem;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.15s;
  flex-shrink: 0;
}

.filter-tag-remove:hover { opacity: 1; }

/* Popover */
.filter-popover {
  min-width: 220px;
  max-width: 90vw;
  padding: 0.25rem;
}

.filter-popover-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--p-text-muted-color);
  margin: 0 0 0.5rem 0.5rem;
}

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

.filter-option-item:hover { background: var(--p-content-hover-background); }

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

@media (max-width: 560px) {
  .filter-bar { gap: 0.5rem; }
}

</style>