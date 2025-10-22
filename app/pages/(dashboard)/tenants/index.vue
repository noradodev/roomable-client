<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        :title="t('dashboard.sidebar.tenants')"
        toggle-side="right"
        :toggle="{
          color: 'primary',
          variant: 'soft',
          class: 'rounded-full',
        }"
        class="bg-white"
      >
        <template #right>
          <UInput
            color="primary"
            variant="soft"
            :placeholder="t('dashboard.content_area.search_tenants')"
            icon="i-lucide-search"
            class="w-56"
            size="lg"
          />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="w-full space-y-4 pb-4 bg-white min-h-screen">
        <div class="flex justify-end mt-2 mr-4">
          <UModal
            :title="modalTitle"
            :ui="{ content: 'sm:max-w-4xl' }"
            class="duration-400 transition-all"
            v-model:open="isModalOpen"
          >
            <UButton
              :label="t('dashboard.content_area.add_tenant')"
              color="primary"
              variant="outline"
              class="ml-2"
              size="lg"
              icon="i-lucide-plus"
              @click="openCreateModal"
            />

            <template #body>
              <UForm
                :state="tenantForm"
                :schema="tenantSchema"
                @submit="onSubmit"
                class="space-y-8 p-6"
              >
                <div class="space-y-6">
                  <div class="flex items-center space-x-3">
                    <div class="w-2 h-6 bg-primary-500 rounded-full"></div>
                    <h3
                      class="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                      {{ t("dashboard.tenant.personal_info") }}
                    </h3>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Name Field -->
                    <UFormField name="name" :label="t('dashboard.tenant.name')">
                      <template #label>
                        <div class="flex items-center space-x-2">
                          <UIcon
                            name="i-heroicons-user-circle"
                            class="w-4 h-4 text-gray-500"
                          />
                          <span
                            class="font-medium text-gray-700 dark:text-gray-300"
                          >
                            {{ t("dashboard.tenant.name") }}
                          </span>
                        </div>
                      </template>
                      <UInput
                        v-model="tenantForm.name"
                        :placeholder="t('dashboard.tenant.name_placeholder')"
                        size="lg"
                        class="w-full"
                        icon="i-heroicons-user-20-solid"
                        :ui="{
                          base: 'w-full',
                        }"
                      />
                    </UFormField>

                    <!-- Email Field -->
                    <UFormField
                      name="email"
                      :label="t('dashboard.tenant.email')"
                    >
                      <template #label>
                        <div class="flex items-center space-x-2">
                          <UIcon
                            name="i-heroicons-envelope"
                            class="w-4 h-4 text-gray-500"
                          />
                          <span
                            class="font-medium text-gray-700 dark:text-gray-300"
                          >
                            {{ t("dashboard.tenant.email") }}
                          </span>
                        </div>
                      </template>
                      <UInput
                        v-model="tenantForm.email"
                        type="email"
                        class="w-full"
                        :placeholder="t('dashboard.tenant.email_placeholder')"
                        size="lg"
                        icon="i-heroicons-at-symbol-20-solid"
                        :ui="{
                          base: 'w-full',
                        }"
                      />
                    </UFormField>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Phone Field -->
                    <UFormField
                      name="phone"
                      :label="t('dashboard.tenant.phone')"
                    >
                      <template #label>
                        <div class="flex items-center space-x-2">
                          <UIcon
                            name="i-heroicons-phone"
                            class="w-4 h-4 text-gray-500"
                          />
                          <span
                            class="font-medium text-gray-700 dark:text-gray-300"
                          >
                            {{ t("dashboard.tenant.phone") }}
                          </span>
                        </div>
                      </template>
                      <UInput
                        v-model="tenantForm.phone"
                        :placeholder="t('dashboard.tenant.phone_placeholder')"
                        size="lg"
                        class="w-full"
                        icon="i-heroicons-phone-20-solid"
                        :ui="{
                          base: 'w-full',
                        }"
                      />
                    </UFormField>

                    <!-- Notes Field -->
                    <UFormField
                      name="notes"
                      :label="t('dashboard.tenant.notes')"
                    >
                      <template #label>
                        <div class="flex items-center space-x-2">
                          <UIcon
                            name="i-heroicons-document-text"
                            class="w-4 h-4 text-gray-500"
                          />
                          <span
                            class="font-medium text-gray-700 dark:text-gray-300"
                          >
                            {{ t("dashboard.tenant.notes") }}
                          </span>
                        </div>
                      </template>
                      <UTextarea
                        v-model="tenantForm.notes"
                        :placeholder="t('dashboard.tenant.notes_placeholder')"
                        :rows="3"
                        class="w-full"
                        :ui="{
                          base: 'w-full',
                        }"
                      />
                    </UFormField>
                  </div>
                </div>

                <!-- Dates Section -->
                <div class="space-y-6">
                  <div class="flex items-center space-x-3">
                    <div class="w-2 h-6 bg-primary-500 rounded-full"></div>
                    <h3
                      class="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                      {{ t("dashboard.tenant.important_dates") }}
                    </h3>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Move In Date -->
                    <UFormField
                      name="move_in_date"
                      :label="t('dashboard.tenant.move_in_date')"
                    >
                      <template #label>
                        <div class="flex items-center space-x-2">
                          <UIcon
                            name="i-heroicons-calendar"
                            class="w-4 h-4 text-gray-500"
                          />
                          <span
                            class="font-medium text-gray-700 dark:text-gray-300"
                          >
                            {{ t("dashboard.tenant.move_in_date") }}
                          </span>
                        </div>
                      </template>
                      <UInput
                        v-model="tenantForm.move_in_date"
                        type="date"
                        size="lg"
                        icon="i-heroicons-calendar-20-solid"
                        :ui="{
                          base: 'w-full',
                        }"
                      />
                    </UFormField>

                    <!-- Due Date -->
                    <UFormField
                      name="due_date"
                      :label="t('dashboard.tenant.due_date')"
                    >
                      <template #label>
                        <div class="flex items-center space-x-2">
                          <UIcon
                            name="i-heroicons-clock"
                            class="w-4 h-4 text-gray-500"
                          />
                          <span
                            class="font-medium text-gray-700 dark:text-gray-300"
                          >
                            {{ t("dashboard.tenant.due_date") }}
                          </span>
                        </div>
                      </template>
                      <UInput
                        v-model="tenantForm.due_date"
                        type="date"
                        size="lg"
                        icon="i-heroicons-calendar-days-20-solid"
                        :ui="{
                          base: 'w-full',
                        }"
                      />
                    </UFormField>
                  </div>
                </div>

                <!-- Form Actions -->
                <div
                  class="flex justify-end space-x-4 pt-8 border-t border-gray-200 dark:border-gray-800"
                >
                  <UButton
                    type="button"
                    color="gray"
                    variant="soft"
                    :label="t('common.cancel')"
                    @click="isModalOpen = false"
                    :ui="{
                      rounded: 'rounded-xl',
                      padding: { lg: 'px-6 py-3' },
                    }"
                  />
                  <UButton
                    type="submit"
                    color="primary"
                    :label="submitButtonLabel"
                    icon="i-heroicons-check-20-solid"
                    :ui="{
                      rounded: 'rounded-xl',
                      padding: { lg: 'px-8 py-3' },
                      base: 'font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-200',
                    }"
                  />
                </div>
              </UForm>
            </template>
          </UModal>
        </div>
        <div class="flex justify-end mt-2 mr-4">
          <UModal
            v-model:open="deleteModal.open"
            :ui="{ content: 'sm:max-w-4xl' }"
            class="duration-400 transition-all"
          >
            <template #header>
              <div class="flex items-center justify-between w-full">
                <h3
                  class="text-lg font-semibold text-red-600 dark:text-red-500"
                >
                  Delete Tenant
                </h3>
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-x-mark-20-solid"
                  @click="deleteModal.open = false"
                />
              </div>
            </template>

            <template #body>
              <div class="text-center">
                <div class="flex justify-center mb-4">
                  <div
                    class="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center"
                  >
                    <UIcon
                      name="i-heroicons-exclamation-triangle-20-solid"
                      class="w-6 h-6 text-red-600"
                    />
                  </div>
                </div>

                <h4
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                >
                  Delete {{ deleteModal.tenantName }}?
                </h4>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  This action cannot be undone. All data associated with this
                  tenant will be permanently removed from the system.
                </p>
              </div>
            </template>
            <template #footer>
              <div class="flex justify-end w-full space-x-3">
                <UButton
                  color="gray"
                  variant="ghost"
                  label="Cancel"
                  @click="deleteModal.open = false"
                  :disabled="deleteModal.loading"
                />
                <UButton
                  color="error"
                  :loading="deleteModal.loading"
                  label="Delete Tenant"
                  @click="confirmDelete"
                  icon="i-heroicons-trash-20-solid"
                />
              </div>
            </template>
          </UModal>
        </div>
        <div>
          <UModal
            title="View tenants"
            :ui="{ content: 'sm:max-w-4xl' }"
            class="duration-400 transition-all"
            v-model:open="isViewModalOpen"
          >
            <template #body>
              <div class="space-y-8 p-6">
                <!-- Personal Information Section -->
                <div class="space-y-6">
                  <div class="flex items-center space-x-3">
                    <div class="w-2 h-6 bg-primary-500 rounded-full"></div>
                    <h3
                      class="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                      {{ t("dashboard.tenant.personal_info") }}
                    </h3>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Name Field -->
                    <div class="space-y-2">
                      <div class="flex items-center space-x-2">
                        <UIcon
                          name="i-heroicons-user-circle"
                          class="w-4 h-4 text-gray-500"
                        />
                        <span
                          class="font-medium text-gray-700 dark:text-gray-300"
                        >
                          {{ t("dashboard.tenant.name") }}
                        </span>
                      </div>
                      <p
                        class="text-lg text-gray-900 dark:text-white font-medium bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700"
                      >
                        {{ tenant?.name || "—" }}
                      </p>
                    </div>

                    <!-- Email Field -->
                    <div class="space-y-2">
                      <div class="flex items-center space-x-2">
                        <UIcon
                          name="i-heroicons-envelope"
                          class="w-4 h-4 text-gray-500"
                        />
                        <span
                          class="font-medium text-gray-700 dark:text-gray-300"
                        >
                          {{ t("dashboard.tenant.email") }}
                        </span>
                      </div>
                      <p
                        class="text-lg text-gray-900 dark:text-white font-medium bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700"
                      >
                        {{ tenant?.email ?? "—" }}
                      </p>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Phone Field -->
                    <div class="space-y-2">
                      <div class="flex items-center space-x-2">
                        <UIcon
                          name="i-heroicons-phone"
                          class="w-4 h-4 text-gray-500"
                        />
                        <span
                          class="font-medium text-gray-700 dark:text-gray-300"
                        >
                          {{ t("dashboard.tenant.phone") }}
                        </span>
                      </div>
                      <p
                        class="text-lg text-gray-900 dark:text-white font-medium bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700"
                      >
                        {{ tenant?.phone || "—" }}
                      </p>
                    </div>

                    <!-- Notes Field -->
                    <div class="space-y-2">
                      <div class="flex items-center space-x-2">
                        <UIcon
                          name="i-heroicons-document-text"
                          class="w-4 h-4 text-gray-500"
                        />
                        <span
                          class="font-medium text-gray-700 dark:text-gray-300"
                        >
                          {{ t("dashboard.tenant.notes") }}
                        </span>
                      </div>
                      <p
                        class="text-lg text-gray-900 dark:text-white font-medium bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 min-h-[60px]"
                      >
                        {{ tenant?.notes ?? t("dashboard.tenant.no_notes") }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Dates Section -->
                <div class="space-y-6">
                  <div class="flex items-center space-x-3">
                    <div class="w-2 h-6 bg-primary-500 rounded-full"></div>
                    <h3
                      class="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                      {{ t("dashboard.tenant.important_dates") }}
                    </h3>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Move In Date -->
                    <div class="space-y-2">
                      <div class="flex items-center space-x-2">
                        <UIcon
                          name="i-heroicons-calendar"
                          class="w-4 h-4 text-gray-500"
                        />
                        <span
                          class="font-medium text-gray-700 dark:text-gray-300"
                        >
                          {{ t("dashboard.tenant.move_in_date") }}
                        </span>
                      </div>
                      <p
                        class="text-lg text-gray-900 dark:text-white font-medium bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700"
                      >
                        {{ formattedDate(tenant?.move_in_date) || "—" }}
                      </p>
                    </div>

                    <!-- Due Date -->
                    <div class="space-y-2">
                      <div class="flex items-center space-x-2">
                        <UIcon
                          name="i-heroicons-clock"
                          class="w-4 h-4 text-gray-500"
                        />
                        <span
                          class="font-medium text-gray-700 dark:text-gray-300"
                        >
                          {{ t("dashboard.tenant.due_date") }}
                        </span>
                      </div>
                      <p
                        class="text-lg text-gray-900 dark:text-white font-medium bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700"
                      >
                        {{ formattedDate(tenant?.due_date) ?? "—" }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="space-y-6">
                  <div class="space-y-6">
                    <div class="flex items-center space-x-3">
                      <div class="w-2 h-6 bg-blue-500 rounded-full"></div>
                      <h3
                        class="text-lg font-semibold text-gray-900 dark:text-white"
                      >
                        Telegram Connection
                      </h3>
                    </div>

                    <div class="tg">
                      <!-- State 1: No link & Not connected -->
                      <UButton
                        color="primary"
                        size="lg"
                        class="flex items-center gap-2 cursor-pointer"
                        :disabled="!tenant?.id || tgLoading"
                        :loading="tgLoading"
                        @click="generateAndUpdateLink"
                        v-if="!tenant?.telegram_id && !tenant?.telegram_link"
                      >
                        <img
                          src="./../../../assets/icons/tg.svg"
                          class="w-5 h-5"
                        />
                        Generate Telegram Link
                      </UButton>

                      <!-- State 2: Has link but not connected yet -->
                      <div
                        v-else-if="
                          tenant?.telegram_link && !tenant?.telegram_id
                        "
                        class="space-y-3"
                      >
                        <div class="flex items-center gap-2">
                          <UButton
                            color="success"
                            variant="outline"
                            icon="i-lucide-clipboard"
                            size="lg"
                            class="flex items-center gap-2 cursor-pointer"
                            @click="copyTelegramLink"
                          >
                            
                            Copy Telegram Link
                          </UButton>
                          <!-- <UButton
                            color="gray"
                            variant="ghost"
                            size="sm"
                            @click="
                              tenantStore.regenerateTelegramLink(tenant.id)
                            "
                            :disabled="tgLoading"
                            :loading="tgLoading"
                          >
                            <UIcon
                              name="i-heroicons-arrow-path"
                              class="w-4 h-4"
                            />
                          </UButton> -->
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          Share this link with the tenant to connect their
                          Telegram account
                        </p>
                      </div>

                      <!-- State 3: Connected -->
                      <div
                        v-else-if="tenant?.telegram_id"
                        class="flex items-center gap-3"
                      >
                        <UButton
                          color="primary"
                          variant="soft"
                          size="lg"
                          class="flex items-center gap-2 cursor-pointer"
                          :disabled="tgLoading"
                          :loading="tgLoading"
                        >
                          <img
                            src="./../../../assets/icons/tg.svg"
                            class="w-5 h-5"
                          />
                          Connected: {{ tenant.telegram_id }}
                        </UButton>

                        <!-- <UButton
                          color="red"
                          variant="ghost"
                          size="sm"
                          @click="tenantStore.disconnectTelegram(tenant.id)"
                          :disabled="tgLoading"
                          :loading="tgLoading"
                        >
                          <UIcon
                            name="i-heroicons-link-slash"
                            class="w-4 h-4"
                          />
                          Disconnect
                        </UButton> -->
                      </div>
                    </div>

                    <!-- Help text -->
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{
                        tenant?.telegram_id
                          ? "Tenant is connected to Telegram and can receive notifications."
                          : "Generate a link to connect this tenant to Telegram for notifications."
                      }}
                    </p>
                  </div>
                </div>

                <div
                  class="flex justify-end space-x-4 pt-8 border-t border-gray-200 dark:border-gray-800"
                >
                  <UButton
                    type="button"
                    color="gray"
                    variant="soft"
                    :label="t('common.cancel')"
                    @click="isViewModalOpen = false"
                    :ui="{
                      rounded: 'rounded-xl',
                      padding: { lg: 'px-6 py-3' },
                    }"
                  />
                </div>
              </div>
            </template>
          </UModal>
        </div>
        <UTable
          ref="table"
          v-model:pagination="paginations"
          :data="allTenants"
          :loading="loading"
          :columns="columns"
          :pagination-options="{
            getPaginationRowModel: getPaginationRowModel(),
          }"
          class="flex-1"
        />
        <div class="flex justify-center border-t border-default pt-4">
          <UPagination
            :default-page="
              (table?.tableApi?.getState().pagination.pageIndex || 0) + 1
            "
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
import type { Tenant } from "~/types/tenant";
import { getPaginationRowModel, type Row } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
import type { FormSubmitEvent } from "@nuxt/ui";
import { format, parseISO } from "date-fns";
import { z } from "zod";

const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UButton = resolveComponent("UButton");

const toast = useToast();
const table = useTemplateRef("table");
const { t } = useI18n();
const tenantStore = useTenantStore();
const { allTenants, pagination, tenant, loading, tgLoading } =
  storeToRefs(tenantStore);

const isModalOpen = ref(false);
const isEditingMode = ref(false);
const isViewModalOpen = ref(false);
const editingTenantId = ref<string | null>(null);
const paginations = ref({
  pageIndex: pagination.value?.current_page
    ? pagination.value.current_page - 1
    : 0,
  pageSize: pagination.value?.per_page ?? 10,
});
const tenantForm = reactive({
  name: "",
  email: "",
  phone: "",
  notes: "",
  move_in_date: "",
  due_date: "",
});
const deleteModal = reactive({
  open: false,
  tenantName: "",
  tenantId: "",
  loading: false,
});
const tenantSchema = z.object({
  name: z.string().min(1, t("validation_message.full_name_tenant")),
  email: z.string().email(t("validation_message.email_invalid")),
  phone: z.string().min(1, t("validation_message.phone_number")),
  notes: z.string().optional(),
  move_in_date: z.string().min(1, t("validation_message.move_in_date")),
  due_date: z.string().min(1, t("validation_message.due_date")),
});
type TenantSchema = z.output<typeof tenantSchema>;
const modalTitle = computed(() =>
  isEditingMode.value
    ? t("dashboard.content_area.edit_tenant")
    : t("dashboard.content_area.add_tenant")
);

const submitButtonLabel = computed(() =>
  isEditingMode.value ? t("common.update_tenant") : t("common.save_tenant")
);

const columns: TableColumn<Tenant>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => `#${row.index + 1}`,
  },
  {
    accessorKey: "name",
    header: "Tenant Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: (context) => context.row.original.phone || "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const color = {
        unassigned: "warning" as const,
        assigned: "primary" as const,
        active: "success" as const,
        inactive: "error" as const,
      }[row.original.status];

      return h(
        UBadge,
        {
          class: "capitalize",
          variant: "subtle",
          color,
        },
        () => row.original.status
      );
    },
  },
  {
    accessorKey: "current_tenancy",
    header: "Room",
    cell: (context) =>
      context.row.original.current_tenancy
        ? `${context.row.original.current_tenancy.room_number} - ${context.row.original.current_tenancy.property_name}`
        : "-",
  },
  {
    accessorKey: "move_in_date",
    header: "Move In",
    cell: (context) =>
      context.row.original.move_in_date
        ? new Date(context.row.original.move_in_date).toLocaleDateString(
            "en-GB",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          )
        : "-",
  },
  {
    accessorKey: "move_out_date",
    header: "Move Out",
    cell: (context) =>
      context.row.original.move_out_date
        ? new Date(context.row.original.move_out_date).toLocaleDateString(
            "en-GB",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          )
        : "-",
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: (context) =>
      context.row.original.due_date
        ? new Date(context.row.original.due_date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "-",
  },
  {
    accessorKey: "note",
    header: "Notes",
    cell: (context) => context.row.original.notes || "-",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-right" },
        h(
          UDropdownMenu,
          {
            content: {
              align: "end",
            },
            items: getRowItems(row),
            "aria-label": "Actions dropdown",
          },
          () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              color: "neutral",
              variant: "ghost",
              class: "ml-auto",
              "aria-label": "Actions dropdown",
            })
        )
      );
    },
  },
];

const formattedDate = (date: any) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
function getRowItems(row: Row<Tenant>) {
  return [
    {
      type: "label",
      label: "Actions",
    },
    {
      label: "Edit Tenant",
      icon: "i-heroicons-pencil-square-20-solid",
      onSelect: () => {
        openEditModal(row.original);
      },
    },
    {
      type: "separator",
    },
    {
      label: "View",
      icon: "i-heroicons-eye",
      onSelect: () => {
        viewTenant(row.original.id);
      },
    },
    {
      label: "Delete Tenant",
      icon: "i-heroicons-trash-20-solid",
      onSelect: async () => openDeleteModal(row.original),
    },
  ];
}

function openEditModal(tenant: Tenant) {
  isEditingMode.value = true;
  editingTenantId.value = tenant.id;

  Object.assign(tenantForm, {
    name: tenant.name,
    email: tenant.email,
    phone: tenant.phone || "",
    notes: tenant.notes || "",
    move_in_date: tenant.move_in_date
      ? format(parseISO(tenant.move_in_date), "yyyy-MM-dd")
      : "",
    due_date: tenant.due_date
      ? format(parseISO(tenant.due_date), "yyyy-MM-dd")
      : "",
  });

  isModalOpen.value = true;
}
function openCreateModal() {
  isEditingMode.value = false;
  editingTenantId.value = null;
  resetForm();
  isModalOpen.value = true;
}
function openDeleteModal(tenant: Tenant) {
  deleteModal.tenantName = tenant.name;
  deleteModal.tenantId = tenant.id;
  deleteModal.open = true;
}

const viewTenant = async (tenantId: string) => {
  await tenantStore.fetchTenant(tenantId);
  isViewModalOpen.value = true;
};
function closeModal() {
  isModalOpen.value = false;
  tenantStore.fetchTenants();
  resetForm();
}
const generateAndUpdateLink = async () => {
  if (!tenant?.value?.id) return;
  
  tgLoading.value = true;
  try {
    const response = await tenantStore.connectTelegram(tenant?.value?.id);
    
    if (response?.data?.link) {
      tenant.value.telegram_link = response.data.link;
    }
  } catch (error) {
    console.error('Failed to generate link:', error);
  } finally {
    tgLoading.value = false;
  }
};
async function confirmDelete() {
  deleteModal.loading = true;
  try {
    await tenantStore.deleteTenant(deleteModal.tenantId);

    toast.add({
      title: "Success!",
      description: `${deleteModal.tenantName} has been deleted successfully.`,
      color: "success",
      icon: "i-heroicons-check-circle-20-solid",
    });

    deleteModal.open = false;
    resetDeleteModal();
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to delete tenant. Please try again.",
      color: "error",
      icon: "i-heroicons-exclamation-triangle-20-solid",
    });
    console.error("Error deleting tenant:", error);
  } finally {
    deleteModal.loading = false;
  }
}

function resetForm() {
  Object.assign(tenantForm, {
    name: "",
    email: "",
    phone: "",
    notes: "",
    move_in_date: "",
    due_date: "",
  });
  isEditingMode.value = false;
  editingTenantId.value = null;
}
function resetDeleteModal() {
  deleteModal.tenantName = "";
  deleteModal.tenantId = "";
  deleteModal.loading = false;
}
async function onSubmit(event: FormSubmitEvent<TenantSchema>) {
  try {
    if (isEditingMode.value && editingTenantId.value) {
      await tenantStore.updateTenant(editingTenantId.value, {
        name: event.data.name,
        email: event.data.email,
        phone: event.data.phone,
        notes: event.data.notes,
        move_in_date: event.data.move_in_date,
        due_date: event.data.due_date,
      });

      toast.add({
        title: "Success!",
        description: "Tenant has been updated successfully.",
        color: "success",
        icon: "i-heroicons-check-circle-20-solid",
      });
    } else {
      await tenantStore.createTenant({
        name: event.data.name,
        email: event.data.email,
        phone: event.data.phone,
        notes: event.data.notes,
        move_in_date: event.data.move_in_date,
        due_date: event.data.due_date,
        status: "unassigned",
      });

      toast.add({
        title: "Success!",
        description: "Tenant has been added successfully.",
        color: "success",
        icon: "i-heroicons-check-circle-20-solid",
      });
    }

    closeModal();
  } catch (error) {
    useToast().add({
      title: "Error",
      description: "Failed to add tenant. Please try again.",
      color: "error",
      icon: "i-heroicons-exclamation-triangle-20-solid",
    });
    console.error("Error adding tenant:", error);
  }
}

const copyTelegramLink = async () => {
  if (tenant?.value?.telegram_link) {
    try {
      await navigator.clipboard.writeText(tenant?.value?.telegram_link);
      toast.add({
        title: 'Copied!',
        description: 'Telegram link copied to clipboard',
        color: 'success'
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
};

onMounted(async () => {
  tenantStore.fetchTenants();
});
definePageMeta({
  layout: "dashboard",
});
watch(isModalOpen, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});
watch(
  () => deleteModal.open,
  (newVal) => {
    if (!newVal) {
      resetDeleteModal();
    }
  }
);
</script>
