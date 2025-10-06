<script setup lang="ts">
const items = ref(["Latest Properties", "All Properties"]);
const value = ref(items.value[0]);
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
definePageMeta({
  layout: "dashboard",
});
</script>
<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        title="Dashboard"
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
          class="head-card-dash grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 px-6 "
        >
          <CommonStatsCard
            icon="i-lucide-building-2"
            :increase="10"
            sub-header="Total Properties"
            :total="12"
          />
          <CommonStatsCard
            icon="i-lucide-building"
            :increase="1"
            sub-header="Total Rooms"
            :total="10"
          />
          <CommonStatsCard
            icon="i-lucide-book-user"
            :increase="1"
            sub-header="Total Tenants"
            :total="10"
          />

          <CommonStatsCard
            icon="i-lucide-credit-card"
            :increase="1"
            sub-header="Total Income"
            total="$120,000"
          />
        </div>
        <div class="properties-wrapper mt-8 bg-white p-4 sm:pt-2 sm:p-6 shadow">
          <div class="flex justify-between items-center my-4">
            <h5>Properties</h5>
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
          >
            <CommonPropertyCard
              v-for="property in properties"
              :key="property.id"
              :image="property.image"
              :location="property.location"
              :status-text="property.statusText"
              :rooms-remaining="property.roomsRemaining"
              :status-color="property.statusColor as 'success' | 'error'"
              :total-rooms="property.totalRooms"
            />
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
<style scoped></style>
