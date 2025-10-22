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
                  {{ viewProperty?.name || "—" }}
                </p>
              </div>
              <div>
                <p class="text-gray-500 text-sm">City</p>
                <p class="font-medium text-base">
                  {{ viewProperty?.city || "—" }}
                </p>
              </div>
              <div>
                <p class="text-gray-500 text-sm">Address</p>
                <p class="font-medium text-base">
                  {{ viewProperty?.address || "—" }}
                </p>
              </div>
              <div>
                <p class="text-gray-500 text-sm">Description</p>
                <p class="font-medium text-base line-clamp-2">
                  {{ viewProperty?.description || "No description provided." }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 sm:px-6">
        <div class="w-full space-y-8">
          <!-- Floor Sections -->
          <div
            v-for="floor in viewProperty?.floors"
            :key="floor.id"
            class="floor-section bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <!-- Floor Header -->
            <div
              class="floor-header bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200 px-6 py-4"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div
                    class="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center"
                  >
                    <UIcon
                      name="i-heroicons-building-office"
                      class="w-5 h-5 text-white"
                    />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-900">
                      {{ floor.name }}
                    </h3>
                    <p class="text-sm text-primary-600 font-medium">
                      Floor {{ floor.floor_number }} •
                      {{ floor.rooms.length }} rooms
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <UBadge
                    :color="getFloorStatusColor(floor)"
                    variant="subtle"
                    class="font-semibold"
                  >
                    {{ getFloorStatus(floor) }}
                  </UBadge>
                </div>
              </div>
            </div>

            <!-- Rooms Grid -->
            <div class="p-6">
              <div
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                <div
                  v-for="room in floor.rooms"
                  :key="room.id"
                  class="room-card group relative bg-white rounded-xl border-2 p-4 cursor-pointer transition-all duration-100 hover:shadow-lg overflow-hidden hover:border-primary-300"
                  :class="{
                    'border-green-200 hover:border-green-300':
                      room.status === 'available',
                    'border-red-200 hover:border-red-300':
                      room.status === 'occupied',
                    'border-yellow-200 hover:border-yellow-300':
                      room.status === 'maintenance',
                    'border-gray-200 hover:border-gray-300': !room.status,
                  }"
                  @click="handleRoomClick(room)"
                >
                  <!-- Status Indicator -->
                  <div class="absolute top-3 right-3">
                    <div
                      class="w-3 h-3 rounded-full"
                      :class="{
                        'bg-green-500': room.status === 'available',
                        'bg-red-500': room.status === 'occupied',
                        'bg-yellow-500': room.status === 'maintenance',
                        'bg-gray-400': !room.status,
                      }"
                    ></div>
                  </div>

                  <!-- Room Content -->
                  <div class="space-y-3">
                    <!-- Room Number -->
                    <div class="flex items-center space-x-2">
                      <UIcon
                        name="i-heroicons-home"
                        class="w-4 h-4 text-primary-500"
                      />
                      <h4 class="font-bold text-lg text-gray-900">
                        {{ room.room_number }}
                      </h4>
                    </div>

                    <!-- Room Type -->
                    <div class="flex items-center space-x-2">
                      <UIcon
                        name="i-heroicons-cube"
                        class="w-4 h-4 text-gray-500"
                      />
                      <span class="text-sm text-gray-600 font-medium">
                        {{ room.room_type }}
                      </span>
                    </div>

                    <!-- Price -->
                    <div class="flex items-center space-x-2">
                      <UIcon
                        name="i-heroicons-currency-dollar"
                        class="w-4 h-4 text-gray-500"
                      />
                      <span class="text-lg font-bold text-primary-600">
                        ${{ room.price }}/mo
                      </span>
                    </div>

                    <!-- Status Badge -->
                    <div class="flex justify-start">
                      <UBadge
                        :color="getRoomStatusColor(room.status)"
                        variant="subtle"
                        class="capitalize font-semibold text-xs"
                      >
                        {{ room.status || "unknown" }}
                      </UBadge>
                    </div>

                    <div
                      class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-2"
                    >
                      <div class="flex space-x-2">
                        <UButton
                          icon="i-heroicons-eye"
                          color="neutral"
                          variant="ghost"
                          size="xs"
                        />
                        <UButton
                          icon="i-heroicons-pencil"
                          color="primary"
                          variant="ghost"
                          size="xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="floor.rooms.length === 0" class="text-center py-12">
                <UIcon
                  name="i-heroicons-home"
                  class="w-12 h-12 text-gray-300 mx-auto mb-4"
                />
                <p class="text-gray-500 text-lg font-medium">
                  No rooms on this floor
                </p>
                <p class="text-gray-400 text-sm mt-1">
                  Add rooms to get started
                </p>
              </div>
            </div>
          </div>

          <div
            v-if="viewProperty?.floors.length === 0"
            class="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300"
          >
            <UIcon
              name="i-heroicons-building-office"
              class="w-16 h-16 text-gray-400 mx-auto mb-4"
            />
            <h3 class="text-xl font-semibold text-gray-600 mb-2">
              No Floors Available
            </h3>
            <p class="text-gray-500 max-w-md mx-auto">
              This property doesn't have any floors configured yet. Add floors
              to start managing rooms.
            </p>
          </div>
        </div>
      </div>
      <UModal
        :dismissible="false"
        v-model:open="isRoomOpen"
        title="Update Room"
        class="min-w-2xl"
      >
        <template #body>
          <div>
            <UTabs :items="tabs" class="space-y-6">
              <template #room>
                <UForm
                  :state="room"
                  :schema="roomSchema"
                  @submit="onSubmit"
                  class="space-y-8 p-6"
                >
                  <section class="space-y-6">
                    <div class="flex items-center space-x-3">
                      <div class="w-2 h-6 bg-primary-500 rounded-full"></div>
                      <h3
                        class="text-lg font-semibold text-gray-900 dark:text-white"
                      >
                        {{ t("dashboard.room.details") }}
                      </h3>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Room Number -->
                      <UFormField
                        name="room_number"
                        :label="t('dashboard.room.room_number')"
                      >
                        <template #label>
                          <div class="flex items-center space-x-2">
                            <UIcon
                              name="i-heroicons-home-modern"
                              class="w-4 h-4 text-gray-500"
                            />
                            <span
                              class="font-medium text-gray-700 dark:text-gray-300"
                            >
                              {{ t("dashboard.room.room_number") }}
                            </span>
                          </div>
                        </template>
                        <UInput
                          v-model="room.room_number"
                          class="w-full"
                          :placeholder="
                            t('dashboard.room.room_number_placeholder')
                          "
                          size="lg"
                          icon="i-heroicons-home"
                        />
                      </UFormField>

                      <!-- Room Type -->
                      <UFormField
                        name="room_type"
                        :label="t('dashboard.room.room_type')"
                      >
                        <template #label>
                          <div class="flex items-center space-x-2">
                            <UIcon
                              name="i-heroicons-tag"
                              class="w-4 h-4 text-gray-500"
                            />
                            <span
                              class="font-medium text-gray-700 dark:text-gray-300"
                            >
                              {{ t("dashboard.room.room_type") }}
                            </span>
                          </div>
                        </template>
                        <UInput
                          v-model="room.room_type"
                          :placeholder="
                            t('dashboard.room.room_type_placeholder')
                          "
                          size="lg"
                          icon="i-heroicons-tag-20-solid"
                          class="w-full"
                        />
                      </UFormField>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Price -->
                      <UFormField
                        name="price"
                        :label="t('dashboard.room.price')"
                      >
                        <template #label>
                          <div class="flex items-center space-x-2">
                            <UIcon
                              name="i-heroicons-currency-dollar"
                              class="w-4 h-4 text-gray-500"
                            />
                            <span
                              class="font-medium text-gray-700 dark:text-gray-300"
                            >
                              {{ t("dashboard.room.price") }}
                            </span>
                          </div>
                        </template>
                        <UInputNumber
                          class="w-full"
                          v-model="room.price"
                          :placeholder="t('dashboard.content_area.room_price')"
                          :format-options="{
                            style: 'currency',
                            currency: 'USD',
                            currencyDisplay: 'code',
                            currencySign: 'accounting',
                          }"
                          size="lg"
                          :min="0"
                        />
                      </UFormField>

                      <!-- Status -->
                      <UFormField
                        name="status"
                        :label="t('dashboard.room.status')"
                      >
                        <template #label>
                          <div class="flex items-center space-x-2">
                            <UIcon
                              name="i-heroicons-adjustments-horizontal"
                              class="w-4 h-4 text-gray-500"
                            />
                            <span
                              class="font-medium text-gray-700 dark:text-gray-300"
                            >
                              {{ t("dashboard.room.status") }}
                            </span>
                          </div>
                        </template>
                        <USelect
                          v-model="room.status"
                          class="w-full"
                          :items="statusValues"
                          placeholder="Select room status"
                          size="lg"
                        />
                      </UFormField>
                    </div>
                  </section>

                  <section class="space-y-6">
                    <div class="flex items-center space-x-3">
                      <div class="w-2 h-6 bg-primary-500 rounded-full"></div>
                      <h3
                        class="text-lg font-semibold text-gray-900 dark:text-white"
                      >
                        {{ t("dashboard.room.tenant_assignment") }}
                      </h3>
                    </div>

                    <UFormField
                      name="current_tenant_id"
                      :label="t('dashboard.room.current_tenant')"
                    >
                      <template #label>
                        <div class="flex items-center space-x-2">
                          <UIcon
                            name="i-heroicons-user-circle"
                            class="w-4 h-4 text-gray-500"
                          />
                          <span
                            class="font-medium text-gray-700 dark:text-gray-300"
                          >
                            {{ t("dashboard.room.current_tenant") }}
                          </span>
                        </div>
                      </template>

                      <USelectMenu
                        class="w-full"
                        v-model="room.current_tenant_id"
                        :disabled="loading"
                        :loading="loading"
                        :items="[{ id: null, name: '— None —' }, ...tenantList]"
                        label-key="name"
                        value-key="id"
                        placeholder="Select tenant"
                        size="lg"
                        clearable
                      />
                    </UFormField>
                  </section>

                  <section
                    class="flex justify-end space-x-4 pt-8 border-t border-gray-200 dark:border-gray-800"
                  >
                    <UButton
                      type="button"
                      color="neutral"
                      variant="soft"
                      :label="t('common.cancel')"
                      @click="isRoomOpen = false"
                    />
                    <UButton
                      type="submit"
                      color="primary"
                      :label="t('common.save')"
                      icon="i-heroicons-check-20-solid"
                      :ui="{
                        base: 'font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-200',
                      }"
                    />
                  </section>
                </UForm>
              </template>

              <template #maintenance>
                <div class="p-6 text-gray-500 text-center">
                  <UIcon
                    name="i-heroicons-wrench-screwdriver"
                    class="w-6 h-6 mx-auto mb-2"
                  />
                  <p>Maintenance history will appear here later.</p>
                </div>
              </template>
            </UTabs>
          </div>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
import type { FormSubmitEvent, SelectItem, TabsItem } from "@nuxt/ui";
import type { Room, Floor } from "~/types/property";
import { z } from "zod";

const route = useRoute();
const router = useRouter();
const store = usePropertyStore();
const { t } = useI18n();
const toast = useToast();
const { viewProperty, room, tenantList, loading } = storeToRefs(store);
const uuid = route.params.uuid as string;
const isRoomOpen = ref(false);

const tabs: TabsItem[] = [
  { key: "room", label: "Room Details", slot: "room" },
  { key: "maintenance", label: "Maintenance History", slot: "maintenance" },
];
const statusValues = ref<SelectItem[]>([
  [
    { label: "Available", value: "available" },
    { label: "Occupied", value: "occupied" },
    { label: "Maintenance", value: "maintenance" },
  ],
]);

const roomSchema = z.object({
  room_number: z.string().min(1, "Room number required"),
  room_type: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  current_tenant_id: z.string().optional().nullable(),
  status: z.enum(["available", "occupied", "maintenance"]),
});
type Schema = z.output<typeof roomSchema>;

const handleRoomClick = async (currRoom: Room) => {
  await store.fetchRoom(currRoom.id);
  await store.fetchTenantList();
  isRoomOpen.value = true;
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
       const payload = {
      ...event.data,
      current_tenant_id: room.value.current_tenant_id ?? null,
    };
    
    await store.updateRoom(room.value.id, payload);

    isRoomOpen.value = false;
    await store.fetchProperty(uuid);
    toast.add({
      title: "Success",
      description: "Room updated successfully!",
      color: "success",
    });
  } catch (err: any) {
    console.error("Failed to update room:", err.message);
    toast.add({
      title: "Error",
      description: err.data.message || "Unknown unexpected error!",
      color: "error",
    });
  }
};

function getRoomStatusColor(status: string) {
  const colorMap = {
    available: "success",
    occupied: "error",
    maintenance: "warning",
  } as const;
  return colorMap[status as keyof typeof colorMap] || "neutral";
}

function getFloorStatus(floor: Floor) {
  const availableRooms = floor.rooms.filter(
    (room) => room.status === "available"
  ).length;
  const totalRooms = floor.rooms.length;

  if (totalRooms === 0) return "No Rooms";
  if (availableRooms === totalRooms) return "Fully Available";
  if (availableRooms === 0) return "Fully Occupied";
  return "Partially Occupied";
}

function getFloorStatusColor(floor: Floor) {
  const availableRooms = floor.rooms.filter(
    (room) => room.status === "available"
  ).length;
  const totalRooms = floor.rooms.length;

  if (totalRooms === 0) return "neutral";
  if (availableRooms === totalRooms) return "success";
  if (availableRooms === 0) return "error";
  return "warning";
}

definePageMeta({
  layout: "dashboard",
});

onMounted(async () => {
  await store.fetchProperty(uuid);
});
</script>
<style scoped>
.floor-section {
  transition: all 0.3s ease;
}

.floor-section:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.room-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.room-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 6px 6px 0 0;
  background: currentColor;
  opacity: 0.3;
}
</style>
