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
      <div class="flex justify-center w-full p-8 bg-gray-50 min-h-screen">
        <UCard class="w-full max-w-2xl">
          <template #header>
            <h1 class="text-3xl font-bold text-primary-600">
              Finalize Payment Bill
            </h1>
            <p class="text-gray-500">
              Tenant:
              <span class="font-semibold">{{ payment.tenant_name }}</span> |
              Room:
              <span class="font-semibold">{{ payment.room_number }}</span> |
              Month:
              <span class="font-semibold">{{ payment.month }}</span>
            </p>
          </template>

          <div v-if="loading" class="text-center py-10">
            <p class="text-lg">Loading payment data...</p>
            <USkeleton class="h-8 w-full mt-4" :count="5" />
          </div>

          <div v-else-if="error" class="text-center py-10">
            <UAlert
              icon="i-heroicons-exclamation-triangle"
              color="error"
              variant="subtle"
              title="Error"
              :description="error"
            />
          </div>

          <div v-else>
            <div class="mb-6 p-4 border rounded-lg bg-indigo-50/50">
              <h2 class="text-xl font-semibold mb-2 text-indigo-700">
                Bill Breakdown
              </h2>
              <div class="space-y-1 text-lg">
                <div class="flex justify-between">
                  <span>Monthly Rent (Base):</span>
                  <span class="font-medium text-gray-800"
                    >${{ formatNumber(payment.amount) }}</span
                  >
                </div>
                <div class="flex justify-between">
                  <span>Electricity Cost:</span>
                  <span class="font-medium text-gray-800"
                    >${{ formatNumber(payment.status === 'pending' ? form.electricity_cost : payment.electricity_cost) }}</span
                  >
                </div>
                <div class="flex justify-between">
                  <span>Water Cost:</span>
                  <span class="font-medium text-gray-800"
                    >${{ formatNumber(payment.status === 'pending' ? form.water_cost : payment.water_cost) }}</span
                  >
                </div>
                <div
                  class="flex justify-between font-extrabold text-2xl text-primary-600"
                >
                  <span>TOTAL DUE:</span>
                  <span>${{ formatNumber(totalAmount) }}</span>
                </div>
              </div>
            </div>

            <UForm
              v-if="payment.status === 'pending'"
              :state="form"
              :schema="schema"
              @submit="onSubmit"
              class="space-y-6"
            >
              <UAlert
                icon="i-heroicons-exclamation-triangle"
                color="warning"
                variant="subtle"
                title="Action Required"
                description="Please enter the utility costs below and submit the final bill to the tenant."
                class="mb-4"
              />

              <UFormField label="Electricity Cost" name="electricity_cost">
                <UInput
                  v-model.number="form.electricity_cost"
                  type="number"
                  step="0.01"
                  icon="i-heroicons-bolt"
                  placeholder="0.00"
                />
              </UFormField>

              <UFormField label="Water Cost" name="water_cost">
                <UInput
                  v-model.number="form.water_cost"
                  type="number"
                  step="0.01"
                  icon="i-heroicons-cloud"
                  placeholder="0.00"
                />
              </UFormField>

              <UFormField
                label="Note (Optional)"
                name="note"
              >
                <UTextarea
                  v-model="form.note"
                  placeholder="Add an optional note for the tenant..."
                  :rows="3"
                />
              </UFormField>

              <UButton
                type="submit"
                size="xl"
                block
                :loading="isSubmitting"
                icon="i-heroicons-paper-airplane"
              >
                Submit Final Bill (Total: ${{ formatNumber(totalAmount) }})
              </UButton>
            </UForm>

            <div
                v-else-if="payment.status === 'awaiting_confirmation'"
                class="space-y-6 pt-6 border-t mt-6"
            >
                <UAlert
                    icon="i-heroicons-eye"
                    color="success"
                    variant="soft"
                    title="Payment Claim Received"
                    description="The tenant has submitted their proof of payment. Please review and mark as paid or reject."
                />
                
                <h3 class="text-xl font-semibold text-gray-800 border-b pb-2">Proof of Payment Details</h3>
                
                <div class="p-4 border rounded-lg bg-white shadow-sm">
                    <p class="font-medium mb-2">Tenant Note:</p>
                    <p class="italic text-gray-600">"{{ payment.note || 'No note provided.' }}"</p>
                    
                    
                    <div v-if="payment.proof_of_payment">
                        <p class="font-medium mb-2">Proof File:</p>
                        <ULink 
                            :to="payment.proof_of_payment" 
                            target="_blank" 
                            class="text-primary-500 hover:underline flex items-center"
                        >
                            <UIcon name="i-heroicons-document" class="w-5 h-5 mr-1" />
                            View Payment Proof
                        </ULink>
                    </div>
                    <div v-else>
                        <p class="text-red-500">No proof file uploaded by tenant.</p>
                    </div>
                </div>

                <div class="flex gap-4">
                    <UButton
                        size="xl"
                        class="flex-1 justify-center"
                        color="success"
                        :loading="isSubmitting"
                        icon="i-heroicons-check-circle"
                        @click="confirmPayment"
                    >
                        Mark Paid
                    </UButton>
                    <UButton
                        size="xl"
                        class="flex-1 justify-center"
                        color="error"
                        variant="soft"
                        :disabled="isSubmitting"
                        icon="i-heroicons-x-circle"
                        @click="isRejectModalOpen = true"
                    >
                        Reject Payment
                    </UButton>
                </div>
            </div>

            <div v-else class="space-y-6 pt-6 border-t mt-6">
                <UAlert
                    :icon="payment.status === 'paid' ? 'i-heroicons-check-badge' : 'i-heroicons-information-circle'"
                    :color="payment.status === 'paid' ? 'success' : 'warning'"
                    variant="subtle"
                    :title="payment.status === 'paid' ? 'Status: Payment Complete' : 'Status: Bill Finalized'"
                    :description="payment.status === 'paid' ? 'This bill has been fully paid and confirmed.' : 'This bill has been finalized and sent to the tenant (awaiting_tenant).'"
                    class="mb-4"
                />

                <div v-if="payment.rejection_reason" class="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p class="font-semibold text-red-700">Last Rejection Reason:</p>
                    <p class="text-red-600 italic">{{ payment.rejection_reason }}</p>
                </div>
            </div>
            
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>

  <UModal v-model:open="isRejectModalOpen">
    <template #body>
      <UCard>
      <template #header>
        <h3 class="text-xl font-bold text-red-600">Reject Payment Claim</h3>
      </template>

      <div class="space-y-4">
        <p>Are you sure you want to reject this payment claim? The status will revert to **Awaiting Tenant**.</p>
        
        <UFormField label="Reason for Rejection (Required)" name="rejectReason">
          <UTextarea 
            v-model="rejectReason" 
            class="w-full"
            placeholder="E.g., Proof of payment is blurry, incorrect amount, etc." 
            :rows="4" 
          />
        </UFormField>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
            <UButton color="error" variant="solid" @click="isRejectModalOpen = false" :disabled="isSubmitting">Cancel</UButton>
            <UButton 
                color="error" 
                :loading="isSubmitting" 
                :disabled="!rejectReason"
                @click="rejectPayment"
            >
                Confirm Reject
            </UButton>
        </div>
      </template>
    </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { z } from "zod";

// NOTE: useAuth, useApi, useToast must be defined or imported in your Nuxt/App setup
declare const useAuth: () => { token: Ref<string | undefined> };
declare const useApi: any;
declare const useToast: any;

const { token } = useAuth();
const api = useApi();
const route = useRoute();
const toast = useToast();
const paymentId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

// --- Interfaces ---
interface PaymentDetail {
  amount: number;
  electricity_cost: number;
  water_cost: number;
  total_amount: number;
  status: string;
  month_years: string;
  proof_of_payment?: string | null;     // Added for proof URL
  rejection_reason?: string | null;     // Added for rejection notes
  room?: { room_number: string };
  tenant?: { name: string };
  note?: string | null;
}

interface PaymentState extends PaymentDetail {
  id: string | string[];
  month: string;
  room_number: string;
  tenant_name: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: { payment: T };
}

// --- State ---
const loading = ref(true);
const error = ref<string | null>(null);
const isSubmitting = ref(false);

const isRejectModalOpen = ref(false); 
const rejectReason = ref('');         

const initialPaymentState: PaymentState = {
  id: paymentId,
  amount: 0,
  electricity_cost: 0,
  water_cost: 0,
  total_amount: 0,
  status: "pending",
  month: "",
  room_number: "N/A",
  tenant_name: "N/A",
  proof_of_payment: null,
  rejection_reason: null,
  note: null,
};
const payment = ref<PaymentState>(initialPaymentState);

const form = ref({
  electricity_cost: 0,
  water_cost: 0,
  note: "",
});

// --- Schema (Zod) ---
const schema = z.object({
  electricity_cost: z.preprocess(
    (a) => parseFloat(a as string),
    z.number().min(0, "Must be 0 or greater").default(0)
  ),
  water_cost: z.preprocess(
    (a) => parseFloat(a as string),
    z.number().min(0, "Must be 0 or greater").default(0)
  ),
  note: z.string().nullable().default(null),
});

type Schema = z.output<typeof schema>;

// --- Computed ---
const totalAmount = computed<number>(() => {
  if (payment.value.status === 'pending') {
    const electric = Number(form.value.electricity_cost) || 0;
    const water = Number(form.value.water_cost) || 0;
    const base = Number(payment.value.amount) || 0;
    return base + electric + water;
  }
  return Number(payment.value.total_amount) || 0;
});

const formatNumber = (num: number | string): string => {
  const numericValue = Number(num);
  return isNaN(numericValue) ? "0.00" : numericValue.toFixed(2);
};

// --- API Functions ---

// 1. Fetch data on mount
const fetchData = async () => {
  loading.value = true;
  error.value = null;

  if (!paymentId) {
    error.value = "Payment ID is missing from the route.";
    loading.value = false;
    return;
  }

  try {
    const apiUrl = `/payments/${paymentId}`;

    const response = await api.get(apiUrl);

    if (response.success && response.data.payment) {
      const data = response.data.payment;

      payment.value = {
        ...initialPaymentState,
        id: paymentId,
        amount: Number(data.amount) || 0,
        electricity_cost: Number(data.electricity_cost) || 0,
        water_cost: Number(data.water_cost) || 0,
        total_amount: Number(data.total_amount) || 0,
        status: data.status,
        month: data.month_years,
        room_number: data.room ? data.room.room_number : "N/A",
        tenant_name: data.tenant ? data.tenant.name : "N/A",
        proof_of_payment: data.proof_of_payment || null,
        rejection_reason: data.rejection_reason || null,
        note: data.note || null,
      };

      if (payment.value.status === 'pending') {
          form.value.electricity_cost = payment.value.electricity_cost;
          form.value.water_cost = payment.value.water_cost;
          form.value.note = data.note || "";
      }
    } else {
      error.value = response.message || "Failed to fetch payment details.";
    }
  } catch (err: any) {
    console.error("Fetch Error:", err);
    error.value =
      err.data?.message || "A network error occurred while fetching details.";
  } finally {
    loading.value = false;
  }
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isSubmitting.value = true;
  error.value = null;

  try {
    const validatedForm = schema.parse(form.value);

    const apiUrl = `/payments/${paymentId}`;

    const payload = {
      ...validatedForm,
      total_amount: totalAmount.value,
      status: 'awaiting_tenant', 
    };

    const response = await api.put(apiUrl, payload);

    toast.add({
      title: "Success!",
      description: "Final bill submitted. Tenant has been notified.",
      icon: "i-heroicons-check-circle",
    });
    
    payment.value.status = "awaiting_tenant";
    payment.value.total_amount = totalAmount.value;
    payment.value.electricity_cost = validatedForm.electricity_cost;
    payment.value.water_cost = validatedForm.water_cost;
    payment.value.note = validatedForm.note;

  } catch (err: any) {
    isSubmitting.value = false;
  } finally {
    isSubmitting.value = false;
  }
};

const confirmPayment = async () => {
    isSubmitting.value = true;
    error.value = null;
    
    try {
        const apiUrl = `/payments/${paymentId}/mark-paid`; 
        
        const response = await api.post(apiUrl, { method: 'bank' }); 

        toast.add({
            title: "Confirmed!",
            description: "Payment marked as paid and tenant notified.",
            icon: "i-heroicons-check-circle",
        });
        
        payment.value.status = 'paid';
        payment.value.rejection_reason = null;
        return response;
    } catch (err: any) {
        toast.add({
            title: "Confirmation Error",
            description: err.data?.message || "Failed to mark payment as paid.",
            icon: "i-heroicons-x-circle",
            color: "red",
        });
    } finally {
        isSubmitting.value = false;
    }
}

const rejectPayment = async () => {
    if (!rejectReason.value) return; 
    
    isSubmitting.value = true;
    error.value = null;

    try {
        const apiUrl = `/payments/${paymentId}/reject`; 
        
        const response = await api.put(apiUrl, { 
            rejection_reason: rejectReason.value 
        }); 

        toast.add({
            title: "Rejected!",
            description: "Payment claim rejected. Status reverted, tenant notified.",
            icon: "i-heroicons-x-circle",
            color: "red",
        });
        
        payment.value.status = 'awaiting_tenant';
        payment.value.rejection_reason = rejectReason.value;
        
        isRejectModalOpen.value = false;
        rejectReason.value = ''; 
        return response;

    } catch (err: any) {
        toast.add({
            title: "Rejection Error",
            description: err.data?.message || "Failed to reject payment.",
            icon: "i-heroicons-x-circle",
            color: "red",
        });
    } finally {
        isSubmitting.value = false;
    }
}

onMounted(async () => {
  await fetchData();
});

definePageMeta({
  layout: "dashboard",
});
</script>