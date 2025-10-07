<script setup lang="ts">
const { t } = useI18n({ useScope: "global" });
const items = ref([
  t("dashboard.content_area.latest_property"),
  t("dashboard.content_area.all_properties"),
]);
const value = ref(items.value[0]);
const properties = ref([
  // {
  //   id: 1,
  //   image:
  //     "https://filesblog.technavio.org/wp-content/uploads/2018/12/Online-House-Rental-Sites.jpg",
  //   location: "សៀមរាប Sla Kram, Krong Siem Reab, Siem Reap",
  //   statusText: "Active",
  //   statusColor: "success",
  //   roomsRemaining: 9,
  //   totalRooms: 10,
  // },
  // {
  //   id: 2,
  //   image:
  //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWs8CARoRSpApdMm66SPTLyX6syevmiiiUBg&s",
  //   location: "Phnom Penh, Toul Kork, Cambodia",
  //   statusText: "Active",
  //   statusColor: "success",
  //   roomsRemaining: 4,
  //   totalRooms: 8,
  // },
  // {
  //   id: 3,
  //   image:
  //     "https://condostrategis.ca/wp-content/uploads/2023/08/condo-vs-apartment-difference.jpg",
  //   location: "Battambang, Svay Paosgdf",
  //   statusText: "Inactive",
  //   statusColor: "error",
  //   roomsRemaining: 0,
  //   totalRooms: 6,     
  // },
]);
definePageMeta({
  layout: "dashboard",
});
</script>
<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        :title="t('dashboard.sidebar.dashboard')"
        toggle-side="right"
        :toggle="{
          color: 'primary',
          variant: 'soft',
          class: 'rounded-full',
        }"
        class="bg-white"
      />
    </template>
    <template #body>
      <div class="dash-overview">
        <div
          class="head-card-dash grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 px-6"
        >
          <CommonStatsCard
            icon="i-lucide-building-2"
            :increase="10"
            :sub-header="t('dashboard.content_area.total_property')"
            :total="12"
          />
          <CommonStatsCard
            icon="i-lucide-building"
            :increase="1"
            :sub-header="t('dashboard.content_area.total_rooms')"
            :total="10"
          />
          <CommonStatsCard
            icon="i-lucide-book-user"
            :increase="1"
            :sub-header="t('dashboard.content_area.total_tenants')"
            :total="10"
          />

          <CommonStatsCard
            icon="i-lucide-credit-card"
            :increase="1"
            :sub-header="t('dashboard.content_area.total_income')"
            total="$120,000"
          />
        </div>
        <div class="properties-wrapper mt-8 bg-white p-4 sm:pt-2 sm:p-6 shadow">
          <div class="flex justify-between items-center my-4">
            <h5 class="font-bold text-lg">
              {{ t("dashboard.sidebar.properties") }}
            </h5>
            <div class="filter-action">
              <USelect
                v-model="value"
                icon="i-lucide-building-2"
                size="md"
                :items="items"
                class="w-48 bg-white shadow"
              />
            </div>
          </div>
          <div
            class="property-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            v-if="properties.length > 0"
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
            class="no-props flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300"
          >
            <UIcon
              name="i-lucide-building-2"
              class="text-5xl text-gray-400 mb-4"
            />
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              {{t("dashboard.content_area.no_property")}}
            </h3>
            <p class="text-gray-500 text-sm mb-6 max-w-sm">
              {{t("dashboard.content_area.no_property_desc")}}
            </p>

            <ULink
              :to="$localePath('/properties')"
              class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-600 text-sm text-white font-medium hover:bg-primary-700 hover:text-white transition-colors duration-200"
            >
              <UIcon name="i-lucide-plus" class="text-base" />
              <span>{{t("dashboard.content_area.add_property")}}</span>
            </ULink>
          </div>
        </div>
        <USeparator />
        <div class="q-section bg-white p-4 sm:pt-2 sm:p-6 shadow">
          <div class="q-maintenance-request">
            <div class="flex justify-between items-center my-4">
              <h5 class="font-bold text-lg">{{t("dashboard.content_area.maintenance-req")}}</h5>
              <div class="filter-action">
                <USelect
                  v-model="value"
                  icon="i-lucide-building-2"
                  size="md"
                  :items="items"
                  class="w-48 bg-white shadow"
                />
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
