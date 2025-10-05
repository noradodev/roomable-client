<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { en, km } from "@nuxt/ui/locale";
const { locale, setLocale , t} = useI18n();

const items = ref(<NavigationMenuItem[]>[
  {
    label: $t("dashboard.sidebar.menu"),
    type: "label",
  },
  {
    label: $t("dashboard.sidebar.dashboard"),
    icon: "i-lucide-layout-dashboard",
    active: true,
  },
  {
    label: $t("dashboard.sidebar.payments"),
    icon: "i-lucide-credit-card",
  },
  {
    label: $t("dashboard.sidebar.maintenance"),
    icon: "i-lucide-construction",
  },  
  {
    label: $t("dashboard.sidebar.data"),
    type: "label",
  },
  {
    label: $t("dashboard.sidebar.properties"),  
    icon: "i-lucide-building",
  },
  {
    label: $t("dashboard.sidebar.tenants"),
    icon: "i-lucide-book-user",
  },
  {
    label: $t("dashboard.sidebar.reports"),
    icon: "i-lucide-file-chart-pie",
  },
  {
    label: $t("dashboard.sidebar.general"),
    type: "label",
  },
  {
    label: $t("dashboard.sidebar.settings"),
    icon: "i-lucide-settings",  
  },
  {
    label: $t("dashboard.sidebar.support"),
    icon: "i-lucide-messages-square",
  },
]);
</script>
<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      class="transition-all duration-300"
      :min-size="100"
    >
      <template #header="{ collapsed }">
        <!-- <Logo class="h-5 w-auto" /> -->

        <!-- <UDashboardSidebarCollapse variant="soft" /> -->
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu :items="items" orientation="vertical">
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
              class="transition-all duration-300 ml-1 whitespace-nowrap"
            >
              {{ item.label }}
            </span>
          </template>
        </UNavigationMenu>
      </template>

      <template #footer="{ collapsed }">
        <div class="space-y-2 w-full">
          <ULocaleSelect v-model="locale" :locales="[en, km]" @update:model-value="setLocale($event)" class="!w-full my-4" />
          <div class="flex items-center space-x-2 px-4">
            <UAvatar src="https://github.com/benjamincanac.png" />
            <div class="flex justify-center items-center space-x-2">
              <span>{{ collapsed ? undefined : "Rado" }}</span>
              <UBadge class="text-nowrap" variant="soft">Normal User</UBadge>
            </div>
          </div>
          <div class="logout-action w-full">
            <UButton
              variant="ghost"
              color="error"
              icon="i-lucide-log-out"
              class="w-full py-4 px-4"
            >
              {{$t("dashboard.sidebar.logout")}}
            </UButton>
          </div>
        </div>
      </template>
    </UDashboardSidebar>
    <slot />
  </UDashboardGroup>
</template>
