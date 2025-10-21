import { defineStore } from "pinia";
import { ref } from "vue";
import { boolean } from "zod";
import type { PaymentMethod } from "~/types/payment";

export const useLandlordPaymentStore = defineStore("ldPayment", () => {
  const current = reactive({
    cash: {
      enabled: true,
      collector_name: "",
      collection_location: "",
    },
    qr: {
      enabled: false,
      name: "ABA QR code",
      qr_image: null as File | null | string,
      instructions: "",
    },
  });
  const paymentMethods = ref<PaymentMethod[]>([]);
  const api = useApi();

  const loading = ref(false);
  const error = ref<string | null>(null);
  const previewUrl = ref<string | null>(null);

  const fetchPaymentMethods = async () => {
    loading.value = true;
    try {
      const res = await api.get("/payment-methods");
      if (res.success && res.data?.payment_methods) {
        paymentMethods.value = res.data.payment_methods.map((m: any) => ({
          ...m,
          configuration: m.configuration || {
            collector_name: "",
            collection_location: "",
            account_name: "",
            instructions: "",
          },
          is_enabled: Boolean(m.is_enabled),
          is_required: Boolean(m.is_required),
        }));
      }
      paymentMethods.value.forEach((m) => {
        if (m.type === "cash") {
          current.cash.enabled = m.is_enabled;
          current.cash.collector_name = m.configuration?.collector_name || "";
          current.cash.collection_location =
            m.configuration?.collection_location || "";
        }
        if (m.type === "qr_code") {
          current.qr.enabled = m.is_enabled;
          current.qr.name = m.name || "";
          current.qr.qr_image = m.qr_image_url || "";
          current.qr.instructions = m.configuration?.instructions || "";
        }
      });

      return res;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };
  function onFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
    const file = target.files[0];
    if (!file) return;

    current.qr.qr_image = file;
    current.qr.name = file.name;
    previewUrl.value = URL.createObjectURL(file);
  }
  function removeFile() {
    current.qr.qr_image = null;
    previewUrl.value = null;
    current.qr.name = "";
  }
  const savePaymentSettings = async () => {
    loading.value = true;
    try {
      const formData = new FormData();

      // Cash
      formData.append("cash[enabled]", current.cash.enabled ? "1" : "0");
      formData.append("cash[collector_name]", current.cash.collector_name);
      formData.append(
        "cash[collection_location]",
        current.cash.collection_location
      );

      // QR
      formData.append("qr[enabled]", current.qr.enabled ? "1" : "0");
      formData.append("qr[name]", current.qr.name);
      formData.append("qr[note]", current.qr.instructions);
      if (current.qr.qr_image) {
        formData.append("qr[qr_image]", current.qr.qr_image);
      }
      console.log(formData);
      await api.post("/payment-methods", formData);
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const getByType = (type: string) =>
    paymentMethods.value.find((m) => m.type === type);

  return {
    paymentMethods,
    current,
    loading,
    error,
    previewUrl,
    onFileChange,
    fetchPaymentMethods,
    savePaymentSettings,
    getByType,
    removeFile,
  };
});
