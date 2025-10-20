<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Payment Setup" class="bg-white" />
    </template>

    <template #body>
      <div class="p-6 space-y-8 bg-white">
        <UCard class="p-6 space-y-4 bg-white">
          <div class="flex justify-between items-center">
            <div class="flex items-start space-x-3">
              <div class="p-2 bg-blue-100 rounded-lg flex justify-center items-center">
                <UIcon
                  name="i-heroicons-banknotes"
                  class="w-6 h-6 text-blue-600"
                />
              </div>
              <div>
                <h3 class="text-lg font-semibold">Cash Payment</h3>
                <p class="text-gray-500 text-sm mt-1">
                  Record cash payments from tenants manually
                </p>
              </div>
            </div>
            <USwitch v-model="cashEnabled" :disabled="cashEnabled" />
          </div>

          <div v-if="cashEnabled" class="bg-blue-50 p-3 rounded-lg mt-2">
            <div class="flex items-center text-blue-700 text-sm">
              <UIcon
                name="i-heroicons-information-circle"
                class="w-4 h-4 mr-2"
              />
              Cash payment is required and cannot be disabled
            </div>
          </div>

          <div
            v-if="cashEnabled"
            class="mt-4 space-y-4 pt-4 border-t border-gray-200"
          >
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Collector Name <span class="text-red-500">*</span>
              </label>
              <div class="relative mt-2">
                <UInput
                  v-model="cashCollector"
                  placeholder="Enter collector's full name"
                  class="w-full"
                  size="xl"
                />
                <UIcon
                  v-if="cashCollector"
                  name="i-heroicons-check-circle"
                  class="w-5 h-5 text-green-500 absolute right-3 top-2.5"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Collection Location</label
              >
              <UInput
                v-model="cashLocation"
                placeholder="Enter collection location or address"
                class="w-full mt-2"
                size="xl"
              />
            </div>
          </div>
        </UCard>

        <!-- QR PAYMENT -->
        <UCard class="p-6 space-y-4 bg-white">
          <div class="flex justify-between items-center">
            <div class="flex items-start space-x-3">
              <div class="p-2 bg-green-100 rounded-lg  flex justify-center items-center">
                <UIcon
                  name="i-heroicons-qr-code"
                  class="w-6 h-6 text-green-600"
                />
              </div>
              <div>
                <h3 class="text-lg font-semibold">QR Code Payment</h3>
                <p class="text-gray-500 text-sm mt-1">
                  Allow tenants to pay using QR codes
                </p>
              </div>
            </div>
            <USwitch v-model="qrEnabled" />
          </div>

          <div
            v-if="qrEnabled"
            class="mt-4 space-y-4 pt-4 border-t border-gray-200"
          >
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Payment Name <span class="text-red-500">*</span>
              </label>
              <div class="relative mt-2">
                <USelect
                  v-model="qrName"
                  :options="qrOptions"
                  placeholder="Select payment method"
                  class="w-full"
                  size="xl"
                />
                <UIcon
                  v-if="qrName"
                  name="i-heroicons-check-circle"
                  class="w-5 h-5 text-green-500 absolute right-3 top-2.5"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Upload QR Code <span class="text-red-500">*</span>
              </label>
              <div
                class="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
              >
                <input
                  type="file"
                  ref="fileInput"
                  @change="handleFileUpload"
                  accept="image/*"
                  class="hidden"
                />
                <div
                  class="flex flex-col items-center justify-center space-y-2"
                >
                  <UIcon
                    name="i-heroicons-photo"
                    class="w-8 h-8 text-gray-400"
                  />
                  <div>
                    <button
                      type="button"
                      @click="$refs.fileInput.click()"
                      class="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      Choose QR code image
                    </button>
                    <p class="text-xs text-gray-500 mt-1">
                      JPG, PNG, SVG • Max 5MB
                    </p>
                  </div>
                </div>
                <div
                  v-if="qrFile"
                  class="mt-3 text-sm text-green-600 font-medium"
                >
                  ✓ File selected: {{ qrFile.name }}
                </div>
              </div>

              <div
                v-if="qrFilePreview"
                class="mt-3 p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <img
                  :src="qrFilePreview"
                  alt="QR Code Preview"
                  class="max-w-xs mx-auto rounded-lg border"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Instructions to Tenant (Optional)</label
              >
              <UTextarea
                v-model="qrNote"
                placeholder="Add any specific instructions for tenants..."
                :rows="3"
                size="xl"

                class="w-full mt-2"
              />
              <p class="text-xs text-gray-500">
                This will be shown to tenants when they scan the QR code
              </p>
            </div>
          </div>
        </UCard>

        <!-- SAVE BUTTON -->
        <div class="space-y-4">
          <div
            v-if="!isFormValid"
            class="bg-orange-50 border border-gray-100 rounded-lg p-4"
          >
            <div class="flex items-center text-orange-700 text-sm space-x-2">
              <UIcon
                name="i-heroicons-exclamation-triangle"
                class="w-4 h-4 mr-2"
              />
              <span> Complete required fields to enable payments </span>
            </div>
          </div>

          <UButton
            :disabled="!isFormValid || isSaving"
            :loading="isSaving"
            class="w-full py-3 text-lg font-medium"
            color="primary"
            @click="saveSettings"
          >
            <template v-if="!isSaving">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 mr-2" />
              Save Payment Methods
            </template>
            <template v-else> Saving Settings... </template>
          </UButton>

          <p class="text-center text-sm text-gray-500">
            You can always update these settings later
          </p>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Cash Payment
const cashEnabled = ref(true);
const cashCollector = ref("");
const cashLocation = ref("");

// QR Payment
const qrEnabled = ref(false);
const qrName = ref("");
const qrFile = ref<File | null>(null);
const qrFilePreview = ref<string | null>(null);
const qrNote = ref("");
const isSaving = ref(false);
const fileInput = ref();

// QR Options
const qrOptions = [
  "ABA Pay",
  "Wing Bank",
  "ACLEDA Bank",
  "Chip Mong Bank",
  "Other",
];

// Handle file upload
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    qrFile.value = target.files[0];

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      qrFilePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(qrFile.value);
  }
};

// Form validation
const isFormValid = computed(() => {
  const cashValid = cashEnabled.value
    ? cashCollector.value.trim() !== ""
    : true;
  const qrValid =
    !qrEnabled.value || (qrName.value.trim() !== "" && qrFile.value !== null);

  return cashValid && qrValid;
});

async function saveSettings() {
  if (!isFormValid.value) return;

  isSaving.value = true;

  try {
    const payload = {
      cash: {
        enabled: cashEnabled.value,
        collector_name: cashCollector.value,
        collection_location: cashLocation.value,
      },
      qr: qrEnabled.value
        ? {
            enabled: qrEnabled.value,
            name: qrName.value,
            file: qrFile.value,
            note: qrNote.value,
          }
        : { enabled: false },
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Saving payment settings:", payload);
    router.push("/payments");
  } catch (error) {
    console.error("Failed to save payment settings:", error);
  } finally {
    isSaving.value = false;
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
