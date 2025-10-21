import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import type { User, UserProfile } from "~/types/profile";

export const useProfileStore = defineStore("profile", () => {
  const { data: authData, refresh } = useAuth();
  const api = useApi();

  const current = reactive({
    name: authData?.value?.name || "",
    email: authData?.value?.email || "",
    phone: authData?.value?.profile?.phone || "",
    address: authData?.value?.profile?.address || "",
    telegram_username: authData?.value?.profile?.telegram_username || "",
    roles: authData?.value?.roles || "-",
    telegram_id: authData?.value?.profile?.telegram_id || null,
    profile_image: authData?.value?.profile?.profile_image || "",
  } as UserProfile & { name: string; email: string; roles: string });

  const form = reactive({
    ...current,
  });

  const isEditing = ref(false);
  const previewUrl = ref<string | null>(null);
  const fileName = ref<string | null>(null);
  const loading = ref(false);
  const tgLoading = ref(false);
  const isModalOpen = ref(false);
  const telegramSession = ref({
    link: "",
    expires_at: "",
  });

  function startEdit() {
    isEditing.value = true;
    Object.assign(form, current);
    previewUrl.value = null;
    fileName.value = null;
  }

  function cancelEdit() {
    isEditing.value = false;
    Object.assign(form, current);
    previewUrl.value = null;
    fileName.value = null;
  }

  function onFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
    const file = target.files[0];
    if (!file) return;

    form.profile_image = file;
    fileName.value = file.name;
    previewUrl.value = URL.createObjectURL(file);
  }
  async function connectTelegram() {
    tgLoading.value = true;

    if (
      telegramSession.value &&
      Date.now() < new Date(telegramSession.value.expires_at).getTime()
    ) {
      isModalOpen.value = true;
      tgLoading.value = false;
      return;
    }

    try {
      const res = await api.post("/telegram/connect");
      if (res.success) {
        isModalOpen.value = true;
        telegramSession.value = {
            link: res.data.link,
            expires_at: res.data.expires_at
        };
        
      }
      return res;
    } catch (error: any) {
      console.log(error);
      throw error;
    } finally {
      tgLoading.value = false;
    }
  }

  // Save changes
  async function saveProfile() {
    try {
      loading.value = true;

      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("phone", form.phone || "");
      payload.append("address", form.address || "");
      payload.append("telegram_username", form.telegram_username || "");

      if (form.profile_image instanceof File) {
        payload.append("profile_image", form.profile_image);
      }
      const res = await api.post("/profile/update", payload);
      await refresh();

      Object.assign(current, form);

      isEditing.value = false;
      previewUrl.value = null;
      fileName.value = null;
      
      return res;
    } catch (err: any) {
      console.error("Profile update failed", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }
  return {
    current,
    form,
    isEditing,
    previewUrl,
    fileName,
    loading,
    isModalOpen,
    telegramSession,
    tgLoading,
    authData,
    startEdit,
    cancelEdit,
    onFileChange,
    saveProfile,
    connectTelegram,
  };
});
