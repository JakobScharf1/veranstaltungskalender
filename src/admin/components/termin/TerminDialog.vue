<script setup lang="ts">
import FormDialog from '@/admin/components/common/FormDialog.vue'
import FormField from '@/admin/components/common/FormField.vue'
import { toEreignisOption } from '@/admin/config/options'
import { useFormState } from '@/admin/composables/useFormState'
import { createTerminForm, validateTerminForm } from '@/admin/forms/terminForm'
import { useEreignisseStore } from '@/store/resources'
import type { Termin, TerminForm } from '@/types'
import { computed, onMounted, watch } from 'vue'

const props = withDefaults(
    defineProps<{
        item: Termin | null
        saving: boolean
        /** Vorauswahl der Veranstaltung beim Anlegen */
        veranstaltungId?: number | null
    }>(),
    { veranstaltungId: null }
)

const visible = defineModel<boolean>('visible', { required: true })

/** Gibt den validierten Formularzustand zurück; das Payload hängt vom Modus (POST/PUT) ab. */
const emit = defineEmits<{
    save: [form: TerminForm]
}>()

const ereignisseStore = useEreignisseStore()
const ereignisOptions = computed(() => ereignisseStore.items.map(toEreignisOption))

const isEdit = computed(() => props.item !== null)

const { form, errors, reset, submit } = useFormState(
    () => createTerminForm(props.item, props.veranstaltungId),
    (terminForm) => validateTerminForm(terminForm, isEdit.value)
)

onMounted(() => {
    void ereignisseStore.load()
})

watch(visible, (isOpen) => {
    if (isOpen) reset()
})

function onSubmit(): void {
    if (submit()) {
        emit('save', form.value)
    }
}
</script>

<template>
    <FormDialog v-model:visible="visible" :header="item ? 'Termin bearbeiten' : 'Termin anlegen'" :saving="saving" @submit="onSubmit">
        <FormField id="termin-veranstaltung" label="Veranstaltung" required :error="errors.veranstaltung">
            <Select
                v-model="form.veranstaltung"
                input-id="termin-veranstaltung"
                :options="ereignisOptions"
                option-label="label"
                option-value="value"
                :loading="ereignisseStore.loading"
                :invalid="!!errors.veranstaltung"
                :virtual-scroller-options="{ itemSize: 38 }"
                filter
                placeholder="Veranstaltung wählen"
                fluid
            />
        </FormField>

        <div class="flex items-center gap-3">
            <ToggleSwitch v-model="form.allday" input-id="termin-allday" />
            <label for="termin-allday">Ganztägig</label>
        </div>

        <div class="flex flex-col md:flex-row gap-4">
            <FormField class="md:flex-1" id="termin-start" label="Beginn" required :error="errors.start">
                <DatePicker
                    v-model="form.start"
                    input-id="termin-start"
                    :show-time="!form.allday"
                    hour-format="24"
                    date-format="dd.mm.yy"
                    :invalid="!!errors.start"
                    show-icon
                    fluid
                />
            </FormField>

            <FormField class="md:flex-1" id="termin-ende" label="Ende" :required="isEdit" :error="errors.ende">
                <DatePicker
                    v-model="form.ende"
                    input-id="termin-ende"
                    :show-time="!form.allday"
                    :min-date="form.start ?? undefined"
                    hour-format="24"
                    date-format="dd.mm.yy"
                    :invalid="!!errors.ende"
                    show-icon
                    :show-button-bar="!isEdit"
                    fluid
                />
            </FormField>
        </div>

        <FormField id="termin-info" label="Hinweise zu diesem Termin">
            <Textarea id="termin-info" v-model="form.info" rows="3" autoResize fluid />
        </FormField>
    </FormDialog>
</template>
