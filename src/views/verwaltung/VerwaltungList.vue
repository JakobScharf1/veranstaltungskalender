<script setup lang="ts">
import { ProductService } from '@/service/ProductService'
import { SelectChangeEvent } from 'primevue'
import { onMounted, reactive, ref } from 'vue'

const products = ref(null)
const picklistProducts = ref(null)
const orderlistProducts = ref(null)

const sortOptions = reactive([
    { label: 'Titel', key: 'title' },
    { label: 'Erstellungsdatum', key: 'created_at' },
    { label: 'Benutzer', key: 'user' }
])
const sortKey = ref<string>('title')
const sortOrder = ref<number>(1)

function onSortChange(sortEvent: SelectChangeEvent): void {
    console.log('Event', sortEvent)
}

onMounted(() => {
    ProductService.getProductsSmall().then((data) => {
        products.value = data.slice(0, 6)
        picklistProducts.value = [data, []]
        orderlistProducts.value = data
    })
})

function getSeverity(product) {
    switch (product.inventoryStatus) {
        case 'ANSTEHEND':
            return 'success'

        case 'VERGANGEN':
            return 'warning'

        case 'ARCHIVIERT':
            return 'danger'

        default:
            return null
    }
}
</script>

<template>
    <div class="flex flex-col">
        <div class="card">
            <div class="font-semibold text-xl">Veranstaltungen</div>
            <DataView :value="products" paginator :rows="15" :sortOrder="sortOrder" :sortField="sortKey">
                <template #header>
                    <Select v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sortierung" @change="onSortChange($event)" />
                </template>

                <template #list="slotProps">
                    <div class="flex flex-col">
                        <div v-for="(item, index) in slotProps.items" :key="index">
                            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" :class="{ 'border-t border-surface': index !== 0 }">
                                <div class="md:w-40 relative">
                                    <img class="block xl:block mx-auto rounded w-full" :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`" :alt="item.name" />
                                    <Tag :value="item.inventoryStatus" :severity="getSeverity(item)" class="absolute dark:bg-surface-900!" style="left: 4px; top: 4px"></Tag>
                                </div>
                                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                    <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                        <div>
                                            <p class="font-medium text-sm text-surface-500 dark:text-surface-400">
                                                <span class="">KATEGORIE | </span>
                                                <span class="font-small text-xs">Erstellt von USERNAME</span>
                                            </p>
                                            <div class="text-lg font-medium mt-2">TITEL</div>
                                        </div>
                                        <div class="bg-surface-100 p-1" style="border-radius: 30px">
                                            <div
                                                class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2"
                                                style="
                                                    border-radius: 30px;
                                                    box-shadow:
                                                        0px 1px 2px 0px rgba(0, 0, 0, 0.04),
                                                        0px 1px 2px 0px rgba(0, 0, 0, 0.06);
                                                "
                                            >
                                                <span class="text-surface-900 font-medium text-sm">DATUM</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col md:items-end gap-8">
                                        <div class="flex flex-row-reverse md:flex-row gap-2">
                                            <Button icon="pi pi-trash" severity="danger" rounded outlined />
                                            <Button icon="pi pi-pencil" rounded></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
    </div>
</template>
