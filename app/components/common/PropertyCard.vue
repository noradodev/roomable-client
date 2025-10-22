<template>
  <div class="card rounded-2xl relative shadow flex flex-col min-h-[320px]">
    <div class="props-img">
      <div class="image-wrapper overflow-hidden rounded-t-2xl h-52">
        <NuxtImg
          :src="imageUrl ?? 'https://placehold.co/600x400'"
          class="object-cover h-full w-full"
        />
      </div>
    </div>

    <div
      class="props-content flex justify-between items-center px-4 py-6 bg-white shadow h-full space-x-2"
    >
      <div class="name-loc">
        <p class="font-bold line-clamp-2">
          {{ location }}
        </p>
      </div>
      <div class="props-status">
        <UBadge
          size="lg"
          variant="outline"
          :color="statusColor"
          class="bg-white p-1 px-2"
        >
          {{ statusText ? "Active" : "Inactive" }}
        </UBadge>
      </div>
    </div>

    <div
      class="add-info bg-slate-50 p-4 pt-2 pb-3 rounded-b-2xl border-t-2 border-t-slate-100"
    >
      <span class="text-slate-600 text-sm">{{
        t("dashboard.content_area.room_renting")
      }}</span>
      <div class="flex items-center space-x-2">
        <div class="room-no-info flex justify-center items-center space-x-2">
          <UIcon name="i-lucide-building" />
          <div>
            <p>
              <span class="font-bold">{{ roomsRemaining }}</span
              >/{{ totalRooms }}
            </p>
          </div>
        </div>
        <div class="progress flex-1">
          <UProgress :model-value="roomsRemaining" :max="totalRooms" />
        </div>
      </div>
    </div>

    <!-- Only show dropdown menu if there are any actions available -->
    <div
      v-if="hasActions"
      class="absolute top-4 right-4 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 border border-gray-100/40"
    >
      <UDropdownMenu
        :items="menuItems"
        :content="{
          align: 'start',
          side: 'right',
          sideOffset: 8,
        }"
        :ui="{
          content: 'w-56 bg-white',
        }"
      >
        <template #item-leading="{ item }">
          <UIcon :name="item.icon ?? ''" class="text-2xl my-1 mx-1" />
        </template>
        <UButton
          icon="i-lucide-ellipsis"
          variant="ghost"
          class="cursor-pointer text-white"
        >
        </UButton>
      </UDropdownMenu>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const { t } = useI18n({ useScope: "global" });
const localePath = useLocalePath();
const config = useRuntimeConfig();

interface PropertyCardProps {
  uuid: number | string;
  image: string | null;
  location: string;
  statusText: boolean | number;
  statusColor?: "success" | "error";
  roomsRemaining: number;
  totalRooms: number;
  showEdit?: boolean;
  showView?: boolean;
  showDelete?: boolean;
}

const props = withDefaults(defineProps<PropertyCardProps>(), {
  showEdit: true,
  showDelete: true,
  showView: true,
  statusColor: "success",
});

const progressValue = ref(props.roomsRemaining);
const emit = defineEmits<{
  (e: "view"): void;
  (e: "edit"): void;
  (e: "delete"): void;
}>();

const menuItems = computed(() => {
  const items: DropdownMenuItem[][] = [];

  const firstGroup: DropdownMenuItem[] = [];
  if (props.showView) {
    firstGroup.push({
      label: t("dashboard.content_area.view_rooms"),
      icon: "i-lucide-eye",
      to: localePath(`/properties/${props.uuid}`),
      onSelect: () => {
        emit("view");
      },
    });
  }

  if (props.showEdit) {
    firstGroup.push({
      label: t("dashboard.content_area.edit_property"),
      icon: "i-lucide-pencil",
      onSelect: () => {
        emit("edit");
      },
    });
  }

  // Only add the first group if it has any items
  if (firstGroup.length > 0) {
    items.push(firstGroup);
  }

  if (props.showDelete) {
    items.push([
      {
        label: t("dashboard.content_area.delete_property"),
        color: "error",
        icon: "i-lucide-trash",
        onSelect: () => {
          emit("delete");
        },
      },
    ]);
  }

  return items;
});

// FIX: Include showView in the check
const hasActions = computed(() => {
  return props.showView || props.showEdit || props.showDelete;
});

const imageUrl = computed(() => {
  return props.image
    ? config.public.mediaUrl + "/" + props.image
    : "https://placehold.co/600x400";
});

watch(
  () => props.roomsRemaining,
  (newVal) => {
    progressValue.value = newVal;
  }
);
</script>