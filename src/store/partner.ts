import { partnerService, userService } from '@/services/resources'
import type { Partner, PartnerCreatePayload, PartnerUpdatePayload, UserCreatePayload } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/** Partner-Verwaltung (nur Superadmin). Die API bietet hier kein Löschen. */
export const usePartnerStore = defineStore('partner', () => {
    const items = ref<Partner[]>([])
    const loading = ref(false)

    async function load(): Promise<void> {
        loading.value = true
        try {
            items.value = await partnerService.getAll()
        } finally {
            loading.value = false
        }
    }

    async function create(payload: PartnerCreatePayload): Promise<void> {
        await partnerService.create(payload)
        await load()
    }

    async function update(id: number, payload: PartnerUpdatePayload): Promise<void> {
        await partnerService.update(id, payload)
        await load()
    }

    async function createUser(payload: UserCreatePayload): Promise<void> {
        await userService.create(payload)
    }

    return { items, loading, load, create, update, createUser }
})
