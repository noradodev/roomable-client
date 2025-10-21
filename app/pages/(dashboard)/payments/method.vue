<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Payment Setup" class="bg-white" />
    </template>

    <template #body>
      <div class="p-6 space-y-8 bg-white min-h-screen">
        <UAlert
          v-if="!data?.profile.telegram_id"
          dismissible
          color="warning"
          variant="subtle"
          title="Warning"
          description="Please connect your Telegram with your official bot in your profile settings to start recieving automate payment reminder!"
          icon="i-lucide-bell"
        />

        <div>
          <UForm :state="current" @submit="onSubmit">
            <div v-if="loading" class="space-y-4">
              <div
                v-for="n in 2"
                :key="n"
                class="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4 animate-pulse"
              >
                <div class="flex justify-between items-center">
                  <div class="flex items-start space-x-3">
                    <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div class="space-y-2">
                      <div class="w-32 h-4 bg-gray-200 rounded"></div>
                      <div class="w-48 h-3 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                  <div class="w-10 h-6 bg-gray-200 rounded-full"></div>
                </div>
                <div class="space-y-3">
                  <div class="w-full h-4 bg-gray-100 rounded"></div>
                  <div class="w-3/4 h-4 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>
            <div
              v-else
              v-for="payment in paymentMethods"
              :key="payment.id"
              class="space-y-4"
            >
              <UCard class="p-4 space-y-4 mb-4 bg-white">
                <div class="flex justify-between items-center">
                  <div class="flex items-start space-x-3">
                    <div
                      class="p-2 rounded-lg flex justify-center items-center"
                      :class="{
                        'bg-blue-100': payment.type === 'cash',
                        'bg-red-100': payment.type === 'qr_code',
                      }"
                    >
                      <UIcon
                        :name="
                          payment.type === 'cash'
                            ? 'i-heroicons-banknotes'
                            : 'i-heroicons-qr-code'
                        "
                        class="w-6 h-6"
                        :class="{
                          'text-blue-600': payment.type === 'cash',
                          'text-red-600': payment.type === 'qr_code',
                        }"
                      />
                    </div>

                    <div>
                      <h3 class="text-lg font-semibold">{{ payment.name }}</h3>
                      <p class="text-gray-500 text-sm mt-1">
                        {{
                          payment.type === "cash"
                            ? "Record cash payments manually"
                            : "Allow tenants to pay using QR codes"
                        }}
                      </p>
                    </div>
                  </div>

                  <USwitch
                    v-if="payment.type === 'cash'"
                    v-model="current.cash.enabled"
                    :disabled="payment.is_required"
                  />
                  <USwitch
                    v-if="payment.type === 'qr_code'"
                    v-model="current.qr.enabled"
                    :disabled="payment.is_required"
                  />
                </div>

                <!-- Cash Section -->
                <div
                  v-if="payment.type === 'cash' && current.cash.enabled"
                  class="mt-4 space-y-4 pt-4 border-t border-gray-200"
                >
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">
                      Collector Name <span class="text-red-500">*</span>
                    </label>
                    <UInput
                      v-model="current.cash.collector_name"
                      placeholder="Enter collector's full name"
                      class="w-full"
                      size="xl"
                    />
                  </div>

                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">
                      Collection Location
                    </label>
                    <UInput
                      v-model="current.cash.collection_location"
                      placeholder="Enter collection location or address"
                      class="w-full"
                      size="xl"
                    />
                  </div>
                </div>

                <!-- QR Code Section -->
                <div
                  v-if="payment.type === 'qr_code' && current.qr.enabled"
                  class="mt-4 space-y-4 pt-4 border-t border-gray-200"
                >
                  <label class="text-sm text-gray-400 block mb-2"
                    >Upload QR Image</label
                  >
                  <div class="space-y-4 max-w-lg">
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      @change="ldPaymentStore.onFileChange"
                      class="hidden"
                    />
                    <div
                      v-if="previewUrl"
                      class="relative border border-dashed border-gray-400 p-2 rounded-lg"
                    >
                      <p class="text-sm font-semibold mb-2 text-gray-600">
                        Preview:
                      </p>
                      <div class="w-full h-full">
                        <img
                          :src="previewUrl"
                          alt="Payment Proof Preview"
                          class="max-w-full h-auto rounded-md shadow-lg"
                        />
                      </div>
                      <button
                        type="button"
                        @click="ldPaymentStore.removeFile()"
                        class="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1.5 shadow-xl hover:bg-red-700 transition duration-150 z-10 focus:outline-none focus:ring-4 focus:ring-red-300"
                        aria-label="Remove uploaded file"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <label
                    for="image-upload"
                    class="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md cursor-pointer transition duration-300 ease-in-out transform w-full text-lg"
                  >
                    <svg
                      class="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      ></path>
                    </svg>
                    <span>Upload QR Code</span>
                  </label>

                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">
                      Instructions to Tenant (Optional)
                    </label>
                    <UTextarea
                      v-model="current.qr.instructions"
                      placeholder="Add specific instructions for tenants..."
                      :rows="3"
                      size="xl"
                      class="w-full mt-2"
                    />
                  </div>
                </div>
              </UCard>
            </div>
            <div class="space-y-4">
              <div
                v-if="!isFormValid"
                class="bg-orange-50 border border-gray-100 rounded-lg p-4"
              >
                <div
                  class="flex items-center text-orange-700 text-sm space-x-2"
                >
                  <UIcon
                    name="i-heroicons-exclamation-triangle"
                    class="w-4 h-4 mr-2"
                  />
                  <span> Complete required fields to enable payments </span>
                </div>
              </div>

              <UButton
                :disabled="!isFormValid || loading"
                :loading="loading"
                class="w-full py-3 text-lg font-medium"
                type="submit"
                color="primary"
              >
                <template v-if="!loading">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 mr-2" />
                  Save Payment Methods
                </template>
                <template v-else> Saving Settings... </template>
              </UButton>

              <p class="text-center text-sm text-gray-500">
                You can always update these settings later
              </p>
            </div>
          </UForm>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { ref, computed, watch } from "vue";

const { data } = useAuth();
const toast = useToast();
const ldPaymentStore = useLandlordPaymentStore();
const { paymentMethods, loading, current, previewUrl } =
  storeToRefs(ldPaymentStore);

onMounted(async () => {
  await ldPaymentStore.fetchPaymentMethods();
  paymentMethods.value.forEach((payment) => {
    if (payment.type === "cash") {
      current.value.cash.enabled = payment.is_enabled;
      current.value.cash.collector_name =
        payment.configuration?.collector_name || "";
      current.value.cash.collection_location =
        payment.configuration?.collection_location || "";
    } else if (payment.type === "qr_code") {
      current.value.qr.enabled = payment.is_enabled;
      current.value.qr.name = payment.name;
      current.value.qr.instructions = payment.configuration?.instructions || "";
      current.value.qr.qr_image = null;
    }
  });
});

const isFormValid = computed(() => {
  const cashValid = current.value.cash.enabled
    ? current.value.cash.collector_name.trim() !== ""
    : true;
  const qrValid =
    !current.value.qr.enabled ||
    (current.value.qr.name.trim() !== "" && current.value.qr.qr_image !== null);

  return cashValid && qrValid;
});
async function onSubmit(event: FormSubmitEvent<any>) {
  try {
    const res = await ldPaymentStore.savePaymentSettings();
    toast.add({
      title: "Success",
      description: "Payment updated successfully!",
      color: "success",
    });
    return res;
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error?.data?.message || "Unknown unexpected error!",
      color: "error",
    });
  }
}
definePageMeta({
  layout: "dashboard",
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
