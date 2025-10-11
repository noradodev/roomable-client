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
                        <UButton color="primary" @click="submitAll">
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
        <div
          v-if="properties.length > 0"
          class="property-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <!-- :status-color="property.statusColor as 'success' | 'error'" -->
          <CommonPropertyCard
            v-for="property in properties"
            :key="property.id"
            :uuid="property.id"
            :image="property.image"
            :location="property.location"
            :status-text="property.statusText"
            :rooms-remaining="property.roomsRemaining"
            :total-rooms="property.totalRooms"
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
      <UModal v-model:open="isEditModalOpen" class="max-w-2xl" 
        :title="t('dashboard.content_area.edit_property')"
      >
        <template #body>
            <PropertyForm v-model="formData.property" />
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
              {{t("dashboard.content_area.delete_property")}}
            </h2>

            <p class="mt-2 text-sm text-gray-500">
              {{t("dashboard.content_area.delete_property_desc1")}}
              <span class="font-medium text-gray-800"
                >#{{ selectedPropertyId }}</span
              >{{t("dashboard.content_area.delete_property_desc2")}}
            </p>

            <div class="mt-6 flex gap-2 sm:flex-row sm:justify-center">
              <UButton
                variant="ghost"
                @click="isDeleteModalOpen = false"
                size="md"
              >
                {{t("dashboard.content_area.cancel_btn")}}
              </UButton>

              <UButton color="error" icon="i-lucide-trash" size="md">
                {{t("dashboard.content_area.delete_btn")}}
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

const currentStep = ref(0);
const items = ref([
  t("dashboard.content_area.latest_property"),
  t("dashboard.content_area.all_properties"),
]);
const value = ref(items.value[0]);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedPropertyId = ref<number | null>(null);

const properties = ref([
  {
    id: 1,
    image:
      "https://filesblog.technavio.org/wp-content/uploads/2018/12/Online-House-Rental-Sites.jpg",
    location: "សៀមរាប Sla Kram, Krong Siem Reab, Siem Reap",
    statusText: "Active",
    statusColor: "success",
    roomsRemaining: 9,
    totalRooms: 10,
  },
  {
    id: 2,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWs8CARoRSpApdMm66SPTLyX6syevmiiiUBg&s",
    location: "Phnom Penh, Toul Kork, Cambodia",
    statusText: "Active",
    statusColor: "success",
    roomsRemaining: 4,
    totalRooms: 8,
  },
  {
    id: 3,
    image:
      "https://condostrategis.ca/wp-content/uploads/2023/08/condo-vs-apartment-difference.jpg",
    location: "Battambang, Svay Paosgdf",
    statusText: "Inactive",
    statusColor: "error",
    roomsRemaining: 0,
    totalRooms: 6,
  },
]);
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
function submitAll() {
  console.log(" Final data submitted:", formData);
}
function handleEdit(propertyId: number) {
  selectedPropertyId.value = propertyId;
  isEditModalOpen.value = true;
}

function handleDelete(propertyId: number) {
  selectedPropertyId.value = propertyId;
  isDeleteModalOpen.value = true;
}
definePageMeta({
  layout: "dashboard",
});
</script>
