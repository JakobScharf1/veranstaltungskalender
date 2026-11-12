<script setup lang="ts">
import FormField from './FormField.vue'

withDefaults(
    defineProps<{
        id: string
        label: string
        icon: string
        type?: 'text' | 'url' | 'email' | 'tel'
        placeholder?: string
        hint?: string
    }>(),
    { type: 'text', placeholder: undefined, hint: undefined }
)

const model = defineModel<string>({ required: true })
</script>

<template>
    <FormField :id="id" :label="label" :hint="hint">
        <InputGroup>
            <InputGroupAddon>
                <i :class="icon" aria-hidden="true" />
            </InputGroupAddon>
            <InputText :id="id" v-model.trim="model" :type="type" :placeholder="placeholder" :aria-describedby="hint ? `${id}-hint` : undefined" fluid />
        </InputGroup>
    </FormField>
</template>
