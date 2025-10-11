<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from "@nuxt/ui";
import { en, km } from "@nuxt/ui/locale";
const { locale, setLocale, t } = useI18n({ useScope: "global" });
const localePath = useLocalePath();
const profileItems = ref<DropdownMenuItem[][]>([
  [
    {
      label: 'Rado No',
      avatar: {
        src: 'https://github.com/benjamincanac.png'
      },
      type: 'label'
    }
  ],
  [
    {
      label: t("dashboard.sidebar.profile"),
      icon: 'i-lucide-user'
    },
    {
      label: t("dashboard.sidebar.billing"),
      icon: 'i-lucide-credit-card'
    },
  ],
  [
    {
      label: t("dashboard.sidebar.logout"),
      icon: 'i-lucide-log-out',
      kbds: ['shift', 'meta', 'q']
    }
  ]
])
const items = computed<NavigationMenuItem[]>(() => [
  {
    label: t("dashboard.sidebar.menu"),
    type: "label",
  },
  {
    label: t("dashboard.sidebar.dashboard"),
    icon: "i-lucide-layout-dashboard",
    to: localePath("/dashboard"),
  },
  {
    label: t("dashboard.sidebar.payments"),
    icon: "i-lucide-credit-card",
  },
  {
    label: t("dashboard.sidebar.maintenance"),
    icon: "i-lucide-construction",
  },
  {
    label: t("dashboard.sidebar.data"),
    type: "label",
  },
  {
    label: t("dashboard.sidebar.properties"),
    icon: "i-lucide-building-2",
    to: localePath("/properties"),
  },
  {
    label: t("dashboard.sidebar.tenants"),
    icon: "i-lucide-book-user",
  },
  {
    label: t("dashboard.sidebar.reports"),
    icon: "i-lucide-file-chart-pie",
  },
  {
    label: t("dashboard.sidebar.general"),
    type: "label",
  },
  {
    label: t("dashboard.sidebar.settings"),
    icon: "i-lucide-settings",
  },
  {
    label: t("dashboard.sidebar.support"),
    icon: "i-lucide-messages-square",
    to: "https://t.me/astro_rado",
    target: "_blank",
    badge: "Telegram",
  },
]);
</script>
<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      class="transition-all duration-300 bg-white"
      :min-size="100"
    >
      <template #header="{ collapsed }">
        <NuxtLink to="/" class="mt-3">
          <img
            src="../assets/logo/roomable-logo.svg"
            alt="logo"
            class="w-52 h-auto"
          />
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <USeparator orientation="horizontal" />
        <UDropdownMenu
        :content="{
          side: 'right',
          align: 'start'
        }"
          :items="profileItems"
          :ui="{
            content: 'w-48',
          }"
        >
          <UButton
            variant="ghost"
            color="neutral"
            class="flex justify-between text-neutral-800 my-0"
            size="lg"
            trailing-icon="i-lucide-chevron-right"
          >
            <div class="space-x-2 flex justify-between items-center">
              <div>
                <img
                  src="https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Luis"
                  class="w-10 h-10 rounded-xl"
                />
              </div>
              <div class=" ">
                <div class="flex justify-start flex-col space-x-2">
                  <div class="flex justify-center items-center">
                    <h5 class="text-base text-start p-0 m-0 text-ellipsis">
                      {{ collapsed ? undefined : "Rado No" }}
                    </h5>
                    <UBadge
                      class="text-xs text-start ml-2"
                      variant="subtle"
                      icon="i-lucide-crown"
                      >Pro</UBadge
                    >
                  </div>
                  <div class="text-start">
                    <span class="p-0 m-0 text-xs">+855123456789</span>
                  </div>
                </div>
              </div>
            </div>
          </UButton>
        </UDropdownMenu>

        <USeparator />
        <UNavigationMenu :items="items" orientation="vertical" color="primary">
          <template #item-leading="{ item }">
            <div
              v-show="!item.type"
              class="flex items-center justify-center w-10 h-10 transition-all duration-300"
            >
              <UIcon :name="item.icon ?? ''" class="text-2xl" />
            </div>
          </template>

          <template #item-label="{ item }">
            <span
              v-if="!collapsed"
              class="transition-all duration-300 whitespace-nowrap"
            >
              {{ item.label }}
            </span>
          </template>
        </UNavigationMenu>
      </template>

      <template #footer="{ collapsed }">
        <div class="space-y-2 w-full">
          <ULocaleSelect
            v-model="locale"
            :locales="[en, km]"
            @update:model-value="setLocale($event)"
            variant="outline"
            size="lg"
            class="!w-full py-2 bg-white"
          />

          <div class="logout-action w-full">
            <UButton
              variant="ghost"
              color="error"
              icon="i-lucide-log-out"
              class="w-full py-4"
            >
              {{ t("dashboard.sidebar.logout") }}
            </UButton>
          </div>
        </div>
      </template>
    </UDashboardSidebar>
    <slot />
  </UDashboardGroup>
</template>
