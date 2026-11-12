import { hasErrors } from '@/admin/forms/validation'
import { computed, ref, type Ref } from 'vue'

/**
 * Formularzustand mit Validierung.
 * Fehler werden erst nach dem ersten Absenden angezeigt und danach live aktualisiert.
 */
export function useFormState<TForm, TErrors extends object>(createForm: () => TForm, validate: (form: TForm) => TErrors) {
    const form = ref(createForm()) as Ref<TForm>
    const submitted = ref(false)

    const errors = computed<Partial<TErrors>>(() => (submitted.value ? validate(form.value) : {}))

    function reset(): void {
        form.value = createForm()
        submitted.value = false
    }

    /** Liefert `true`, wenn das Formular gültig ist. */
    function submit(): boolean {
        submitted.value = true
        return !hasErrors(validate(form.value))
    }

    return { form, errors, reset, submit }
}
