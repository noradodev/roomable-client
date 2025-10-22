<script setup lang="ts">
import { h, resolveComponent } from "vue";
import { getPaginationRowModel, type Row } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
import type { PaymentItem } from "~/types/payment.d";

const { data } = useAuth();

const store = useLandlordPaymentStore();
const {allPayments, loading, pagination} = storeToRefs(store);
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UButton = resolveComponent("UButton");

const table = useTemplateRef("table");
const paginations = ref({
  pageIndex: pagination.value?.current_page
    ? pagination.value.current_page - 1
    : 0,
  pageSize: pagination.value?.per_page ?? 10,
});
const columns: TableColumn<PaymentItem>[] = [
    {
        accessorKey: "tenant_name",
        header: "Tenant Name",
    },
    {
        accessorKey: "room_number",
        header: "Room #",
    },
    {
        accessorKey: "month_years",
        header: "Month",
    },
    {
        accessorKey: "total_amount",
        header: "Total Amount",
        cell: ({ row }) => h(
            'span',
            { class: 'font-medium text-primary-600' },
            `$${row.original.total_amount.toFixed(2)}`
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "method",
        header: "Method",
        cell: ({ row }) => row.original.method ? row.original.method.toUpperCase() : '-',
    },
    {
        accessorKey: "created_at",
        header: "Claim Date",
        // Custom cell for date formatting
        cell: ({ row }) => 
            row.original.created_at
            ? new Date(row.original.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
            })
            : "-",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const getPaymentRowItems = (row: any) => [
                [
                    {
                        label: 'View Details',
                        icon: 'i-heroicons-eye',
                        to: `/payments/view/${row.original.id}`, 
                    },
                ],
            ];

            return h(
                'div',
                { class: 'text-right' },
                h(
                    UDropdownMenu,
                    { items: getPaymentRowItems(row) },
                    () => h(UButton, {
                        icon: 'i-heroicons-ellipsis-vertical',
                        color: 'gray',
                        variant: 'ghost',
                        class: 'ml-auto',
                    })
                )
            );
        },
    },
];

onMounted(async()=> {
  store.fetchListPayments();

})

definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        title="Payments"
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
      <div
        v-if="!data?.profile.telegram_id"
        class="p-6 flex flex-col items-center text-center space-y-4 h-screen justify-center"
      >
        <!-- <img src="/img/empty-payment.svg" class="w-48" alt="" /> -->
        <h2 class="text-lg font-semibold">
          Set up payment to collect rent automatically
        </h2>
        <p class="text-gray-500 max-w-sm">
          To enable automatic rent collection from tenants, please connect your
          bank or payment provider.
        </p>
        <UButton
          color="primary"
          class="rounded-full px-6"
          :to="$localePath('/payments/method')"
        >
          Set up payment
        </UButton>
      </div>
      <div v-else>
        <UTable
          ref="table"
          v-model:pagination="paginations"
          :data="allPayments"
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
