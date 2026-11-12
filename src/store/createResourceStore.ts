import type { ResourceService } from '@/services/api/resourceService'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

type StoreService<TEntity, TCreate, TUpdate> = Pick<ResourceService<TEntity, TCreate, TUpdate>, 'getAll' | 'create' | 'update' | 'remove'>

/**
 * Erzeugt einen Pinia-Store, der eine Liste cached und die CRUD-Aktionen kapselt.
 * Da die API nach POST/PUT keinen Datensatz zurückgibt, wird die Liste danach neu geladen.
 */
export function createResourceStore<TEntity extends { id: number }, TCreate, TUpdate = TCreate>(id: string, service: StoreService<TEntity, TCreate, TUpdate>) {
    return defineStore(id, () => {
        // Cast nötig, da `ref` generische Typen sonst als UnwrapRef<T> verliert
        const items = ref([]) as Ref<TEntity[]>
        const loading = ref(false)
        const loaded = ref(false)

        async function load(force = false): Promise<void> {
            if (loaded.value && !force) return

            loading.value = true
            try {
                items.value = await service.getAll()
                loaded.value = true
            } finally {
                loading.value = false
            }
        }

        async function create(payload: TCreate): Promise<void> {
            await service.create(payload)
            await load(true)
        }

        async function update(entityId: number, payload: TUpdate): Promise<void> {
            await service.update(entityId, payload)
            await load(true)
        }

        async function remove(entityId: number): Promise<void> {
            await service.remove(entityId)
            items.value = items.value.filter((item) => item.id !== entityId)
        }

        return { items, loading, load, create, update, remove }
    })
}
