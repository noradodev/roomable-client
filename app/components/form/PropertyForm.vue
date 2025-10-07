<template>
  <UForm
    ref="formRef"
    :schema="schema"
    :state="state"
    class="space-y-4 w-full"
    @submit="handleSubmit"
  >
    <UFormField name="name" label="Property Name" required>
      <UInput
        v-model="state.name"
        placeholder="e.g. Sunrise Apartment"
        class="w-full"
        size="xl"
      />
    </UFormField>

    <UFormField name="address" label="Address" required>
      <UInput
        v-model="state.address"
        placeholder="Street, Number..."
        class="w-full"
        size="xl"
      />
    </UFormField>

    <UFormField name="city" label="City" required>
      <UInput
        v-model="state.city"
        placeholder="e.g. Phnom Penh"
        class="w-full"
        size="xl"
      />
    </UFormField>

    <UFormField name="description" label="Description">
      <UTextarea
        v-model="state.description"
        placeholder="Optional description"
        class="w-full"
        size="xl"
      />
    </UFormField>

    <UFormField name="props_image" label="Property Image">
      <UFileUpload
        v-model="state.props_image"
        icon="i-lucide-image"
        label="Drop your image here"
        description="PNG, JPG, JPEG, or WebP (max. 2MB)"
        class="w-full min-h-48"
        accept="image/*"
        variant="area"
        highlight
      />
    </UFormField>

    <div class="flex justify-end pt-4">
      <UButton type="submit" color="primary" size="lg">Next</UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import type { Form } from '@nuxt/ui'
import { propertySchema, type PropertySchema } from '~/schemas/property.schema'

const props = defineProps<{
  modelValue?: PropertySchema
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: PropertySchema): void
  (e: 'next'): void
}>()

const schema = propertySchema
const state = reactive<PropertySchema>({
  name: props.modelValue?.name ?? '',
  address: props.modelValue?.address ?? '',
  city: props.modelValue?.city ?? '',
  description: props.modelValue?.description ?? '',
  props_image: props.modelValue?.props_image ?? undefined
})

const formRef = ref<Form<PropertySchema> | null>(null)

watch(
  () => state,
  (val) => {
    emit('update:modelValue', JSON.parse(JSON.stringify(val)))
  },
  { deep: true }
)

const handleSubmit = async () => {
  const result = await formRef.value?.validate()
  if (!result) return

  emit('update:modelValue', JSON.parse(JSON.stringify(state)))
  emit('next')
}
</script>
