<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        :title="t('dashboard.sidebar.properties')"
        toggle-side="right"
        :toggle="{
          color: 'primary',
          variant: 'soft',
          class: 'rounded-full',
        }"
        class="bg-white"
      >
        <template #right>
          <UInput
            color="primary"
            variant="soft"
            :placeholder="t('dashboard.content_area.search_property')"
            icon="i-lucide-search"
            class="w-56"
            size="lg"
          />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div
        class="properties-wrapper bg-white p-4 sm:pt-2 sm:p-6 shadow min-h-dvh"
      >
        <div class="flex justify-end items-center my-4">
          <div class="filter-action">
            <USelect
              v-model="value"
              icon="i-lucide-building-2"
              size="lg"
              :items="items"
              class="w-48 bg-white shadow"
            />
          </div>
          <div class="add-action">
            <UModal
              :title="t('dashboard.content_area.add_property')"
              :description="t('dashboard.content_area.add_property_desc')"
              :ui="{ content: 'sm:max-w-4xl' }"
              class="duration-400 transition-all"
            >
              <UButton
              v-model:open="isAddOpen"
                :label="t('dashboard.content_area.add_property')"
                color="primary"
                variant="outline"
                class="ml-2"
                size="lg"
                icon="i-lucide-plus"
              />

              <template #body>
                <UStepper
                  ref="stepper"
                  v-model="currentStep"
                  :items="createPropertiesStepper"
                  disabled
                  :ui="{ title: 'font-bold' }"
                >
                  <template #property>
                    <PropertyForm
                      v-model="formData.property"
                      @next="!stepper?.next()"
                      :show-next-button="true"
                    />
                  </template>

                  <template #rooms>
                    <FormRoomForm
                      v-model="formData.roomSetup"
                      @next="!stepper?.next()"
                      @back="!stepper?.prev()"
                    />
                  </template>

                  <template #review>
                    <div class="p-4 space-y-2">
                      <FormFinalSammorize
                        :property="formData.property"
                        :room-setup="formData.roomSetup"
                        v-model:currentStep="currentStep"
                      />
                      <div class="flex justify-end items-center space-x-2 mt-4">
                        <UButton
                          color="primary"
                          variant="soft"
                          @click="!stepper?.prev()"
                        >
                          {{ t("dashboard.content_area.back_btn") }}
                        </UButton>
                        <UButton color="primary" @click="handleSubmit" :loading="loading">
                          {{ t("dashboard.content_area.create_property") }}
                        </UButton>
                      </div>
                    </div>
                  </template>
                </UStepper>
              </template>
            </UModal>
          </div>
        </div>
        <div v-if="loading">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <div
              v-for="i in 4"
              :key="i"
              class="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div class="space-y-3">
                <div class="flex justify-end">
                  <USkeleton class="w-3 h-3 rounded-full" />
                </div>

                <div class="flex items-center space-x-2">
                  <USkeleton class="w-4 h-4 rounded" />
                  <USkeleton class="w-16 h-5 rounded" />
                </div>

                <div class="flex items-center space-x-2">
                  <USkeleton class="w-4 h-4 rounded" />
                  <USkeleton class="w-20 h-4 rounded" />
                </div>

                <div class="flex items-center space-x-2">
                  <USkeleton class="w-4 h-4 rounded" />
                  <USkeleton class="w-24 h-5 rounded" />
                </div>

                <USkeleton class="w-16 h-6 rounded-full" />

                <div class="flex space-x-2 pt-2">
                  <USkeleton class="w-8 h-8 rounded-lg" />
                  <USkeleton class="w-8 h-8 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else-if="allProperties.length > 0"
          class="property-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <!-- :status-color="property.statusColor as 'success' | 'error'" -->
          <CommonPropertyCard
            v-for="property in properties"
            :key="property.id"
            :uuid="property.id"
            :image="property.image_url"
            :location="property.address + ' , ' + property.city"
            :status-text="property.is_active"
            :rooms-remaining="property.renting_rooms"
            :total-rooms="property.total_rooms"
            @edit="() => handleEdit(property.id)"
            @delete="() => handleDelete(property.id)"
          />
        </div>
        <div
          v-else
          class="no-props flex flex-col items-center justify-center text-center py-16 px-4 rounded-2xl"
        >
          <UIcon
            name="i-lucide-building-2"
            class="text-5xl text-gray-400 mb-4"
          />
          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            {{ t("dashboard.content_area.no_property") }}
          </h3>
          <p class="text-gray-500 text-sm mb-6 max-w-sm">
            {{ t("dashboard.content_area.no_property_desc") }}
          </p>
        </div>
      </div>
     <UModal
  v-model:open="isEditModalOpen"
  class="max-w-2xl"
  :title="t('dashboard.content_area.edit_property')"
>
  <template #body>
    <PropertyForm v-model="formData.property" :show-next-button="false" />
  </template>

  <template #footer>
    <div class="flex justify-end space-x-2">
      <UButton variant="ghost" @click="isEditModalOpen = false">
        {{ t("dashboard.content_area.cancel_btn") }}
      </UButton>
      <UButton color="primary" @click="handleUpdateProperty">
        {{ t("dashboard.content_area.save_btn") }}
      </UButton>
    </div>
  </template>
</UModal>
      <UModal v-model:open="isDeleteModalOpen" class="max-w-md bg-white">
        <template #content>
          <div class="p-6 text-center">
            <div
              class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100"
            >
              <UIcon name="i-lucide-trash" class="h-6 w-6 text-red-600" />
            </div>

            <h2 class="mt-4 text-xl font-semibold text-gray-900">
              {{ t("dashboard.content_area.delete_property") }}
            </h2>

            <p class="mt-2 text-sm text-gray-500">
              {{ t("dashboard.content_area.delete_property_desc1") }}
              <span class="font-medium text-gray-800"
                >#{{ selectedPropertyId }}</span
              >{{ t("dashboard.content_area.delete_property_desc2") }}
            </p>

            <div class="mt-6 flex gap-2 sm:flex-row sm:justify-center">
              <UButton
                variant="ghost"
                @click="isDeleteModalOpen = false"
                size="md"
              >
                {{ t("dashboard.content_area.cancel_btn") }}
              </UButton>

              <UButton
                color="error"
                icon="i-lucide-trash"
                size="md"
                @click="deleteProperty"
                :loading="loading"
              >
                {{ t("dashboard.content_area.delete_btn") }}
              </UButton>
            </div>
          </div>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
const { t } = useI18n();
const stepper = useTemplateRef("stepper");
import type { StepperItem } from "@nuxt/ui";
import PropertyForm from "~/components/form/PropertyForm.vue";
import type { PropertySchema } from "~/schemas/property.schema";
import type { RoomSetupSchema } from "~/schemas/room.schema";

const toast = useToast();
const currentStep = ref(0);
const items = ref([
  t("dashboard.content_area.latest_property"),
  t("dashboard.content_area.all_properties"),
]);
const value = ref(items.value[0]);
const isAddOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedPropertyId = ref<string | null>(null);
const imageFile = ref<File | null>(null);
const store = usePropertyStore();
const { properties, allProperties, loading } = storeToRefs(store);

const createPropertiesStepper = ref(<StepperItem[]>[
  {
    title: t("dashboard.content_area.property_info"),
    slot: "property" as const,
    description: t("dashboard.content_area.property_info_desc"),
    icon: "i-lucide-building-2",
  },
  {
    title: t("dashboard.content_area.room_setup"),
    slot: "rooms" as const,
    description: t("dashboard.content_area.room_setup_desc"),
    icon: "i-lucide-bed",
  },
  {
    title: t("dashboard.content_area.review_finish"),
    slot: "review" as const,
    description: t("dashboard.content_area.review_finish_desc"),
    icon: "i-lucide-check-circle",
  },
]);
const formData = reactive<{
  property: PropertySchema;
  roomSetup: RoomSetupSchema;
}>({
  property: {
    name: "",
    address: "",
    city: "",
    description: "",
    props_image: undefined,
  },
  roomSetup: {
    floors: [],
  },
});
function handleEdit(propertyId: string) {
  const property = allProperties.value.find(p => p.id === propertyId);
  if (!property) return;

  formData.property = {
    name: property.name,
    address: property.address,
    city: property.city,
    description: property.description ?? "",
    props_image: undefined, 
  };

  selectedPropertyId.value = propertyId;
  isEditModalOpen.value = true;
}
function handleDelete(propertyId: string) {
  selectedPropertyId.value = propertyId;
  isDeleteModalOpen.value = true;
}
async function handleSubmit() {
  try {
    const formDataToSend = new FormData();

    formDataToSend.append("property[name]", formData.property.name);
    formDataToSend.append("property[address]", formData.property.address);
    formDataToSend.append("property[city]", formData.property.city);
    formDataToSend.append("property[description]", formData.property.description ?? "");

    if (formData.property.props_image) {
      formDataToSend.append(
        "props_image",
        formData.property.props_image as File
      );
    }

    formData.roomSetup.floors.forEach((floor, fIndex) => {
      formDataToSend.append(`roomSetup[floors][${fIndex}][name]`, floor.name);
      formDataToSend.append(`roomSetup[floors][${fIndex}][number]`, String(floor.number));

      floor.rooms.forEach((room, rIndex) => {
        formDataToSend.append(`roomSetup[floors][${fIndex}][rooms][${rIndex}][roomNumber]`, room.roomNumber);
        formDataToSend.append(`roomSetup[floors][${fIndex}][rooms][${rIndex}][type]`, room.type);
        formDataToSend.append(`roomSetup[floors][${fIndex}][rooms][${rIndex}][price]`, String(room.price));
      });
    });

    await store.createProperty(formDataToSend);

    toast.add({
      title: "Success",
      description: "Property created successfully",
      color: "success",
    });
    isAddOpen.value = false;
    store.fetchProperties();
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.data ?? "Unknown error",
      color: "error",
    });
    console.error("Error creating property:", error);
  }
}
async function handleUpdateProperty() {
  if (!selectedPropertyId.value) return;

  try {
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.property.name);
    formDataToSend.append("address", formData.property.address);
    formDataToSend.append("city", formData.property.city);
    formDataToSend.append(
      "description",
      formData.property.description ?? ""
    );

    if (formData.property.props_image) {
      formDataToSend.append(
        "props_image",
        formData.property.props_image as File
      );
    }
    formDataToSend.append("_method", "PUT");
    await store.updateProperty(selectedPropertyId.value, formDataToSend);

    toast.add({
      title: "Success",
      description: "Property updated successfully",
      color: "success",
    });

    isEditModalOpen.value = false;
    store.fetchProperties();
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.data ?? "Unknown error",
      color: "error",
    });
    console.error("Error updating property:", error);
  }
}


async function deleteProperty() {
  if (!selectedPropertyId.value) return;
  try {
    store.deleteProperty(selectedPropertyId.value);
    toast.add({
      title: "Success",
      description: "Delete properties successfully!",
      color: "success",
    });
    isDeleteModalOpen.value = false;
    store.fetchProperties();
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.data,
      color: "error",
    });
  }
}
definePageMeta({
  layout: "dashboard",
});
onMounted(async () => {
  await store.fetchProperties();
});
</script>
