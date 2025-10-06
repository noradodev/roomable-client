<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        title="Properties"
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
            placeholder="Search properties..."
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
              title="Create a New Property"
              description="Start by adding the property's basic details. Once saved, you can add rooms under this property based on your subscription plan."
              :ui="{ content: 'sm:max-w-4xl' }"
              class="duration-400 transition-all"
            >
              <UButton
                label="Add Property"
                color="primary"
                variant="outline"
                class="ml-2"
                size="lg"
                icon="i-lucide-plus"
              />

              <template #body>
                <UStepper
                  ref="stepper"
                  :items="createPropertiesStepper"
                  disabled
                  :ui="{ title: 'font-bold' }"
                >
                  <template #property>
                    <FormPropertyInfoForm />
                  </template>

                  <template #rooms>
                    <FormRoomForm />
                  </template>

                  <template #review>
                    <Placeholder class="aspect-video"> Checkout </Placeholder>
                  </template>
                </UStepper>
                <div class="flex gap-2 justify-between mt-4">
                  <UButton
                    leading-icon="i-lucide-arrow-left"
                    :disabled="!stepper?.hasPrev"
                    @click="stepper?.prev()"
                  >
                    Prev
                  </UButton>

                  <UButton
                    trailing-icon="i-lucide-arrow-right"
                    :disabled="!stepper?.hasNext"
                    @click="stepper?.next()"
                  >
                    Next
                  </UButton>
                </div>
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
            :image="property.image"
            :location="property.location"
            :status-text="property.statusText"
            :rooms-remaining="property.roomsRemaining"
            :total-rooms="property.totalRooms"
          />
        </div>
            <div
            v-else
            class="no-props flex flex-col items-center justify-center text-center py-16 px-4  rounded-2xl "
          >
            <UIcon
              name="i-lucide-building-2"
              class="text-5xl text-gray-400 mb-4"
            />
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              No Properties Yet
            </h3>
            <p class="text-gray-500 text-sm mb-6 max-w-sm">
              Start by adding your first property to manage rooms, track
              performance, and unlock more features.
            </p>
          </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
const { t } = useI18n();
const stepper = useTemplateRef("stepper");

const items = ref([
  t("dashboard.content_area.latest_properties"),
  t("dashboard.content_area.all_properties"),
]);
const value = ref(items.value[0]);
const properties = ref([
//   {
//     id: 1,
//     image:
//       "https://filesblog.technavio.org/wp-content/uploads/2018/12/Online-House-Rental-Sites.jpg",
//     location: "សៀមរាប Sla Kram, Krong Siem Reab, Siem Reap",
//     statusText: "Active",
//     statusColor: "success",
//     roomsRemaining: 9,
//     totalRooms: 10,
//   },
//   {
//     id: 2,
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWs8CARoRSpApdMm66SPTLyX6syevmiiiUBg&s",
//     location: "Phnom Penh, Toul Kork, Cambodia",
//     statusText: "Active",
//     statusColor: "success",
//     roomsRemaining: 4,
//     totalRooms: 8,
//   },
//   {
//     id: 3,
//     image:
//       "https://condostrategis.ca/wp-content/uploads/2023/08/condo-vs-apartment-difference.jpg",
//     location: "Battambang, Svay Paosgdf",
//     statusText: "Inactive",
//     statusColor: "error",
//     roomsRemaining: 0,
//     totalRooms: 6,
//   },
]);
const createPropertiesStepper = ref([
  {
    title: "Property Information",
    slot: "property" as const,
    description: "Enter the property's name, address, and basic details.",
    icon: "i-lucide-building-2",
  },
  {
    title: "Rooms Setup",
    slot: "rooms" as const,
    description:
      "Add and configure rooms under this property. Limits depend on your plan.",
    icon: "i-lucide-bed",
  },
  {
    title: "Review & Finish",
    slot: "review" as const,
    description: "Check your details before saving.",
    icon: "i-lucide-check-circle",
  },
]);

definePageMeta({
  layout: "dashboard",
});
</script>
