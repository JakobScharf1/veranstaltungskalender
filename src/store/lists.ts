import { defineStore } from 'pinia'

export const useListStore = defineStore('lists', {
    state: () => {
        return {
            categories: [
                { key: 'platzhalter', label: 'Platzhalter' }
            ],
        }
    },
    actions: {
        selfReset() {
            this.$reset()
        }
    }
})
