<script setup lang="ts">

const { locale, setLocale, t } = useI18n({ useScope: "global" });
const items = ref([
  t("dashboard.content_area.latest_properties"), 
  t("dashboard.content_area.all_properties")
]);
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
      "https://cdn.houseplansservices.com/product/x2d4hk2l9eh1gogmd4sl1rcvj5/w800x533.jpg",
    location: "Phnom Penh, Toul Kork, Cambodia",
    statusText: "Active",
    statusColor: "success",
    roomsRemaining: 4,
    totalRooms: 8,
  },
  {
    id: 3,
    image:
      "https://images.adsttc.com/media/images/58b6/4a64/e58e/cefb/1600/0087/newsletter/house.jpg",
    location: "Battambang, Svay Pao loredfjsfd dhhhhhhhhhhhhhhhh                  hhfsjhgfsdhgfvsgdf",
    statusText: "Inactive",
    statusColor: "error",
    roomsRemaining: 0,
    totalRooms: 6,
  },
  {
    id: 4,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/60/Modern_house_interior_design.jpg",
    location: "Siem Reap, Sala Kamreuk",
    statusText: "Active",
    statusColor: "success",
    roomsRemaining: 7,
    totalRooms: 12,
  },
  {
    id: 5,
    image:
      "https://www.thespruce.com/thmb/3ePi6cp5zFQfZAnhrWwCXStRtyE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/modernhomeexterior-56a3f0233df78cf7727c5b1e.jpg",
    location: "Kampot Riverside, Kampot",
    statusText: "Active",
    statusColor: "success",
    roomsRemaining: 5,
    totalRooms: 5,
  },
  {
    id: 6,
    image:
      "https://assets.architecturaldigest.in/photos/60083e08cbda1a06ad666c02/master/pass/modern-house-design-lead-image-1366x768.jpg",
    location: "Sihanoukville, Village 4",
    statusText: "Active",
    statusColor: "success",
    roomsRemaining: 2,
    totalRooms: 10,
  },
  {
    id: 7,
    image:
      "https://media.architecturaldigest.com/photos/56c4debc9621de0f1d72df34/16:9/w_2560%2Cc_limit/modernist-homes-01.jpg",
    location: "Kep Province, Seaside",
    statusText: "Maintenance",
    statusColor: "error",
    roomsRemaining: 0,
    totalRooms: 4,
  },
  {
    id: 8,
    image:
      "https://www.home-designing.com/wp-content/uploads/2021/09/modern-house-exterior-design.jpg",
    location: "Takeo Province, Bati District",
    statusText: "Active",
    statusColor: "success",
    roomsRemaining: 6,
    totalRooms: 9,
  },
  {
    id: 9,
    image:
      "https://cdn.vox-cdn.com/thumbor/AaDE_M3JR-Fb2qZT0EmQe4o8rsQ=/0x0:3000x2000/1200x800/filters:focal(1260x760:1740x1240)/cdn.vox-cdn.com/uploads/chorus_image/image/65026505/modern_house_exterior.0.jpg",
    location: "Kandal, Takhmao",
    statusText: "Active",
    statusColor: "success",
    roomsRemaining: 3,
    totalRooms: 8,
  },
  {
    id: 10,
    image:
      "https://www.architectureartdesigns.com/wp-content/uploads/2018/06/17-5.jpg",
    location: "Banteay Meanchey, Sisophon",
    statusText: "Active",
    statusColor: "success",
    roomsRemaining: 8,
    totalRooms: 10,
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
          class="head-card-dash grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 px-6 "
        >
          <CommonStatsCard
            icon="i-lucide-building-2"
            :increase="10"
            :sub-header="t('dashboard.content_area.total_properties')"
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
            <h5>{{t('dashboard.sidebar.properties')}}</h5>
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
              :total-rooms="property.totalRooms"
            />
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
<style scoped></style>
