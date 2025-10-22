<script setup lang="ts">
const { t } = useI18n({ useScope: "global" });
const store = usePropertyStore();
const { properties, allProperties, loading, dashStats } = storeToRefs(store);
const items = ref([
  t("dashboard.content_area.latest_property"),
  t("dashboard.content_area.all_properties"),
]);
const value = ref(items.value[0]);

definePageMeta({
  layout: "dashboard",
});
onMounted(async () => {
  await store.fetchProperties();
  await store.fetchStats();
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
            :total="dashStats?.data.static_assets.buildings ?? 0"
          />
          <CommonStatsCard
            icon="i-lucide-building"
            :increase="1"
            :sub-header="t('dashboard.content_area.total_rooms')"
            :total="dashStats?.data.static_assets.rooms ?? 0"
          />
          <CommonStatsCard
            icon="i-lucide-book-user"
            :increase="1"
            :sub-header="t('dashboard.content_area.total_tenants')"
            :total="dashStats?.data.static_assets.tenants ?? 0"
          />

          <CommonStatsCard
            icon="i-lucide-credit-card"
            :increase="dashStats?.data.payments.last_month_total ?? 0"
            :sub-header="t('dashboard.content_area.total_income')"
            :total="`$ ${dashStats?.data.payments.current_month_total ?? 0}`"
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
            :show-delete="false"
            :show-edit="false"
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
        <USeparator />
        <div class="q-section bg-white p-4 sm:pt-2 sm:p-6 shadow">
          <div class="q-maintenance-request">
            <div class="flex justify-between items-center my-4">
              <h5 class="font-bold text-lg">{{t("dashboard.content_area.maintenance-req")}}</h5>
              <div class="filter-action">
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
