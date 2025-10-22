<template>
  <div class="flex justify-center p-8 bg-gray-50 min-h-screen">
    <UCard class="w-full max-w-xl">
      <template #header>
        <h1 class="text-2xl font-bold">
          Payment for {{ payment.room_number }} ({{ payment.month }})
        </h1>
        <p class="text-3xl font-extrabold text-primary-500 mt-2">
          Total Due: ${{ formatNumber(payment.total_amount) }}
        </p>
      </template>

      <div v-if="loading" class="text-center">
        <p class="text-lg">Loading payment details...</p>
        <USkeleton class="h-8 w-full mt-4" :count="5" />
      </div>

      <div v-else-if="error" class="text-red-600 p-4">
        <UAlert
          icon="i-heroicons-exclamation-triangle"
          color="red"
          variant="subtle"
          title="Loading Error"
          :description="error"
        />
      </div>

      <div v-else>
        <div v-if="isSubmitted" class="text-center py-10">
          <UIcon
            name="i-heroicons-check-circle"
            class="text-green-500 w-16 h-16 mb-4"
          />
          <h2 class="text-2xl font-bold mb-2 text-green-700">
            Payment Claim Submitted!
          </h2>
          <p class="text-lg mb-6">
            Thank you! Your payment claim has been submitted to the landlord for
            review.
          </p>
          <UButton @click="$router.push('/')" size="xl" icon="i-heroicons-home">
            Return to Dashboard
          </UButton>
        </div>

        <div v-else>
          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-2 text-primary-600">
              Selected Method: {{ method.type_name }}
            </h2>
          </div>

          <div v-if="isCashPayment">
            <div class="space-y-4 mb-6">
              <UAlert
                icon="i-heroicons-information-circle"
                color="blue"
                variant="subtle"
                title="Cash Payment Instructions"
                description="Please pay the full amount to the collector listed below at the specified location. Once paid, confirm the transaction using the form below."
              />

              <div class="grid grid-cols-2 gap-4">
                <UFormField label="Collector Name:">
                  <UInput
                    :model-value="config.collector_name || 'N/A'"
                    icon="i-heroicons-user"
                    disabled
                  />
                </UFormField>
                <UFormField label="Collection Location:">
                  <UInput
                    :model-value="config.collection_location || 'N/A'"
                    icon="i-heroicons-map-pin"
                    disabled
                  />
                </UFormField>
              </div>

              <UFormField v-if="config.instructions" label="Instructions:">
                <UTextarea :model-value="config.instructions" disabled />
              </UFormField>
            </div>

            <UForm
              :state="form"
              @submit="submitPayment"
              class="space-y-4 border p-4 rounded-lg bg-gray-50"
            >
              <h3 class="font-bold">Confirm Payment</h3>
              <UFormField label="Note (Optional):" name="note">
                <UInput
                  v-model="form.note"
                  placeholder="Time of payment, receipt number, etc."
                />
              </UFormField>

              <UButton
                type="submit"
                block
                size="lg"
                :loading="isSubmitting"
                icon="i-heroicons-currency-dollar"
              >
                I Have Paid Cash - Confirm Submission
              </UButton>
            </UForm>
          </div>

          <div v-else-if="isQRorBankPayment" class="space-y-6">
            <UAlert
              icon="i-heroicons-banknotes"
              color="primary"
              variant="subtle"
              title="Online Transfer Instructions"
              description="Please transfer the total amount using the details below. You must upload a screenshot of the successful transfer to submit your payment claim."
            />

            <div
              v-if="qrImageUrl"
              class="text-center p-4 border rounded-lg bg-white shadow-sm"
            >
              <h3 class="text-xl font-semibold mb-3 text-primary-700">
                Scan to Pay
              </h3>
              <img
                :src="qrImageUrl"
                alt="Payment QR Code"
                class="mx-auto border p-2 rounded-lg max-w-[200px] w-full h-auto"
              />
              <p class="text-sm text-gray-500 mt-2">
                Method: {{ method.type_name }}
              </p>
            </div>

            <UFormField
              v-if="config.instructions"
              label="Transfer Details/Instructions:"
            >
              <UTextarea :model-value="config.instructions" disabled />
            </UFormField>

            <UForm
              :state="form"
              @submit="submitPayment"
              class="space-y-4 border p-4 rounded-lg bg-gray-50"
            >
              <h3 class="font-bold border-b pb-2">Proof of Payment</h3>

              <UFormField label="Upload Screenshot/Receipt" name="proof_file">
                <UInput
                  type="file"
                  icon="i-heroicons-arrow-up-tray"
                  @change="handleFileUpload"
                  ref="fileInput"
                  accept="image/*, application/pdf"
                />
                <p v-if="form.proof_file" class="text-sm text-gray-600 mt-1">
                  Selected File: **{{ form.proof_file.name }}**
                </p>
                <p v-else class="text-sm text-red-500 mt-1">
                  *Proof of payment is required for this method.
                </p>
              </UFormField>

              <UFormField label="Note (Optional):" name="note">
                <UInput
                  v-model="form.note"
                  placeholder="Reference number, time of transfer, etc."
                />
              </UFormField>

              <UButton
                type="submit"
                block
                size="lg"
                :loading="isSubmitting"
                icon="i-heroicons-cloud-arrow-up"
                :disabled="!form.proof_file"
              >
                Submit Payment Proof & Claim
              </UButton>
            </UForm>
          </div>

          <div v-else>
            <UAlert
              icon="i-heroicons-x-circle"
              color="red"
              variant="subtle"
              title="Unknown Payment Method"
              description="The selected payment method is not recognized. Please contact your landlord."
            />
          </div>
        </div>
      </div>

      <template #footer>
        <UButton @click="$router.push('/')" variant="link"
          >Back to Dashboard</UButton
        >
      </template>
    </UCard>
    <UNotifications />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
// Assuming useToast is imported/available globally

const route = useRoute();
const toast = useToast();
const api = useApi();
// Use the correct route parameter name for the payment ID
const paymentId = route.params.paymentId;
// Use the correct route parameter name for the method ID
const methodId = route.params.methodId;

const loading = ref(true);
const error = ref(null);
const isSubmitting = ref(false);
const isSubmitted = ref(false);

const payment = ref({ total_amount: 0, month: "", room_number: "" });
const method = ref({ type_name: "" });
// Added file type to config files array
const config = ref({
  instructions: null,
  collector_name: null,
  collection_location: null,
  files: [],
});

const form = ref({
  method_id: methodId,
  note: "",
  proof_file: null, // This must be a File object
});

const fileInput = ref(null);

const isCashPayment = computed(() => {
  const type = method.value.type_name;
  return (
    type &&
    (type.toLowerCase() === "cash" ||
      type.toLowerCase().includes("cash payment"))
  );
});

const isQRorBankPayment = computed(() => {
  const type = method.value.type_name;
  return (
    type &&
    (type.toLowerCase().includes("qr") ||
      type.toLowerCase().includes("bank") ||
      type.toLowerCase().includes("transfer"))
  );
});

const qrImageUrl = computed(() => {
  const qrFile = config.value.files?.find((f) => f.type === "qr_code");
  return qrFile ? qrFile.url : null;
});

const formatNumber = (num) => {
  return num ? Number(num).toFixed(2) : "0.00";
};

const handleFileUpload = (event) => {
  form.value.proof_file = event.target.files ? event.target.files[0] : null;
};

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const apiUrl = `/tenant/payments/${paymentId}/show-method/${methodId}`;

    const response = await api.get(apiUrl);

    if (response.success) {
      payment.value = response.data.payment;
      method.value = response.data.method;
      config.value = response.data.config;

      if (
        response.data.payment.status === "awaiting_confirmation" ||
        response.data.payment.status === "paid"
      ) {
        isSubmitted.value = true;
      }
    } else {
      error.value = response.message || "Failed to retrieve payment details.";
    }
  } catch (err) {
    console.error(err);
    error.value =
      err.data?.message || "A network error occurred while fetching details.";
  } finally {
    loading.value = false;
  }
};

const submitPayment = async () => {
  if (isQRorBankPayment.value && !form.value.proof_file) {
    toast.add({
      title: "Missing File",
      description: "Please upload the payment proof file.",
      icon: "i-heroicons-exclamation-triangle",
      color: "red",
    });
    return;
  }

  isSubmitting.value = true;
  error.value = null;

  try {
    const apiUrl = `/tenant/payments/${paymentId}/submit`;

    const formData = new FormData();
    formData.append("method_id", form.value.method_id);
    formData.append("note", form.value.note || "");

    if (form.value.proof_file) {
      formData.append("proof_file", form.value.proof_file);
    }

    const response = await api.post(apiUrl, formData)

    if (response.success) {
      toast.add({
        title: "Success!",
        description:
          response.message ||
          "Payment submitted successfully and awaiting landlord confirmation.",
        icon: "i-heroicons-check-circle",
        timeout: 5000,
      });

      isSubmitted.value = true;

      form.value.note = "";
      form.value.proof_file = null;
      if (fileInput.value) fileInput.value.value = "";
    } else {
      throw new Error(response.message || "Submission failed.");
    }
  } catch (err) {
    console.error(err);
    const msg =
      err.data?.message ||
      err.message ||
      "Submission failed. Please check the form.";
    toast.add({
      title: "Error Submitting Payment",
      description: msg,
      icon: "i-heroicons-x-circle",
      color: "red",
      timeout: 7000,
    });
    error.value = msg;
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchData();
});

definePageMeta({
  layout: "default",
  auth: {
    unauthenticatedOnly: true,
  },
});
</script>
