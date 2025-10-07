<template>
  <UForm
    ref="formRef"
    :state="state"
    :schema="roomSetUpSchemas"
    class="space-y-4"
    @submit="handleSubmit"
  >
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-bold">{{  t('dashboard.content_area.floor_room')}}</h3>
      <UButton
        icon="i-lucide-plus"
        color="primary"
        variant="soft"
        @click="addFloor"
      >
        {{ t("dashboard.content_area.add_floor") }}
      </UButton>
    </div>

    <div
      v-if="state.floors.length === 0"
      class="text-center text-gray-500 py-6"
    >
      <p class="text-sm">{{t('dashboard.content_area.no_floor')}}</p>
    </div>

    <div v-for="(floor, fIndex) in state.floors" :key="fIndex">
      <UCard class="bg-white/50">
        <template #header>
          <div class="flex justify-between items-center w-full">
            <div class="flex gap-2">
              <UFormField
                :name="`floors.${fIndex}.name`"
                :label="t('dashboard.content_area.floor_name')"
                required
              >
                <UInput
                  v-model="floor.name"
                  :placeholder="t('dashboard.content_area.floor_plc')"
                  size="lg"
                  class="w-48"
                />
              </UFormField>
              <UFormField
                :name="`floors.${fIndex}.number`"
                :label="t('dashboard.content_area.floor_number')"
                required
              >
                <UInputNumber
                  v-model="floor.number"
                  placeholder="No."
                  size="lg"
                  :min="0"
                  class="w-24"
                />
              </UFormField>
            </div>

            <UButton
              icon="i-lucide-trash"
              color="error"
              variant="ghost"
              @click="removeFloor(fIndex)"
            />
          </div>
        </template>

        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <h4 class="font-semibold">{{ t('dashboard.content_area.room') }}</h4>
            <UButton
              icon="i-lucide-bed"
              size="sm"
              variant="outline"
              color="primary"
              @click="addRoom(fIndex)"
            >
              {{ t("dashboard.content_area.add_room") }}
            </UButton>
          </div>

          <div
            v-if="floor.rooms.length === 0"
            class="text-sm text-gray-400 italic"
          >
            {{t('dashboard.content_area.no_room')}}
          </div>

          <div
            v-for="(room, rIndex) in floor.rooms"
            :key="rIndex"
            class="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center"
          >
            <UInput v-model="room.roomNumber" :placeholder="t('dashboard.content_area.room_plc')" size="lg" />
            <UInput v-model="room.type" :placeholder="t('dashboard.content_area.room_type')" size="lg" />
            <UInputNumber
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
            <div class="flex justify-end">
              <UButton
                icon="i-lucide-trash"
                color="error"
                variant="ghost"
                @click="removeRoom(fIndex, rIndex)"
              />
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <div class="pt-4 flex justify-end gap-2">
      <UButton variant="soft" @click="$emit('back')">{{ t("dashboard.content_area.back_btn") }}</UButton>
      <UButton
        color="primary"
        type="submit"
        trailing-icon="i-lucide-arrow-right"
        :disabled="
          state.floors.length === 0 ||
          state.floors.some((f) => f.rooms.length === 0)
        "
        >{{ t("dashboard.content_area.next_btn") }}</UButton
      >
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoomSetup } from "~/composables/useRoomSetup";
import { roomSetupSchema, type RoomSetupSchema } from "~/schemas/room.schema";
import type { Form } from "@nuxt/ui";
const { t } = useI18n({ useScope: "global" });

const roomSetUpSchemas = roomSetupSchema(t);
const props = defineProps<{
  modelValue?: RoomSetupSchema;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: RoomSetupSchema): void;
  (e: "next"): void;
  (e: "back"): void;
}>();

const { state, addFloor, removeFloor, addRoom, removeRoom } = useRoomSetup(
  props.modelValue ?? { floors: [{ name: "", number: 0, rooms: [] }] }
);
const formRef = ref<Form<RoomSetupSchema> | null>(null);

watch(
  () => state,
  (val) => {
    emit("update:modelValue", JSON.parse(JSON.stringify(val)));
  },
  { deep: true }
);

const handleSubmit = async () => {
  const result = await formRef.value?.validate();

  if (!result) return;

  emit("update:modelValue", JSON.parse(JSON.stringify(state)));
  emit("next");
};
</script>
