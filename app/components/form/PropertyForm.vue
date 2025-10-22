<template>
  <UForm
    ref="formRef"
    :schema="schema"
    :state="state"
    class="space-y-4 w-full"
    @submit="handleSubmit"
  >
    <UFormField 
      name="name" 
      :label="t('dashboard.content_area.property_name')" 
      required
    >
      <UInput
        v-model="state.name"
        :placeholder="t('dashboard.content_area.property_name_desc')"
        class="w-full"
        size="xl"
      />
    </UFormField>

    <UFormField 
      name="address" 
      :label="t('dashboard.content_area.property_address')" 
      required
    >
      <UInput
        v-model="state.address"
        :placeholder="t('dashboard.content_area.property_address_desc')"
        class="w-full"
        size="xl"
      />
    </UFormField>

    <UFormField 
      name="city" 
      :label="t('dashboard.content_area.property_city')" 
      required
    >  
      <UInput
        v-model="state.city"
        :placeholder="t('dashboard.content_area.property_city_desc')"
        class="w-full"
        size="xl"
      />
    </UFormField>

    <UFormField 
      name="description" 
      :label="t('dashboard.content_area.property_description')"
    >
      <UTextarea
        v-model="state.description"
        :placeholder="t('dashboard.content_area.property_description_desc')"
        class="w-full"
        size="xl"
      />
    </UFormField>

    <UFormField 
      name="props_image" 
      :label="t('dashboard.content_area.property_img')"
    >
      <UFileUpload
        v-model="state.props_image"
        icon="i-lucide-image"
        :multiple="false"
        :label="t('dashboard.content_area.property_img_label')"
        :description="t('dashboard.content_area.property_img_desc')"
        
        class="w-full min-h-48"
        accept="image/*"
        variant="area"
        highlight
      />
    </UFormField>

    <div class="flex justify-end pt-4">
      <UButton type="submit" color="primary"  v-if="showNextButton" trailing-icon="i-lucide-arrow-right" size="lg">{{ t("dashboard.content_area.next_btn") }}</UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import type { Form } from '@nuxt/ui'
import { propertySchema, type PropertySchema } from '~/schemas/property.schema'

const { t } = useI18n({ useScope: "global" });

const props = defineProps<{
  modelValue?: PropertySchema;
   showNextButton?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: PropertySchema): void;
  (e: "next"): void;
}>();

const schema = propertySchema(t);
const state = reactive<PropertySchema>({
  name: props.modelValue?.name ?? "",
  address: props.modelValue?.address ?? "",
  city: props.modelValue?.city ?? "",
  description: props.modelValue?.description ?? "",
  props_image: props.modelValue?.props_image ? markRaw(props.modelValue.props_image) : undefined,
});

const formRef = ref<Form<PropertySchema> | null>(null);

watch(
  () => state,
  (val) => emit("update:modelValue", val),
  { deep: true }
)


const handleSubmit = async () => {
  const result = await formRef.value?.validate();
  if (!result) return;

 emit("update:modelValue", state)
  emit("next");
};
</script>
