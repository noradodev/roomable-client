<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        title="Room Management"
        toggle-side="right"
        :toggle="{
          color: 'primary',
          variant: 'soft',
          class: 'rounded-full',
        }"
        class="bg-white"
      >
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="header-card p-4 sm:px-6 pt-0">
        <div class="p-2 flex text-lg">
          <ULink to="/properties" class="flex space-x-2 items-center"
            ><UIcon name="i-lucide-arrow-left" />
            <p>Back</p></ULink
          >
        </div>
        <div class="property-info">
          <div
            class="bg-white rounded-2xl shadow-xs border p-6 space-y-4 border-neutral-100"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold flex items-center gap-2">
                <UIcon name="i-lucide-building-2" class="text-primary size-5" />
                Property Details
              </h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p class="text-gray-500 text-sm">Name</p>
                <p class="font-medium text-base">
                  {{ property?.name || "—" }}
                </p>
              </div>
              <div>
                <p class="text-gray-500 text-sm">City</p>
                <p class="font-medium text-base">
                  {{ property.city || "—" }}
                </p>
              </div>
              <div>
                <p class="text-gray-500 text-sm">Address</p>
                <p class="font-medium text-base">
                  {{ property?.location || "—" }}
                </p>
              </div>
              <div>
                <p class="text-gray-500 text-sm">Description</p>
                <p class="font-medium text-base line-clamp-2">
                  {{ property.description || "No description provided." }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 sm:px-6">
        <div class="w-full">
          <UTabs
            color="primary"
            variant="link"
            :content="true"
            :items="floorTabs"
            class="w-full"
            size="xl"
          >
            <template
              v-for="floor in floors"
              #[`floor-${floor.id}`]
              :key="floor.id"
            >
              <div
                class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4"
              >
                <div
                  v-for="room in floor.rooms"
                  :key="room.id"
                  class="rounded-xl p-4 border cursor-pointer hover:shadow-xs transition"
                  :class="{
                    'bg-green-50 border-green-300': room.status === 'available',
                    'bg-red-50 border-red-300': room.status === 'occupied',
                    'bg-yellow-50 border-yellow-300':
                      room.status === 'maintenance',
                  }"
                  @click="handleRoomClick(room)"
                >
                  <div class="font-semibold text-lg">
                    Room {{ room.number }}
                  </div>
                  <div class="text-sm text-gray-600">{{ room.type }}</div>
                  <div class="mt-1 font-medium">${{ room.price }}/mo</div>
                  <div
                    class="mt-2 inline-block text-xs px-2 py-1 rounded-full"
                    :class="{
                      'bg-green-200 text-green-800':
                        room.status === 'available',
                      'bg-red-200 text-red-800': room.status === 'occupied',
                      'bg-yellow-200 text-yellow-800':
                        room.status === 'maintenance',
                    }"
                  >
                    {{ room.status }}
                  </div>
                </div>
              </div>
            </template>
          </UTabs>
        </div>
      </div>
      <UModal :dismissible="false" v-model:open="isRoomOpen" title="Update Room">
        <template #body>
         {{ roomToUpdate }}
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
const route = useRoute();
const router = useRouter();

const uuid = route.params.uuid;
const isRoomOpen = ref(false);
const roomToUpdate = ref(<Room>{});

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

interface Room {
  id: number;
  number: string;
  type: string;
  price: number;
  status: "available" | "occupied" | "maintenance";
}

interface Floor {
  id: number;
  name: string;
  rooms: Room[];
}

const floors = ref<Floor[]>([
  {
    id: 1,
    name: "Floor 1",
    rooms: [
      {
        id: 101,
        number: "101",
        type: "Single",
        price: 150,
        status: "available",
      },
      {
        id: 102,
        number: "102",
        type: "Double",
        price: 250,
        status: "available",
      },
      {
        id: 103,
        number: "103",
        type: "Single",
        price: 150,
        status: "maintenance",
      },
    ],
  },
  {
    id: 2,
    name: "Floor 2",
    rooms: [
      {
        id: 201,
        number: "201",
        type: "Single",
        price: 180,
        status: "available",
      },
      { id: 202, number: "202", type: "Suite", price: 300, status: "occupied" },
       {
        id: 201,
        number: "201",
        type: "Single",
        price: 180,
        status: "available",
      },

       {
        id: 2011,
        number: "201",
        type: "Single",
        price: 180,
        status: "available",
      },
       {
        id: 2021,
        number: "201",
        type: "Single",
        price: 180,
        status: "available",
      },
       {
        id: 2011,
        number: "201",
        type: "Single",
        price: 180,
        status: "available",
      },
    ],
  },
]);

const floorTabs = computed<TabsItem[]>(() =>
  floors.value.map((f) => ({ label: f.name, slot: `floor-${f.id}` }))
);

const handleRoomClick = (room: Room) => {
  console.log("Clicked room:", room);
  isRoomOpen.value = true;
  roomToUpdate.value = room
};
const property = properties.value.find((props) => String(props.id) === uuid);
console.log(property?.location);

definePageMeta({
  layout: "dashboard",
});
</script>
