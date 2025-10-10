<script setup lang="ts">
import { ref } from "vue";
import type { PropertySchema } from "~/schemas/property.schema";
import type { RoomSetupSchema } from "~/schemas/room.schema";
const { t } = useI18n(); 

const props = defineProps<{
  property: PropertySchema;
  roomSetup: RoomSetupSchema;
}>();

const expandedFloors = ref<number[]>([]);
const toggleFloor = (index: number) => {
  if (expandedFloors.value.includes(index)) {
    expandedFloors.value = expandedFloors.value.filter((i) => i !== index);
  } else {
    expandedFloors.value.push(index);
  }
};

const emit = defineEmits<{
    (e: 'update:currentStep', value: number): void
}>();
const goBackToProperty = () => {
  emit('update:currentStep', 0)
}
const goBackToRoomAndFloor = () => {
    emit('update:currentStep', 1)
}
</script>

<template>
  <div class="space-y-8">
    <div class="text-center space-y-2">
      <h2 class="text-3xl font-bold tracking-tight">{{ t("dashboard.content_area.review_finish") }}</h2>
      <p class="text-gray-500 text-sm">
        {{ t("dashboard.content_area.review_desc") }}
      </p>
    </div>

    <div
      class="bg-white rounded-2xl shadow-xs border p-6 space-y-4 border-neutral-100"
    >
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <UIcon name="i-lucide-building-2" class="text-primary size-5" />
          {{ t("dashboard.content_area.property_details") }}
        </h3>
        <UButton
          variant="soft"
          color="primary"
          icon="i-lucide-pencil"
          size="xs"
          @click="goBackToProperty"
        >
          {{ t("dashboard.content_area.edit_btn") }}
        </UButton>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p class="text-gray-500 text-sm">{{ t("dashboard.content_area.property_name") }}</p>
          <p class="font-medium text-base">{{ props.property.name || "—" }}</p>
        </div>
        <div>
          <p class="text-gray-500 text-sm">City</p>
          <p class="font-medium text-base">{{ props.property.city || "—" }}</p>
        </div>
        <div>
          <p class="text-gray-500 text-sm">{{ t("dashboard.content_area.property_city") }}</p>
          <p class="font-medium text-base">
            {{ props.property.address || "—" }}
          </p>
        </div>
        <div>
          <p class="text-gray-500 text-sm">{{ t("dashboard.content_area.property_description") }}</p>
          <p class="font-medium text-base line-clamp-2">
            {{ props.property.description || "No description provided." }}
          </p>
        </div>
      </div>

      <div v-if="props.property.props_image" class="pt-3">
        <img
          :src="props.property.props_image"
          alt="Property Image"
          class="rounded-xl w-full h-56 object-cover border border-neutral-100"
        />
      </div>
    </div>

    <div
      class="bg-white rounded-2xl shadow-xs border p-6 space-y-4 border-neutral-100"
    >
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <UIcon name="i-lucide-bed" class="text-primary size-5" />
          {{ t("dashboard.content_area.floor_room") }}
        </h3>
        <UButton
          variant="soft"
          color="primary"
          icon="i-lucide-pencil"
          size="xs"
          @click="goBackToRoomAndFloor"

        >
          {{ t("dashboard.content_area.edit_btn") }}
        </UButton>
      </div>

      <div
        v-if="props.roomSetup.floors.length === 0"
        class="text-gray-500 italic text-sm"
      >
        {{ t("dashboard.content_area.no_floor_room") }}
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="(floor, fIndex) in props.roomSetup.floors"
          :key="fIndex"
          class="rounded-xl border p-4 bg-gray-50 hover:bg-gray-100 transition cursor-pointer border-neutral-100"
          @click="toggleFloor(fIndex)"
        >
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <div
                class="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold"
              >
                {{ floor.number }}
              </div>
              <div>
                <p class="font-semibold text-base">
                  {{ floor.name || `Floor ${floor.number}` }}
                </p>
                <p class="text-gray-500 text-xs">
                  {{ floor.rooms.length }}
                  {{ floor.rooms.length === 1 ? "room" : "rooms" }}
                </p>
              </div>
            </div>

            <span
              class="i-lucide-chevron-down size-4 text-gray-400 transition-transform"
              :class="expandedFloors.includes(fIndex) ? 'rotate-180' : ''"
            />
          </div>

          <div
            v-if="expandedFloors.includes(fIndex)"
            class="mt-3 space-y-2 pl-10 transition-all"
          >
            <div
              v-for="(room, rIndex) in floor.rooms"
              :key="rIndex"
              class="flex justify-between items-center bg-white rounded-lg border p-3 text-sm shadow-xs border-neutral-100"
            >
              <div class="flex flex-col">
                <span class="font-medium">Room {{ room.roomNumber }}</span>
                <span class="text-gray-500 text-xs">{{ room.type }}</span>
              </div>
              <span class="font-semibold text-gray-800">${{ room.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
